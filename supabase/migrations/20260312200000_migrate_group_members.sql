-- Migration: Move from members/awaiting_members arrays to group_members junction table

-- 1. Create group_members table
CREATE TABLE group_members (
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

-- 2. Migrate existing data
INSERT INTO group_members (group_id, user_id, status)
SELECT g.id, unnest(g.members), 'member'
FROM groups g
WHERE g.members IS NOT NULL AND array_length(g.members, 1) > 0;

INSERT INTO group_members (group_id, user_id, status)
SELECT g.id, unnest(g.awaiting_members), 'awaiting'
FROM groups g
WHERE g.awaiting_members IS NOT NULL AND array_length(g.awaiting_members, 1) > 0
ON CONFLICT (group_id, user_id) DO NOTHING;

-- 3. Enable RLS and add policies
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "group_members_select_authenticated" ON group_members
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "group_members_insert_via_trigger" ON group_members
  FOR INSERT TO authenticated WITH CHECK (false);

CREATE POLICY "group_members_delete_admin" ON group_members
  FOR DELETE TO authenticated USING (is_admin());

-- 4. Replace handle_group_apply trigger function
CREATE OR REPLACE FUNCTION handle_group_apply()
RETURNS TRIGGER AS $$
BEGIN
  NEW.status := 'validated';
  NEW.validated_at := now();

  INSERT INTO group_members (group_id, user_id, status)
  VALUES (NEW.group_id, NEW.user_id, 'member')
  ON CONFLICT (group_id, user_id)
  DO UPDATE SET status = 'member';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Replace validate_group_apply RPC
CREATE OR REPLACE FUNCTION validate_group_apply(p_group_id UUID, p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_role TEXT;
BEGIN
  SELECT role INTO caller_role FROM profiles WHERE id = auth.uid();
  IF caller_role IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'User must be an admin';
  END IF;

  UPDATE group_apply
  SET status = 'validated', validated_at = now()
  WHERE group_id = p_group_id AND user_id = p_user_id;

  INSERT INTO group_members (group_id, user_id, status)
  VALUES (p_group_id, p_user_id, 'member')
  ON CONFLICT (group_id, user_id)
  DO UPDATE SET status = 'member';
END;
$$;

-- 6. Drop old columns
ALTER TABLE groups DROP COLUMN members;
ALTER TABLE groups DROP COLUMN awaiting_members;
