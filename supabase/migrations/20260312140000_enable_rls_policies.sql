-- ================================================================
-- RLS POLICIES
-- Consistent row-level security for all public tables.
--
-- Roles:
--   anon          → unauthenticated visitors
--   authenticated → logged-in users
--   service_role  → edge functions / cron (bypasses RLS)
--
-- Trigger functions (calculate_match_scores, handle_group_apply,
-- validate_group_apply) are all SECURITY DEFINER → bypass RLS.
-- ================================================================

-- ----------------------------------------------------------------
-- Helper: check if current user is admin
-- SECURITY DEFINER so it reads profiles without triggering RLS.
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ----------------------------------------------------------------
-- Trigger: prevent non-admin users from escalating their own role
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) THEN
      RAISE EXCEPTION 'Only admins can change roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_role_escalation
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- ================================================================
-- PROFILES
-- Read: any authenticated user (ranking, opponents, groups)
-- Write: own row only | Admin: full access
-- ================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_authenticated" ON profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE TO authenticated USING (id = auth.uid());

CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ================================================================
-- TEAMS (reference data)
-- Read: public | Write: admin only
-- ================================================================
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teams_select_all" ON teams
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "teams_admin_all" ON teams
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ================================================================
-- MATCHES
-- Read: public | Write: admin only (edge functions use service_role)
-- ================================================================
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "matches_select_all" ON matches
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "matches_admin_all" ON matches
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ================================================================
-- BETS
-- Read: any authenticated user (group match details)
-- Insert/Update: own bets only | Admin: full access
-- ================================================================
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bets_select_authenticated" ON bets
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "bets_insert_own" ON bets
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "bets_update_own" ON bets
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "bets_admin_all" ON bets
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ----------------------------------------------------------------
-- Trigger: block bets placed after match kick-off
-- Allows updates to points_won only (from scoring trigger).
-- Admins bypass this check.
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_late_bets()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  match_start TIMESTAMPTZ;
BEGIN
  -- Allow scoring-trigger updates (only points_won changes)
  IF TG_OP = 'UPDATE'
     AND NEW.bet_team_a IS NOT DISTINCT FROM OLD.bet_team_a
     AND NEW.bet_team_b IS NOT DISTINCT FROM OLD.bet_team_b THEN
    RETURN NEW;
  END IF;

  -- Admins can always modify bets
  IF is_admin() THEN
    RETURN NEW;
  END IF;

  SELECT date_time INTO match_start
  FROM matches
  WHERE id = NEW.match_id;

  IF match_start IS NOT NULL AND match_start <= now() THEN
    RAISE EXCEPTION 'Les paris sont fermés pour ce match (déjà commencé)';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_late_bets
  BEFORE INSERT OR UPDATE ON bets
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_late_bets();

-- ================================================================
-- COMPETITIONS (reference data)
-- Read: public | Write: admin only
-- ================================================================
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "competitions_select_all" ON competitions
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "competitions_admin_all" ON competitions
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ================================================================
-- GROUPS
-- Read: any authenticated user
-- Create: authenticated (must be creator)
-- Update/Delete: creator or admin
-- ================================================================
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "groups_select_authenticated" ON groups
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "groups_insert_own" ON groups
  FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "groups_update_creator_or_admin" ON groups
  FOR UPDATE TO authenticated
  USING (created_by = auth.uid() OR is_admin());

CREATE POLICY "groups_delete_creator_or_admin" ON groups
  FOR DELETE TO authenticated
  USING (created_by = auth.uid() OR is_admin());

-- ================================================================
-- GROUP_APPLY
-- Read: any authenticated user
-- Insert/Update: own applications only | Admin: full access
-- ================================================================
ALTER TABLE group_apply ENABLE ROW LEVEL SECURITY;

CREATE POLICY "group_apply_select_authenticated" ON group_apply
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "group_apply_insert_own" ON group_apply
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "group_apply_update_own" ON group_apply
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "group_apply_admin_all" ON group_apply
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ================================================================
-- VIEWS: use security_invoker so RLS of underlying tables applies
-- (PostgreSQL 15+ required — we run 17)
-- ================================================================
ALTER VIEW matches_with_teams SET (security_invoker = true);
ALTER VIEW bets_with_profiles SET (security_invoker = true);
ALTER VIEW ranking SET (security_invoker = true);
