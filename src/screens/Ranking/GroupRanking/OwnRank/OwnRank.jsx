import Typography from '@mui/material/Typography'
import findIndex from 'lodash/findIndex'
import size from 'lodash/size'
import PropTypes from 'prop-types'

import { useAuth } from 'reactfire'

const OwnRank = ({ opponents }) => {
  const { uid } = useAuth().currentUser
  const rank = findIndex(opponents, { id: uid }) + 1

  return (
    <Typography variant="caption" align="right">
      {rank}
      <sup>{rank === 1 ? 'er' : 'ème'}</sup> sur {size(opponents)}
    </Typography>
  )
}

OwnRank.propTypes = {
  opponents: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
    }),
  ),
}

export default OwnRank
