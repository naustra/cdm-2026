import { Tooltip } from '@mui/material'
import PropTypes from 'prop-types'
import { memo } from 'react'

const Flag = memo(({ country, tooltipText, className, style }) => {
  if (!country) return null

  const flag = require(`../assets/flags/${country}.svg`)

  return (
    <Tooltip title={tooltipText} placement="top" enterTouchDelay={0}>
      <img src={flag} alt={country} className={className} style={style} />
    </Tooltip>
  )
})

Flag.propTypes = {
  country: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
}

export default Flag
