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
import { useAuth } from '../../../../contexts/AuthContext'
import InlineAvatar from 'components/Avatar'
import { TableHead } from '@mui/material'
import { useBetsFromGame } from 'hooks/bets'

const GroupMatchDetails = ({ name, opponents, match }) => {
  const { user } = useAuth()
  const uid = user?.id
  const membersIds = opponents?.map((o) => o.id)

  const bets = useBetsFromGame(match.id)

  const normalizedBets = useMemo(
    () =>
      bets?.map((b) => ({
        ...b,
        uid: b.user_id,
        betTeamA: b.bet_team_a,
        betTeamB: b.bet_team_b,
        pointsWon: b.points_won,
      })),
    [bets],
  )

  const betsFiltered = useMemo(
    () =>
      membersIds
        ? normalizedBets?.filter((bet) => membersIds.includes(bet.uid))
        : normalizedBets,
    [normalizedBets, membersIds],
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
              <TableCell padding="normal"></TableCell>
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
              const opponent = opponents?.find((o) => o.id === bet.uid)

              return (
                <TableRow
                  key={bet.id}
                  className={bet.uid === uid ? 'own-ranking-row' : ''}
                >
                  <TableCell>
                    <Typography variant="overline">#{index + 1}</Typography>
                  </TableCell>
                  <TableCell padding="none">
                    <InlineAvatar
                      avatarUrl={opponent?.avatar_url}
                      displayName={opponent?.display_name}
                    />
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
                      <span>
                        {bet.pointsWon > 0
                          ? `- ${
                              Math.abs(ScoreA - bet.betTeamA) +
                              Math.abs(ScoreB - bet.betTeamB)
                            }`
                          : '-'}
                      </span>
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
  opponents: PropTypes.array,
}

export default GroupMatchDetails
