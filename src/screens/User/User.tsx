import Typography from '@mui/material/Typography'
import { isPast } from 'date-fns'
import map from 'lodash/map'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useCompetitionData } from '../../hooks/competition'
import { useMatches } from '../../hooks/matches'
import MatchBegun from './MatchBegun'
import { AppBar, Tabs } from '@mui/material'
import InlineAvatar from 'components/Avatar/Avatar'
import { useOpponent } from 'hooks/opponents'
import { useParams } from 'react-router-dom'

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

  if (!competitionData?.launchBet || !opponent) return null

  const LaunchBetDate = new Date(competitionData.launchBet.seconds * 1000)

  return isPast(LaunchBetDate) ? (
    <>
      <AppBar position="fixed" className="matches-tab-bar" color="secondary">
        <Tabs centered textColor="inherit" value={0}>
          <InlineAvatar
            avatarUrl={opponent.avatar_url}
            displayName={opponent.display_name}
          />
        </Tabs>
      </AppBar>
      <div className="matches-container">
        {map(filteredMatches, (match) => (
          <MatchBegun match={match} key={match.id} />
        ))}
      </div>
    </>
  ) : (
    <Typography variant="h1">
      Les pronostics seront bientôt accessibles !
    </Typography>
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
