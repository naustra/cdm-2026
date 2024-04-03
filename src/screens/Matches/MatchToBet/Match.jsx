import conformsTo from 'lodash/conformsTo'
import isNumber from 'lodash/isNumber'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useBet } from '../../../hooks/bets'
import { useTeam } from '../../../hooks/teams'
import InformationMatch from './InformationMatch'
import './Match.scss'
import MatchInfos from './MatchInfos'
import Odds from '../components/Odds'
import ValidIcon from './ValidIcon'
import Flag from '../../../components/Flag'

const empty = {}

const Match = ({ match }) => {
  const [bet, saveBet] = useBet(match.id)
  const [currentBet, setCurrentBet] = useState(bet)

  const teamA = useTeam(match.teamA)
  const teamB = useTeam(match.teamB)

  const isBetValid = (updatedBet) => {
    const scoreValidator = (score) => isNumber(score) && score >= 0

    return conformsTo(updatedBet, {
      betTeamA: scoreValidator,
      betTeamB: scoreValidator,
    })
  }

  const handleChange =
    (team) =>
    ({ target: { value } }) => {
      const updatedBet = {
        ...currentBet,
        [`betTeam${team}`]: Number(value),
      }
      setCurrentBet(updatedBet)
      saveBetIfValid(updatedBet)
    }

  const handleTeamAChange = handleChange('A')
  const handleTeamBChange = handleChange('B')

  const saveBetIfValid = (updatedBet) => {
    if (isBetValid(updatedBet)) {
      saveBet(updatedBet)
    }
  }

  const betSaved = () =>
    isBetValid(currentBet) &&
    currentBet.betTeamA === bet?.betTeamA &&
    currentBet.betTeamB === bet?.betTeamB

  return (
    match.display && (
      <div className="rounded-xl border w-full p-2 gap-4 max-w-lg text-gray-800 bg-white space-y-2">
        <div className="text-center">
          <InformationMatch phase={match.phase} group={teamA.group} />
        </div>

        <div className="flex justify-around items-center">
          <div className="flex flex-col items-center justify-center gap-2 mt-1 w-24">
            <div>
              <Flag country={teamA.code} className="h-10"></Flag>
            </div>
            <p className="font-sans">{teamA.name}</p>
          </div>

          <div className="text-[#19194B] text-center w-36 space-y-2">
            <div className="flex justify-center gap-2 items-center">
              <input
                type="text"
                placeholder="..."
                className="w-16 text-4xl font-sans text-right"
                id={`betValue${teamA.code}`}
                error={
                  currentBet?.betTeamA < 0 ||
                  [1, 2, 4].includes(currentBet?.betTeamA)
                }
                inputMode="numeric"
                pattern="[0-9]*"
                value={currentBet?.betTeamA >= 0 ? currentBet?.betTeamA : ''}
                onChange={handleTeamAChange}
              />
              <ValidIcon valid={betSaved()} />
              <input
                type="text"
                placeholder="..."
                className="w-16 text-4xl font-sans text-left"
                id={`betValue${teamB.code}`}
                error={
                  currentBet?.betTeamB < 0 ||
                  [1, 2, 4].includes(currentBet?.betTeamA)
                }
                inputMode="numeric"
                pattern="[0-9]*"
                value={currentBet?.betTeamB >= 0 ? currentBet?.betTeamB : ''}
                onChange={handleTeamBChange}
              />
            </div>
            <Odds
              {...match}
              scoreA={currentBet?.betTeamA}
              scoreB={currentBet?.betTeamB}
            />
          </div>

          <div className="flex flex-col items-center justify-center gap-2 mt-1 w-24">
            <div>
              <Flag country={teamB.code} className="h-10"></Flag>
            </div>
            <p className="font-sans">{teamB.name}</p>
          </div>
        </div>

        <div className="col-span-3">
          <MatchInfos match={match} />
        </div>
      </div>
    )
  )
}

Match.defaultProps = {
  match: empty,
  bet: empty,
}

Match.propTypes = {
  match: PropTypes.shape({
    dateTime: PropTypes.shape({
      toDate: PropTypes.func.isRequired,
    }).isRequired,
    phase: PropTypes.string.isRequired,
    scores: PropTypes.shape({}),
  }),
}

export default Match
