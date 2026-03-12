import Tooltip from '@mui/material/Tooltip'
import { format, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  CalendarMonthOutlined,
  PlaceOutlined,
  TvOutlined,
} from '@mui/icons-material'

interface MatchInfosProps {
  match: {
    dateTime: { seconds: number }
    ville?: string
    streaming?: string
  }
}

const MatchInfos = ({ match }: MatchInfosProps) => {
  const dateTime = new Date(match.dateTime.seconds * 1000)

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

export default MatchInfos
