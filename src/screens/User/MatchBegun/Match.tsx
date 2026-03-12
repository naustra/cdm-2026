import { useBetFromUser } from '../../../hooks/bets'
import Flag from '../../../components/Flag'
import { isNumber } from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'
import InformationMatch from '../../Matches/MatchToBet/InformationMatch/InformationMatch'

const facteurMultiplicateurPhase = {
  0: 1,
  5: 1,
  6: 2,
  4: 3,
  2: 5,
  3: 7,
  1: 10,
} as const

function formatPoints(pointsWon: number | null | undefined): string {
  const pts = pointsWon || 0
  if (pts > 0) return `+${pts}`
  return String(pts)
}

function getBetResultClass(
  betA: number | null,
  betB: number | null,
  scoreA: number,
  scoreB: number,
): string {
  if (!isNumber(betA) || !isNumber(betB)) return 'user-bet--missed'
  if (betA === scoreA && betB === scoreB) return 'user-bet--perfect'

  const betSign = Math.sign(betA - betB)
  const scoreSign = Math.sign(scoreA - scoreB)
  if (betSign === scoreSign) return 'user-bet--good'

  return 'user-bet--wrong'
}

const Match = ({ match }: { match: any }) => {
  const { id } = useParams()
  const [currentBet] = useBetFromUser(match.id, id)
  const navigate = useNavigate()

  const hasBet =
    isNumber(currentBet?.betTeamA) && isNumber(currentBet?.betTeamB)
  const pointsWon = currentBet?.pointsWon || 0

  const betResultClass = getBetResultClass(
    currentBet?.betTeamA ?? null,
    currentBet?.betTeamB ?? null,
    match.scores.A,
    match.scores.B,
  )

  if (!match.display) return null

  return (
    <div
      className="match-card match-card--clickable"
      onClick={() => navigate(`/matches/${match.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(`/matches/${match.id}`)
        }
      }}
      role="button"
      tabIndex={0}
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

      <div className={`user-bet-row ${betResultClass}`}>
        <span className="user-bet-row__label">Son prono</span>
        <span className="user-bet-row__prediction">
          {hasBet
            ? `${currentBet?.betTeamA} – ${currentBet?.betTeamB}`
            : 'Pas de prono'}
        </span>
        <span
          className="user-bet-row__points"
          style={{ color: pointsWon > 0 ? '#22c55e' : '#9ca3af' }}
        >
          {formatPoints(currentBet?.pointsWon)}
          {' pts'}
        </span>
        {facteurMultiplicateurPhase[match.phase as keyof typeof facteurMultiplicateurPhase] > 1 && (
          <span className="user-bet-row__mult">
            ×{facteurMultiplicateurPhase[match.phase as keyof typeof facteurMultiplicateurPhase]}
          </span>
        )}
      </div>
    </div>
  )
}

export default Match
