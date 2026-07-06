UPDATE public.matches AS match
SET
  team_a = confirmed.team_a,
  team_b = confirmed.team_b,
  visible_to_users = true
FROM (
  VALUES
    ('qf-1', 'fr', 'ma'),
    ('qf-3', 'no', 'gb-eng')
) AS confirmed(match_id, team_a, team_b)
WHERE match.id = confirmed.match_id
  AND match.competition_id IN (
    SELECT id
    FROM public.competitions
    WHERE name = 'Coupe du Monde 2026'
  )
  AND match.tournament_phase = 'quarter_final';
