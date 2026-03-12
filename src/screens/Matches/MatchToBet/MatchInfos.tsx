import { Calendar, MapPin, Tv } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

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
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <Calendar size={16} className="text-gray-400" />
        <span title={format(dateTime, 'PPPppp', { locale: fr })}>
          {formatDistanceToNow(dateTime, { locale: fr, addSuffix: true })}
        </span>
      </div>

      <div className="flex gap-2 items-center">
        <MapPin size={16} className="text-gray-400" />
        <span>{match.ville}</span>
      </div>

      <div className="flex gap-2 items-center">
        <Tv size={16} className="text-gray-400" />
        <span>{match.streaming}</span>
      </div>
    </div>
  )
}

export default MatchInfos
