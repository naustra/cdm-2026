UPDATE public.matches AS match
SET
  team_a = confirmed.team_a,
  team_b = confirmed.team_b,
  visible_to_users = true
FROM (
  VALUES
    ('tp', 'fr', 'gb-eng'),
    ('final', 'es', 'ar')
) AS confirmed(match_id, team_a, team_b)
WHERE match.id = confirmed.match_id
  AND match.competition_id IN (
    SELECT id
    FROM public.competitions
    WHERE name = 'Coupe du Monde 2026'
  )
  AND match.tournament_phase IN ('third_place', 'final');
