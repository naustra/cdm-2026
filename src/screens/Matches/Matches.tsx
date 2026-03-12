import { isPast, format, isSameDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import map from 'lodash/map'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useCompetitionData } from '../../hooks/competition'
import { useMatches, type NormalizedMatch } from '../../hooks/matches'
import MatchToBet from './MatchToBet/Match'
import MatchBegun from './MatchBegun/Match'
import { useLocation, useNavigate } from 'react-router-dom'

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

const Matches = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const urlParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  )
  const [selectedTab, setSelectedTab] = useState(
    Number(urlParams.get('tab') || '0'),
  )
  const [comparingDate, setComparingDate] = useState(Date.now())

  const handleTabChange = (value: number) => {
    setSelectedTab(value)
    navigate(`${location.pathname}?tab=${value}`)
  }

  useEffect(() => {
    const handle = setInterval(() => setComparingDate(Date.now()), 5000)
    return () => clearInterval(handle)
  }, [])

  useEffect(() => {
    const tabFromUrl = urlParams.get('tab') || '0'
    setSelectedTab(Number(tabFromUrl))
  }, [urlParams])

  const matches = useMatches()
  const competitionData = useCompetitionData()

  const filteredMatches = useMemo(() => {
    if (!matches) return []
    return selectedTab === 0
      ? matches.filter((match) => {
          const timestamp = match.dateTime?.seconds * 1000
          return timestamp > comparingDate
        })
      : matches
          .filter((match) => {
            const timestamp = match.dateTime?.seconds * 1000
            return timestamp <= comparingDate
          })
          .reverse()
  }, [comparingDate, matches, selectedTab])

  const dateGroups = useMemo(
    () => groupMatchesByDate(filteredMatches),
    [filteredMatches],
  )

  if (!competitionData?.launchBet) return null

  const LaunchBetDate = new Date(competitionData.launchBet.seconds * 1000)

  if (!isPast(LaunchBetDate)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🏆</div>
          <h1 className="text-xl font-bold text-[#19194B] mb-2">
            Bientôt disponible
          </h1>
          <p className="text-gray-500">
            Les pronostics seront bientôt accessibles ! D'ici là, vous pouvez
            créer votre groupe et inviter vos amis !
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-14 z-10 flex gap-1 justify-center py-3 px-4 bg-cream/[0.85] backdrop-blur-sm">
        <button
          className={`py-2 px-6 rounded-full text-sm font-semibold border-[1.5px] cursor-pointer transition-all duration-200 ${
            selectedTab === 0
              ? 'text-white bg-navy border-navy hover:text-white'
              : 'text-gray-500 bg-transparent border-gray-200 hover:text-navy hover:border-navy'
          }`}
          onClick={() => handleTabChange(0)}
        >
          À venir
        </button>
        <button
          className={`py-2 px-6 rounded-full text-sm font-semibold border-[1.5px] cursor-pointer transition-all duration-200 ${
            selectedTab === 1
              ? 'text-white bg-navy border-navy hover:text-white'
              : 'text-gray-500 bg-transparent border-gray-200 hover:text-navy hover:border-navy'
          }`}
          onClick={() => handleTabChange(1)}
        >
          Terminés
        </button>
      </div>

      <div className="max-w-[520px] mx-auto py-2 px-4 pb-10">
        {dateGroups.length === 0 && (
          <p className="text-gray-400 text-center py-12">
            Aucun match à afficher
          </p>
        )}
        {dateGroups.map((group) => (
          <div key={group.date.toISOString()} className="mb-6">
            <div className="sticky top-[100px] z-[5] py-2 mb-2">
              <span className="inline-block text-xs font-bold uppercase tracking-wide text-navy bg-cream py-0.5">
                {format(group.date, 'EEEE d MMMM', { locale: fr })}
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {selectedTab === 0
                ? map(group.matches, (match) => (
                    <MatchToBet match={match} key={match.id} />
                  ))
                : map(group.matches, (match) => (
                    <MatchBegun match={match} key={match.id} />
                  ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const MatchesSuspense = (props) => {
  return (
    <Suspense fallback="Loading matches...">
      <Matches {...props} />
    </Suspense>
  )
}

export default MatchesSuspense
