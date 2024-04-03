import Typography from '@mui/material/Typography'
import { isPast } from 'date-fns'
import map from 'lodash/map'
import { Suspense, useEffect, useState } from 'react'
import { useCompetitionData } from '../../hooks/competition'
import { useMatches } from '../../hooks/matches'
import MatchBegun from './MatchBegun'
import './User.scss'
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
    return clearInterval(handle)
  })

  const user = opponent.data()

  const matches = useMatches()

  const filteredMatches = matches
    .filter((match) => {
      const timestamp = match.dateTime?.toMillis()

      return timestamp <= comparingDate
    })
    .reverse()

  const LaunchBetDate = new Date(useCompetitionData().launchBet.seconds * 1000)

  return isPast(LaunchBetDate) ? (
    <>
      <AppBar position="fixed" className="matches-tab-bar" color="secondary">
        <Tabs centered textColor="inherit" value={0}>
          <InlineAvatar {...user} />
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
      ⚠ Les pronostics seront accessibles à partir du DATE ! D'ici là, vous
      pouvez créer votre groupe et vous inscrire aux notifications pour être
      prévenu de toutes les actualité du site !
    </Typography>
  )
}

const UserSuspense = (props) => {
  console.log('🚀 ~ file: User.jsx:56 ~ UserSuspense ~ props:', props)
  return (
    <Suspense fallback="Loading matches...">
      <User {...props} />
    </Suspense>
  )
}

export default UserSuspense
