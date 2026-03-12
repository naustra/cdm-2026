import isNumber from 'lodash/isNumber'

const getMessage = (betTeamA, betTeamB, pointsWon, maxPoints) => {
  const hasBet = isNumber(betTeamA) && isNumber(betTeamB)

  if (!hasBet) return "Il n'a pas pronostiqué"
  if (!pointsWon) return "Il n'a pas marqué de points"
  if (pointsWon === maxPoints) return 'Score parfait pronostiqué !'

  return 'Bon résultat pronostiqué'
}

const PointsWon = ({ betTeamA, betTeamB, pointsWon, scores, odds }) => {
  if (!scores) return null

  const { A, B } = scores
  const oddScore = A > B ? odds.PA : A < B ? odds.PB : odds.PN

  const isPositive = pointsWon > 0

  return (
    <div
      title={getMessage(betTeamA, betTeamB, pointsWon, oddScore)}
      className="flex flex-col items-center gap-0.5"
    >
      <span className="text-[0.625rem] text-gray-400 font-medium uppercase tracking-wide">Points</span>
      <span
        className={`text-xs font-bold ${isPositive ? 'text-green-500' : 'text-navy'}`}
      >
        {pointsWon > 0 ? '+' : ''}
        {pointsWon || 0}
      </span>
    </div>
  )
}

export default PointsWon
