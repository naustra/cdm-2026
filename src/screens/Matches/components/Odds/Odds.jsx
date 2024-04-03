import isNumber from 'lodash/isNumber'

const Odds = ({ scoreA, scoreB, odds }) => {
  const oddToFocus =
    !isNumber(scoreA) || !isNumber(scoreB)
      ? null
      : scoreA > scoreB
      ? 'PA'
      : scoreA < scoreB
      ? 'PB'
      : 'PN'

  return (
    <div className="flex justify-between">
      <p
        className={`font-sans rounded border px-1.5 py-1 text-sm bg-gray-100 ${
          oddToFocus === 'PA' ? 'border-[#19194B]' : 'text-gray-500'
        }`}
      >
        {odds.PA}
      </p>
      <p
        className={`font-sans rounded border px-1.5 py-1 text-sm bg-gray-100 ${
          oddToFocus === 'PN' ? 'border-[#19194B]' : 'text-gray-500'
        }`}
      >
        {odds.PN}
      </p>
      <p
        className={`font-sans rounded border px-1.5 py-1 text-sm bg-gray-100 ${
          oddToFocus === 'PB' ? 'border-[#19194B]' : 'text-gray-500'
        }`}
      >
        {odds.PB}
      </p>
    </div>
  )
}

export default Odds
