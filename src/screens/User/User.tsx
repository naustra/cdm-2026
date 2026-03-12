import { isPast, format, isSameDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import map from 'lodash/map'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useCompetitionData } from '../../hooks/competition'
import { useMatches, type NormalizedMatch } from '../../hooks/matches'
import MatchBegun from './MatchBegun'
import InlineAvatar from 'components/Avatar/Avatar'
import { useOpponent } from 'hooks/opponents'
import { useParams } from 'react-router-dom'

function groupMatchesByDate(matches: NormalizedMatch[]) {
  const groups: { date: Date; matches: NormalizedMatch[] }[] = []

  for (const match of matches) {
    if (!match.dateTime) continue
    const matchDate = new Date(match.dateTime.seconds * 1000)
    const lastGroup = groups[groups.length - 1]

    if (lastGroup && isSameDay(lastGroup.date, matchDate)) {
      lastGroup.matches.push(match)
    } else {
      groups.push({ date: matchDate, matches: [match] })
    }
  }

  return groups
}

const User = () => {
  const { id } = useParams()
  const [comparingDate, setComparingDate] = useState(Date.now())
  const opponent = useOpponent(id)

  useEffect(() => {
    const handle = setInterval(() => setComparingDate(Date.now()), 5000)
    return () => clearInterval(handle)
  }, [])

  const matches = useMatches()
  const competitionData = useCompetitionData()

  const filteredMatches = useMemo(() => {
    if (!matches) return []
    return matches
      .filter((match) => {
        const timestamp = match.dateTime?.seconds * 1000
        return timestamp <= comparingDate
      })
      .reverse()
  }, [matches, comparingDate])

  const dateGroups = useMemo(
    () => groupMatchesByDate(filteredMatches),
    [filteredMatches],
  )

  if (!competitionData?.launchBet || !opponent) return null

  const LaunchBetDate = new Date(competitionData.launchBet.seconds * 1000)

  if (!isPast(LaunchBetDate)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <p className="text-gray-500 text-center">
          Les pronostics seront bientôt accessibles !
        </p>
      </div>
    )
  }

  return (
    <div className="matches-page">
      <div className="matches-tabs">
        <InlineAvatar
          avatarUrl={opponent.avatar_url}
          displayName={opponent.display_name}
        />
      </div>

      <div className="matches-list">
        {dateGroups.map((group) => (
          <div key={group.date.toISOString()} className="matches-date-group">
            <div className="matches-date-header">
              <span className="matches-date-label">
                {format(group.date, 'EEEE d MMMM', { locale: fr })}
              </span>
            </div>
            <div className="matches-date-list">
              {map(group.matches, (match) => (
                <MatchBegun match={match} key={match.id} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const UserSuspense = (props) => {
  return (
    <Suspense fallback="Loading matches...">
      <User {...props} />
    </Suspense>
  )
}

export default UserSuspense
