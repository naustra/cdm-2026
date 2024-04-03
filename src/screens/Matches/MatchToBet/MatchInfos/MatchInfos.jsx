import Tooltip from '@mui/material/Tooltip'
import format from 'date-fns/format'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import fr from 'date-fns/locale/fr'
import PropTypes from 'prop-types'
import './matchInfos.scss'
import {
  CalendarMonthOutlined,
  PlaceOutlined,
  TvOutlined,
} from '@mui/icons-material'

const MatchInfos = ({ match }) => {
  const dateTime = match.dateTime.toDate()

  return (
    <div className="match-infos-container">
      <div className="flex gap-2 items-center">
        <CalendarMonthOutlined className="text-base" />
        <Tooltip
          title={format(dateTime, 'PPPppp', { locale: fr })}
          enterTouchDelay={0}
        >
          <div>
            {formatDistanceToNow(dateTime, { locale: fr, addSuffix: true })}
          </div>
        </Tooltip>
      </div>

      <div className="flex gap-2 items-center">
        <PlaceOutlined className="text-base" />
        <div>{match.ville}</div>
      </div>

      <div className="flex gap-2 items-center">
        <TvOutlined className="text-base" />
        <div>{match.streaming}</div>
      </div>
    </div>
  )
}

MatchInfos.defaultProps = {
  match: {
    dateTime: 0,
  },
}

MatchInfos.propTypes = {
  match: PropTypes.shape({
    dateTime: PropTypes.shape({
      toDate: PropTypes.func.isRequired,
    }).isRequired,
  }),
}

export default MatchInfos
