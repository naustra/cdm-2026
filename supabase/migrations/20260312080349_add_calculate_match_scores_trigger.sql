CREATE OR REPLACE FUNCTION calculate_match_scores()
RETURNS TRIGGER AS $$
DECLARE
  bet_row RECORD;
  real_result TEXT;
  bet_result TEXT;
  odd_bet NUMERIC;
  goals_diff INTEGER;
  phase_mult INTEGER;
  points INTEGER;
  old_points INTEGER;
BEGIN
  IF (NEW.score_a IS NOT DISTINCT FROM OLD.score_a)
     AND (NEW.score_b IS NOT DISTINCT FROM OLD.score_b) THEN
    RETURN NEW;
  END IF;

  IF NEW.score_a IS NULL OR NEW.score_b IS NULL THEN
    RETURN NEW;
  END IF;

  real_result := CASE
    WHEN NEW.score_a > NEW.score_b THEN 'A'
    WHEN NEW.score_a = NEW.score_b THEN 'N'
    ELSE 'B'
  END;

  phase_mult := CASE COALESCE(NEW.phase, '0')
    WHEN '0' THEN 1
    WHEN '4' THEN 2
    WHEN '2' THEN 4
    WHEN '3' THEN 6
    WHEN '1' THEN 10
    ELSE 1
  END;

  FOR bet_row IN SELECT * FROM bets WHERE match_id = NEW.id LOOP
    old_points := COALESCE(bet_row.points_won, 0);

    bet_result := CASE
      WHEN bet_row.bet_team_a > bet_row.bet_team_b THEN 'A'
      WHEN bet_row.bet_team_a = bet_row.bet_team_b THEN 'N'
      ELSE 'B'
    END;

    IF bet_result != real_result THEN
      points := 0;
    ELSE
      odd_bet := CASE bet_result
        WHEN 'A' THEN COALESCE(NEW.odds_a, 0)
        WHEN 'N' THEN COALESCE(NEW.odds_draw, 0)
        WHEN 'B' THEN COALESCE(NEW.odds_b, 0)
      END;

      goals_diff := ABS(NEW.score_a - bet_row.bet_team_a)
                  + ABS(NEW.score_b - bet_row.bet_team_b);

      points := GREATEST(ROUND((odd_bet - goals_diff) * phase_mult), 0);
    END IF;

    UPDATE bets SET points_won = points WHERE id = bet_row.id;

    UPDATE profiles
    SET score = COALESCE(score, 0) - old_points + points
    WHERE id = bet_row.user_id;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_match_scores_change
  AFTER UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION calculate_match_scores();
