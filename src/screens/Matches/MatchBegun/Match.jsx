import PropTypes from 'prop-types'
import { useBet } from '../../../hooks/bets'
import { useTeam } from '../../../hooks/teams'
import './Match.scss'
import Flag from '../../../components/Flag'
import PointsWon from './PointsWon/PointsWon'
import { Divider } from '@mui/material'
import { isNumber } from 'lodash'
import { useNavigate } from 'react-router-dom'

const empty = {}

const facteurMultiplicateurPhase = {
  0: 1,
  4: 2,
  2: 4,
  3: 6,
  1: 8,
}

const Match = ({ match }) => {
  const [currentBet] = useBet(match.id)
  const navigate = useNavigate()

  const teamA = useTeam(match.teamA)
  const teamB = useTeam(match.teamB)

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

  return (
    match.display && (
      <button
        className="rounded-xl border w-full p-2 gap-4 max-w-lg text-gray-800 bg-white space-y-2 hover:bg-gray-100"
        onClick={() => navigate(`/matches/${match.id}`)}
      >
        <div className="flex justify-center items-center">
          <div className="flex items-center gap-2 mt-1">
            <p className="font-sans">{teamA.name}</p>
            <Flag
              country={teamA.code}
              style={{ width: '40px', height: '40px' }}
            ></Flag>
          </div>

          <div className="text-[#19194B] text-center m-auto space-y-2">
            <div className="flex justify-center items-center ">
              <p className="font-sans rounded border px-1.5 py-1 text-xl bg-gray-100 border-[#19194B]">
                {`${match.scores.A} : ${match.scores.B}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Flag
              country={teamB.code}
              style={{ width: '40px', height: '40px' }}
            ></Flag>
            <p className="font-sans">{teamB.name}</p>
          </div>
        </div>
        <Divider />
        <div className="flex justify-between items-center gap-2 pt-1">
          <div className="flex flex-col items-center justify-center">
            <p className="font-sans">Ma cote</p>
            <p className="font-sans">{myOdd ?? '-'}</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="font-sans">Cote gagnante</p>
            <p className="font-sans">{winningOdd}</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="font-sans">Multiplication</p>
            <p className="font-sans">
              {`x ${facteurMultiplicateurPhase[match.phase]}`}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center m-auto">
            <p className="font-sans">Mon score</p>
            <p className="font-sans">{`${currentBet?.betTeamA ?? ''} - ${
              currentBet?.betTeamB ?? ''
            }`}</p>
          </div>
          <div className="mr-2">
            <PointsWon {...match} {...currentBet} />
          </div>
        </div>
      </button>
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
