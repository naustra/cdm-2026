UPDATE public.matches AS match
SET
  team_a = confirmed.team_a,
  team_b = confirmed.team_b,
  visible_to_users = true
FROM (
  VALUES
    ('r16-1', 'ca', 'ma'),
    ('r16-2', 'py', 'fr'),
    ('r16-3', 'br', 'no'),
    ('r16-4', 'mx', 'gb-eng'),
    ('r16-5', 'pt', 'es'),
    ('r16-6', 'us', 'be'),
    ('r16-7', 'ar', 'eg'),
    ('r16-8', 'ch', 'co')
) AS confirmed(match_id, team_a, team_b)
WHERE match.id = confirmed.match_id
  AND match.competition_id IN (
    SELECT id
    FROM public.competitions
    WHERE name = 'Coupe du Monde 2026'
  )
  AND match.tournament_phase = 'round_of_8';
