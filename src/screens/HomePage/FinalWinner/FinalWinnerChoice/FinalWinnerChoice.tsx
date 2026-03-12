import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import find from 'lodash/find'
import PropTypes from 'prop-types'
import Flag from '../../../../components/Flag'
import { useTeams } from '../../../../hooks/teams'
const FinalWinnerChoice = ({ userTeam, disabled, onValueChange }) => {
  const teams = useTeams()

  return (
    <div className="winner-choice">
      {FlagDisplay(teams, userTeam)}
      <div className="winner-choice-select-container">
        <Select
          className="winner-choice-select-value"
          value={userTeam ?? ''}
          onChange={onValueChange}
          inputProps={{
            name: 'userTeam',
          }}
          disabled={disabled}
        >
          {teams.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              {team.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      {OddDisplay(teams, userTeam)}
    </div>
  )
}

const FlagDisplay = (teams, userTeam) => {
  const teamDisplayed = find(teams, (team) => team.id === userTeam)

  return (
    teamDisplayed && (
      <Flag country={teamDisplayed.code} className="winner-choice-flag" />
    )
  )
}

const OddDisplay = (teams, userTeam) => {
  const teamDisplayed = find(teams, (team) => team.id === userTeam)

  return (
    teamDisplayed && (
      <Tooltip
        title="Cote pour la victoire finale"
        placement="right"
        enterTouchDelay={0}
      >
        <Typography variant="h1" className="winner-choice-odd">
          {teamDisplayed.winOdd}
        </Typography>
      </Tooltip>
    )
  )
}

FinalWinnerChoice.propTypes = {
  userTeam: PropTypes.string,
  onValueChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

export default FinalWinnerChoice
