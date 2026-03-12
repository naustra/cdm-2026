-- Matches with team names/codes joined (eliminates N+1 queries on match cards)
CREATE OR REPLACE VIEW matches_with_teams AS
SELECT
  m.*,
  ta.name  AS team_a_name,
  ta.code  AS team_a_code,
  tb.name  AS team_b_name,
  tb.code  AS team_b_code
FROM matches m
LEFT JOIN teams ta ON m.team_a = ta.id
LEFT JOIN teams tb ON m.team_b = tb.id;

-- Bets with user profile info (avatar, name) for group match details
CREATE OR REPLACE VIEW bets_with_profiles AS
SELECT
  b.*,
  p.display_name AS user_display_name,
  p.avatar_url   AS user_avatar_url
FROM bets b
LEFT JOIN profiles p ON b.user_id = p.id;

-- Ranking: profiles sorted by score with computed rank
CREATE OR REPLACE VIEW ranking AS
SELECT
  p.id,
  p.display_name,
  p.avatar_url,
  p.score,
  p.winner_team,
  t.name AS winner_team_name,
  t.code AS winner_team_code,
  RANK() OVER (ORDER BY p.score DESC) AS rank
FROM profiles p
LEFT JOIN teams t ON p.winner_team = t.id;
