import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import orderBy from 'lodash/orderBy'
import { useMemo } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import forgotBetImgUrl from '../../../assets/icons/ForgotBet.png'
import imgUrl from '../../../assets/icons/mask6.png'
import InlineAvatar from '../../../components/Avatar'
import { useOpponents } from '../../../hooks/opponents'
import { useTeams } from '../../../hooks/teams'
import OwnRank from './OwnRank'
import { useNavigate } from 'react-router-dom'
import Flag from 'components/Flag'

interface GroupRankingProps {
  name?: string
  members?: string[] | null
  opponentsProvided?: Array<{
    id: string
    display_name?: string | null
    avatar_url?: string | null
    score?: number | null
    winner_team?: string | null
  }>
}

const GroupRanking = ({ name, members, opponentsProvided }: GroupRankingProps) => {
  const { user } = useAuth()
  const uid = user?.id
  const opponents = useOpponents(members ?? undefined)
  const navigate = useNavigate()

  const opponentsUsed = opponentsProvided || opponents

  const sortedOpponents = useMemo(
    () => orderBy(opponentsUsed, (u) => u.score ?? 0, ['desc']),
    [opponentsUsed],
  )

  const teams = useTeams()

  return (
    <Card className="group-ranking-card">
      <CardContent>
        <Typography variant="h1" align="center">
          {name}
        </Typography>
        <OwnRank opponents={sortedOpponents} members={members ?? undefined} />
        <Table>
          <TableBody>
            {sortedOpponents.map((opponent, index) => {
              if (!opponent) return null

              const team = opponent.winner_team
                ? teams.find((t) => t.id === opponent.winner_team)
                : null

              return (
                <TableRow
                  key={opponent.id}
                  className={opponent.id === uid ? 'own-ranking-row' : ''}
                >
                  <TableCell padding="none">
                    <Typography variant="overline">#{index + 1}</Typography>
                  </TableCell>
                  <TableCell
                    padding="normal"
                    onClick={() => navigate(`/user/${opponent.id}`)}
                  >
                    <InlineAvatar
                      avatarUrl={opponent.avatar_url ?? undefined}
                      displayName={opponent.display_name ?? undefined}
                    />
                  </TableCell>
                  <TableCell padding="none">
                    {(opponent.score || 0).toLocaleString()} points
                  </TableCell>
                  <TableCell padding="normal">
                    {team ? (
                      team.elimination ? (
                        <Flag
                          tooltipText={
                            'Vainqueur final éliminé : ' + team.name
                          }
                          country={team.code}
                          style={{ width: '40px', height: '40px' }}
                        />
                      ) : team.unveiled ? (
                        <Flag
                          tooltipText={
                            'Gains en cas de victoire : ' + team.winOdd
                          }
                          country={team.code}
                          style={{ width: '40px', height: '40px' }}
                          className="bet-winner-unveiled"
                        />
                      ) : (
                        <Tooltip
                          title="Vainqueur final mystère"
                          placement="top"
                          enterTouchDelay={0}
                        >
                          <img
                            src={imgUrl}
                            className="bet-winner-unknown"
                            alt="Équipe non éliminée"
                          />
                        </Tooltip>
                      )
                    ) : (
                      <Tooltip
                        title="Cette personne a oublié de parier son vainqueur final"
                        placement="top"
                        enterTouchDelay={0}
                      >
                        <img
                          src={forgotBetImgUrl}
                          className="bet-winner-unknown"
                          alt="Aucun vainqueur sélectionné"
                        />
                      </Tooltip>
                    )}
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

export default GroupRanking
