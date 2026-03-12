import orderBy from 'lodash/orderBy'
import { useMemo } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import forgotBetImgUrl from '../../../assets/icons/ForgotBet.png'
import imgUrl from '../../../assets/icons/mask6.png'
import { useOpponents } from '../../../hooks/opponents'
import { useTeams } from '../../../hooks/teams'
import OwnRank from './OwnRank/OwnRank'
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

const GroupRanking = ({
  name,
  members,
  opponentsProvided,
}: GroupRankingProps) => {
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
    <>
      <OwnRank opponents={sortedOpponents} members={members ?? undefined} />

      <div className="ranking-table">
        {sortedOpponents.map((opponent, index) => {
          if (!opponent) return null

          const team = opponent.winner_team
            ? teams.find((t) => t.id === opponent.winner_team)
            : null

          return (
            <div
              key={opponent.id}
              className={`ranking-row ${opponent.id === uid ? 'ranking-row--own' : ''}`}
              onClick={() => navigate(`/user/${opponent.id}`)}
            >
              <span className="ranking-row__rank">#{index + 1}</span>

              <div className="ranking-row__avatar">
                {opponent.avatar_url ? (
                  <img
                    src={opponent.avatar_url}
                    alt={opponent.display_name ?? ''}
                    className="avatar-img"
                    style={{ width: 32, height: 32 }}
                  />
                ) : (
                  <div
                    className="avatar-fallback"
                    style={{ width: 32, height: 32, fontSize: 13 }}
                  >
                    {(opponent.display_name ?? '?').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <span className="ranking-row__name">
                {opponent.display_name ?? 'Anonyme'}
              </span>

              <span className="ranking-row__score">
                {(opponent.score || 0).toLocaleString()} pts
              </span>

              <div className="ranking-row__winner">
                {team ? (
                  team.elimination ? (
                    <Flag
                      tooltipText={'Éliminé : ' + team.name}
                      country={team.code}
                      style={{
                        width: 28,
                        height: 28,
                        opacity: 0.4,
                        filter: 'grayscale(1)',
                      }}
                    />
                  ) : team.unveiled ? (
                    <Flag
                      tooltipText={team.name}
                      country={team.code}
                      className="bet-winner-unveiled"
                      style={{ width: 28, height: 28 }}
                    />
                  ) : (
                    <span data-tooltip="Vainqueur mystère">
                      <img
                        src={imgUrl}
                        style={{ width: 28, height: 28 }}
                        alt="Mystère"
                      />
                    </span>
                  )
                ) : (
                  <span data-tooltip="Pas de vainqueur sélectionné">
                    <img
                      src={forgotBetImgUrl}
                      style={{ width: 28, height: 28, opacity: 0.4 }}
                      alt="Aucun"
                    />
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default GroupRanking
