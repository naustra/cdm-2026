import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import memoize from 'lodash/memoize'
import orderBy from 'lodash/orderBy'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useAuth } from 'reactfire'
import forgotBetImgUrl from '../../../assets/icons/ForgotBet.png'
import imgUrl from '../../../assets/icons/mask6.png'
import InlineAvatar from '../../../components/Avatar'
import { useOpponents } from '../../../hooks/opponents'
import { useTeams } from '../../../hooks/teams'
import './GroupRanking.scss'
import OwnRank from './OwnRank'
import { useNavigate } from 'react-router-dom'
import Flag from 'components/Flag'

export const imgUrlFlag = memoize((country) =>
  require(`../../../assets/flags/${country}.svg`),
)

const GroupRanking = ({ name, members, opponentsProvided }) => {
  const { uid } = useAuth().currentUser
  const opponents = useOpponents(members)
  const navigate = useNavigate()

  const opponentsUsed = opponentsProvided || opponents

  const sortedOpponents = useMemo(
    () =>
      orderBy(opponentsUsed, (userSnapshot) => userSnapshot.data().score ?? 0, [
        'desc',
      ]),
    [opponentsUsed],
  )

  const teams = useTeams()

  return (
    <Card className="group-ranking-card">
      <CardContent>
        <Typography variant="h1" align="center">
          {name}
        </Typography>
        <OwnRank opponents={sortedOpponents} members={members} />
        <Table>
          <TableBody>
            {sortedOpponents.map((userSnapshot, index) => {
              const user = userSnapshot.data()
              if (!user) return null

              const team = user.winnerTeam
                ? teams.find((a) => a.id === user.winnerTeam).data()
                : null

              return (
                <TableRow
                  key={userSnapshot.id}
                  className={userSnapshot.id === uid ? 'own-ranking-row' : ''}
                >
                  <TableCell padding="none">
                    <Typography variant="overline">#{index + 1}</Typography>
                  </TableCell>
                  <TableCell
                    padding="normal"
                    onClick={() => {
                      navigate(`/user/${userSnapshot.id}`)
                    }}
                  >
                    <InlineAvatar {...user} />
                  </TableCell>
                  <TableCell padding="none">
                    {(user.score || 0).toLocaleString()} points
                  </TableCell>
                  <TableCell padding="normal">
                    {team ? (
                      team.elimination ? (
                        <Flag
                          tooltipText={
                            'Vainqueur final éliminé : ' + team.className
                          }
                          country={team.code}
                          style={{ width: '40px', height: '40px' }}
                        ></Flag>
                      ) : team.unveiled ? (
                        <Flag
                          tooltipText={
                            'Gains en cas de victoire : ' + team.winOdd
                          }
                          country={team.code}
                          style={{ width: '40px', height: '40px' }}
                          className="bet-winner-unveiled"
                        ></Flag>
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

GroupRanking.propTypes = {
  name: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(PropTypes.string).isRequired,
  selection: PropTypes.number,
}

export default GroupRanking
