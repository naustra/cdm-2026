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

  UPDATE groups
  SET awaiting_members = array_remove(COALESCE(awaiting_members, '{}'), p_user_id),
      members = array_append(COALESCE(members, '{}'), p_user_id)
  WHERE id = p_group_id;
END;
$$;
