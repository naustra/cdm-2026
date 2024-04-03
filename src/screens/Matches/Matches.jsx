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
import './matches.scss'
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
    return clearInterval(handle)
  })

  useEffect(() => {
    const tabFromUrl = urlParams.get('tab') || '0'
    setSelectedTab(Number(tabFromUrl))
  }, [urlParams])

  const matches = useMatches()

  const filteredMatches = useMemo(
    () =>
      selectedTab === 0
        ? matches.filter((match) => {
            const timestamp = match.dateTime?.toMillis()

            return timestamp > comparingDate
          })
        : matches
            .filter((match) => {
              const timestamp = match.dateTime?.toMillis()

              return timestamp <= comparingDate
            })
            .reverse(),
    [comparingDate, matches, selectedTab],
  )

  const LaunchBetDate = new Date(useCompetitionData().launchBet.seconds * 1000)

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
      ⚠ Les pronostics seront accessibles à partir du DATE ! D'ici là, vous
      pouvez créer votre groupe et vous inscrire aux notifications pour être
      prévenu de toutes les actualité du site !
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
