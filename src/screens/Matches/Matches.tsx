import AppBar from '@mui/material/AppBar'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { isPast } from 'date-fns'
import map from 'lodash/map'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useCompetitionData } from '../../hooks/competition'
import { useMatches } from '../../hooks/matches'
import MatchToBet from './MatchToBet'
import MatchBegun from './MatchBegun'
import { useLocation, useNavigate } from 'react-router-dom'

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

  const handleTabChange = (event, value) => {
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

  if (!competitionData?.launchBet) return null

  const LaunchBetDate = new Date(competitionData.launchBet.seconds * 1000)

  return isPast(LaunchBetDate) ? (
    <>
      <AppBar position="fixed" className="matches-tab-bar" color="secondary">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          centered
          textColor="inherit"
        >
          <Tab label="À venir" />
          <Tab label="En cours / Terminé" />
        </Tabs>
      </AppBar>
      <div className="matches-container">
        {selectedTab === 0
          ? map(filteredMatches, (match) => (
              <MatchToBet match={match} key={match.id} />
            ))
          : map(filteredMatches, (match) => (
              <MatchBegun match={match} key={match.id} />
            ))}
      </div>
    </>
  ) : (
    <Typography variant="h1">
      Les pronostics seront bientôt accessibles ! D'ici là, vous pouvez créer
      votre groupe et inviter vos amis !
    </Typography>
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
