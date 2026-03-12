import conformsTo from 'lodash/conformsTo'
import isNumber from 'lodash/isNumber'
import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useBet } from '../../../hooks/bets'
import InformationMatch from './InformationMatch'
import Odds from '../components/Odds'
import ValidIcon from './ValidIcon'
import Flag from '../../../components/Flag'

const Match = ({ match }) => {
  const [bet, saveBet] = useBet(match.id)
  const [currentBet, setCurrentBet] = useState(bet)

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

  if (!match.display) return null

  const dateTime = match.dateTime
    ? new Date(match.dateTime.seconds * 1000)
    : null
  const timeStr = dateTime ? format(dateTime, 'HH:mm', { locale: fr }) : ''

  return (
    <div className="match-card">
      <div className="match-card__header">
        <InformationMatch phase={match.phase} groupName={match.groupName} />
        <span className="match-card__time">{timeStr}</span>
      </div>

      <div className="match-card__teams">
        <div className="match-card__team">
          <Flag country={match.teamACode} className="match-card__flag" />
          <span className="match-card__team-name">
            {match.teamAName ?? 'À déterminer'}
          </span>
        </div>

        <div className="match-card__score-input">
          <input
            type="text"
            placeholder="–"
            className="match-card__input"
            inputMode="numeric"
            pattern="[0-9]*"
            value={
              currentBet?.betTeamA !== undefined && currentBet?.betTeamA >= 0
                ? currentBet?.betTeamA
                : ''
            }
            onChange={handleTeamAChange}
          />
          <ValidIcon valid={betSaved()} />
          <input
            type="text"
            placeholder="–"
            className="match-card__input"
            inputMode="numeric"
            pattern="[0-9]*"
            value={currentBet?.betTeamB >= 0 ? currentBet?.betTeamB : ''}
            onChange={handleTeamBChange}
          />
        </div>

        <div className="match-card__team">
          <Flag country={match.teamBCode} className="match-card__flag" />
          <span className="match-card__team-name">
            {match.teamBName ?? 'À déterminer'}
          </span>
        </div>
      </div>

      <Odds
        {...match}
        scoreA={currentBet?.betTeamA}
        scoreB={currentBet?.betTeamB}
      />
    </div>
  )
}

export default Match
