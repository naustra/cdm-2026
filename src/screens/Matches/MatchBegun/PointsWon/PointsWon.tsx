import isNumber from 'lodash/isNumber'

function getMessage(betTeamA: number | null, betTeamB: number | null, pointsWon: number, maxPoints: number): string {
  const hasBet = isNumber(betTeamA) && isNumber(betTeamB)

  if (!hasBet) return "Vous n'avez pas pronostiqué"
  if (!pointsWon) return "Vous n'avez pas marqué de points"
  if (pointsWon === maxPoints) return 'Vous avez pronostiqué le score parfait!'

  return 'Vous avez pronostiqué le bon résultat'
}

const PointsWon = ({ betTeamA, betTeamB, pointsWon, scores, odds }: any) => {
  if (!scores) return null

  const { A, B } = scores
  const oddScore = A > B ? odds.PA : A < B ? odds.PB : odds.PN

  const isPositive = pointsWon > 0

  return (
    <div
      className="match-card__stat"
      title={getMessage(betTeamA, betTeamB, pointsWon, oddScore)}
    >
      <span className="match-card__stat-label">Points</span>
      <span
        className="match-card__stat-value"
        style={{ color: isPositive ? '#22c55e' : undefined }}
      >
        {pointsWon > 0 ? '+' : ''}
        {pointsWon || 0}
      </span>
    </div>
  )
}

export default PointsWon
