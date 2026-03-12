import isEmpty from 'lodash/isEmpty'
import { Suspense, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGroupsForUserMember } from '../../../hooks/groups'
import GroupMatchDetails from './GroupMatchDetails'
import { useAllOpponents } from '../../../hooks/opponents'
import { useMatch } from 'hooks/matches'
import MatchBegun from '../MatchBegun'

const Details = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState(0)
  const groups = useGroupsForUserMember()
  const match = useMatch(id)
  const allOpponents = useAllOpponents()

  useEffect(() => {
    if (!match) {
      navigate('/matches')
    }
  }, [match, navigate])

  if (!match) return null

  const tabs = [
    { label: 'Général', key: 'general' },
    ...groups.map((g) => ({
      label: g.name.length > 10 ? `${g.name.slice(0, 8)}…` : g.name,
      key: g.id,
    })),
  ]

  return (
    <div className="details-page">
      <MatchBegun match={match} />

      {isEmpty(groups) ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Pour voir plus d'infos,{' '}
            <Link to="/groups" style={{ color: '#6366f1', fontWeight: 600 }}>
              créez ou rejoignez une tribu
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <div className="ranking-tabs" style={{ position: 'static', background: 'transparent' }}>
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                className={`matches-tab ${selectedTab === i ? 'matches-tab--active' : ''}`}
                onClick={() => setSelectedTab(i)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {selectedTab === 0 ? (
            <GroupMatchDetails
              name="Général"
              opponents={allOpponents}
              match={match}
            />
          ) : (
            <GroupMatchDetails
              {...groups[selectedTab - 1]}
              match={match}
              opponents={allOpponents.filter((opponent) =>
                groups[selectedTab - 1]?.members?.includes(opponent.id),
              )}
            />
          )}
        </>
      )}
    </div>
  )
}

const DetailsWithSuspense = (props: Record<string, unknown>) => {
  return (
    <Suspense fallback="Loading...">
      <Details {...props} />
    </Suspense>
  )
}

export default DetailsWithSuspense
