-- Fix prevent_role_escalation trigger to allow role changes from the Supabase dashboard (postgres/service_role)
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Bypass check for postgres, service_role, and supabase_admin roles
    IF current_user IN ('postgres', 'service_role', 'supabase_admin') THEN
      RETURN NEW;
    END IF;

    -- Otherwise, ensure the executing user is an admin
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
