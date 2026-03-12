import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import Tooltip from '@mui/material/Tooltip'
import PropTypes from 'prop-types'
const ValidIcon = ({ valid }) => (
  <Tooltip
    title={valid ? 'Pari enregistré' : 'Pari invalide'}
    placement="right"
    enterTouchDelay={0}
  >
    <div className="tooltip-svg-container">
      {valid ? (
        <CheckIcon className="valid-icon" />
      ) : (
        <ClearIcon className="invalid-icon" />
      )}
    </div>
  </Tooltip>
)

ValidIcon.propTypes = {
  valid: PropTypes.bool.isRequired,
}

export default ValidIcon
