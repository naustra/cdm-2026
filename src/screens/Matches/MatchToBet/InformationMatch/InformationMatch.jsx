import Tooltip from '@mui/material/Tooltip'
import PropTypes from 'prop-types'
import './InformationMatch.scss'

// https://docs.google.com/spreadsheets/d/1ZioOtyCblJtJf0WAaRxVWmnibqOeC7eDcJYDVEYRqng/edit?usp=sharing
const getPhaseText = (phase) =>
  ({
    0: 'Points par défaut (x1)',
    4: 'Points multipliées par 2',
    3: 'Points multipliées par 6',
    2: 'Points multipliées par 4',
    1: 'Points multipliées par 10',
  }[phase])

const getPhaseAff = (phase) =>
  ({
    4: '4rts (Points x2)',
    3: '3eme place (Points x6)',
    2: 'Demi (Points x4)',
    1: 'Fin. (Points x10)',
  }[phase])

const InformationMatch = ({ phase, group }) => {
  return (
    <Tooltip title={getPhaseText(phase)} placement="top" enterTouchDelay={0}>
      <div className="text-xs text-gray-500">
        {phase !== '0' ? getPhaseAff(phase) : `Groupe ${group}`}
      </div>
    </Tooltip>
  )
}

InformationMatch.propTypes = {
  phase: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired,
}

export default InformationMatch
