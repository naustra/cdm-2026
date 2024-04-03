import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import orderBy from 'lodash/orderBy'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useAuth } from 'reactfire'
import InlineAvatar from 'components/Avatar'
import './GroupMatchDetails.scss'
import { TableHead } from '@mui/material'
import { useBetsFromGame } from 'hooks/bets'

const GroupMatchDetails = ({ name, opponents, match }) => {
  const { uid } = useAuth().currentUser
  const membersIds = opponents?.map((opponent) => opponent.data().uid)

  const bets = useBetsFromGame(match.id)

  const betsFiltered = useMemo(
    () =>
      membersIds ? bets?.filter((bet) => membersIds.includes(bet.uid)) : bets,
    [bets, membersIds],
  )

  const sortedBets = useMemo(
    () => orderBy(betsFiltered, (bet) => bet.pointsWon ?? 0, ['desc']),
    [betsFiltered],
  )

  if (!bets) return null

  const ScoreA = match.scores.A
  const ScoreB = match.scores.B

  return (
    <Card className="group-ranking-card">
      <CardContent>
        <Typography variant="h1" align="center">
          {name}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="right"></TableCell>
              <TableCell padding="none" align="center">
                Nom
              </TableCell>
              <TableCell>Prono</TableCell>
              <TableCell padding="none">Malus</TableCell>
              <TableCell>Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedBets.map((bet, index) => {
              const userSnapshot = opponents.find(
                (opponent) => opponent.id === bet.uid,
              )
              const user = userSnapshot?.data()

              return (
                <TableRow
                  key={bet.id}
                  className={bet.uid === uid ? 'own-ranking-row' : ''}
                >
                  <TableCell>
                    <Typography variant="overline">#{index + 1}</Typography>
                  </TableCell>
                  <TableCell padding="none">
                    <InlineAvatar {...user} />
                  </TableCell>
                  <TableCell
                    padding="none"
                    align="center"
                    className="text-base"
                  >{`${bet.betTeamA} : ${bet.betTeamB}`}</TableCell>
                  <TableCell padding="none" align="center" className="italic">
                    <Tooltip
                      title={'Écarts de points par rapport au score réel'}
                      placement="top"
                      enterTouchDelay={0}
                    >
                      {bet.pointsWon > 0
                        ? `- ${
                            Math.abs(ScoreA - bet.betTeamA) +
                            Math.abs(ScoreB - bet.betTeamB)
                          }`
                        : '-'}
                    </Tooltip>
                  </TableCell>
                  <TableCell
                    padding="none"
                    align="right"
                    className="font-semibold"
                  >
                    {(bet.pointsWon || 0).toLocaleString()} points
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

GroupMatchDetails.propTypes = {
  name: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(PropTypes.string).isRequired,
  selection: PropTypes.number,
}

export default GroupMatchDetails
