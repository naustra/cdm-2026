import isNumber from 'lodash/isNumber'

const Odds = ({ scoreA, scoreB, odds }) => {
  if (!odds?.PA && !odds?.PB && !odds?.PN) return null

  const oddToFocus =
    !isNumber(scoreA) || !isNumber(scoreB)
      ? null
      : scoreA > scoreB
        ? 'PA'
        : scoreA < scoreB
          ? 'PB'
          : 'PN'

  return (
    <div className="match-card__odds">
      <span
        className={`match-card__odd ${oddToFocus === 'PA' ? 'match-card__odd--active' : ''}`}
      >
        {odds.PA}
      </span>
      <span
        className={`match-card__odd ${oddToFocus === 'PN' ? 'match-card__odd--active' : ''}`}
      >
        {odds.PN}
      </span>
      <span
        className={`match-card__odd ${oddToFocus === 'PB' ? 'match-card__odd--active' : ''}`}
      >
        {odds.PB}
      </span>
    </div>
  )
}

export default Odds
