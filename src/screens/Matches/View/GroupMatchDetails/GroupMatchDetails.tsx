import orderBy from 'lodash/orderBy'
import { useMemo } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import InlineAvatar from 'components/Avatar/Avatar'
import { useBetsFromGame } from 'hooks/bets'

interface GroupMatchDetailsProps {
  name: string
  opponents?: Array<{
    id: string
    display_name?: string | null
    avatar_url?: string | null
  }>
  match: {
    id: string
    scores: { A: number; B: number }
  }
}

const GroupMatchDetails = ({ name, opponents, match }: GroupMatchDetailsProps) => {
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
    <div className="card mb-4">
      <h3 className="text-center text-lg font-bold text-navy mb-3">{name}</h3>

      <div className="rules-table-wrapper">
        <table className="rules-table">
          <thead>
            <tr>
              <th></th>
              <th>Nom</th>
              <th>Prono</th>
              <th>Malus</th>
              <th className="text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {sortedBets.map((bet, index) => {
              const opponent = opponents?.find((o) => o.id === bet.uid)

              return (
                <tr
                  key={bet.id}
                  className={bet.uid === uid ? 'bg-amber-50' : ''}
                >
                  <td className="text-xs text-gray-400 font-bold">
                    #{index + 1}
                  </td>
                  <td>
                    <InlineAvatar
                      avatarUrl={opponent?.avatar_url ?? undefined}
                      displayName={opponent?.display_name ?? undefined}
                      size={24}
                    />
                  </td>
                  <td className="text-center text-sm">
                    {`${bet.betTeamA} : ${bet.betTeamB}`}
                  </td>
                  <td
                    className="text-center italic text-sm"
                    title="Écarts de points par rapport au score réel"
                  >
                    {bet.pointsWon && bet.pointsWon > 0
                      ? `- ${
                          Math.abs(ScoreA - (bet.betTeamA ?? 0)) +
                          Math.abs(ScoreB - (bet.betTeamB ?? 0))
                        }`
                      : '-'}
                  </td>
                  <td className="text-right font-semibold text-sm">
                    {(bet.pointsWon || 0).toLocaleString()} pts
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GroupMatchDetails
