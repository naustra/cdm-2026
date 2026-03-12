CREATE OR REPLACE FUNCTION handle_group_apply()
RETURNS TRIGGER AS $$
BEGIN
  NEW.status := 'validated';
  NEW.validated_at := now();

  UPDATE groups
  SET members = array_append(COALESCE(members, '{}'), NEW.user_id),
      awaiting_members = array_remove(COALESCE(awaiting_members, '{}'), NEW.user_id)
  WHERE id = NEW.group_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_group_apply_insert
  BEFORE INSERT ON group_apply
  FOR EACH ROW
  EXECUTE FUNCTION handle_group_apply();
