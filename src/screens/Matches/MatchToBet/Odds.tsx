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
    <div className="flex justify-between gap-1.5">
      <span
        className={`flex-1 text-center text-xs font-semibold py-1 rounded-md transition-all duration-150 ${
          oddToFocus === 'PA' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-400'
        }`}
      >
        {odds.PA}
      </span>
      <span
        className={`flex-1 text-center text-xs font-semibold py-1 rounded-md transition-all duration-150 ${
          oddToFocus === 'PN' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-400'
        }`}
      >
        {odds.PN}
      </span>
      <span
        className={`flex-1 text-center text-xs font-semibold py-1 rounded-md transition-all duration-150 ${
          oddToFocus === 'PB' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-400'
        }`}
      >
        {odds.PB}
      </span>
    </div>
  )
}

export default Odds
