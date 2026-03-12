import { useBet } from '../../../hooks/bets'
import Flag from '../../../components/Flag'
import PointsWon from './PointsWon/PointsWon'
import { isNumber } from 'lodash'
import { useNavigate } from 'react-router-dom'
import InformationMatch from '../MatchToBet/InformationMatch'

const facteurMultiplicateurPhase = {
  0: 1,
  5: 1,
  6: 2,
  4: 3,
  2: 5,
  3: 7,
  1: 10,
}

const Match = ({ match }) => {
  const [currentBet] = useBet(match.id)
  const navigate = useNavigate()

  const myOdd =
    !isNumber(currentBet?.betTeamA) || !isNumber(currentBet?.betTeamB)
      ? null
      : currentBet?.betTeamA > currentBet?.betTeamB
        ? match.odds.PA
        : currentBet?.betTeamA < currentBet?.betTeamB
          ? match.odds.PB
          : match.odds.PN

  const winningOdd =
    match.scores.A > match.scores.B
      ? match.odds.PA
      : match.scores.A < match.scores.B
        ? match.odds.PB
        : match.odds.PN

  if (!match.display) return null

  return (
    <button
      className="match-card match-card--clickable"
      onClick={() => navigate(`/matches/${match.id}`)}
    >
      <div className="match-card__header">
        <InformationMatch phase={match.phase} groupName={match.groupName} />
      </div>

      <div className="match-card__teams">
        <div className="match-card__team">
          <Flag country={match.teamACode} className="match-card__flag" />
          <span className="match-card__team-name">
            {match.teamAName ?? 'À déterminer'}
          </span>
        </div>

        <div className="match-card__result">
          <span className="match-card__score">
            {match.scores.A} – {match.scores.B}
          </span>
        </div>

        <div className="match-card__team">
          <Flag country={match.teamBCode} className="match-card__flag" />
          <span className="match-card__team-name">
            {match.teamBName ?? 'À déterminer'}
          </span>
        </div>
      </div>

      <div className="match-card__stats">
        <div className="match-card__stat">
          <span className="match-card__stat-label">Ma cote</span>
          <span className="match-card__stat-value">{myOdd ?? '–'}</span>
        </div>
        <div className="match-card__stat">
          <span className="match-card__stat-label">Cote gagnante</span>
          <span className="match-card__stat-value">{winningOdd}</span>
        </div>
        <div className="match-card__stat">
          <span className="match-card__stat-label">Multiplicateur</span>
          <span className="match-card__stat-value">
            x{facteurMultiplicateurPhase[match.phase]}
          </span>
        </div>
        <div className="match-card__stat">
          <span className="match-card__stat-label">Mon prono</span>
          <span className="match-card__stat-value">
            {currentBet?.betTeamA ?? '–'} – {currentBet?.betTeamB ?? '–'}
          </span>
        </div>
        <PointsWon {...match} {...currentBet} />
      </div>
    </button>
  )
}

export default Match
