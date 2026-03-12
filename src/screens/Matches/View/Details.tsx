import { Suspense, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGroupsForUserMember } from '../../../hooks/groups'
import GroupMatchDetails from './GroupMatchDetails'
import { useAllOpponents } from '../../../hooks/opponents'
import { useMatch } from 'hooks/matches'
import MatchBegun from '../MatchBegun/Match'

const Details = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState(0)
  const groups = useGroupsForUserMember()
  const match = useMatch(id)
  const allOpponents = useAllOpponents()
  const loadedOnce = useRef(false)

  useEffect(() => {
    if (match) {
      loadedOnce.current = true
    }
    if (!match && loadedOnce.current) {
      navigate('/matches')
    }
  }, [match, navigate])

  if (!match) {
    return <div className="page-loader">Chargement...</div>
  }

  const tabs = [
    { label: 'Général', key: 'general' },
    ...groups.map((g) => ({
      label: g.name.length > 10 ? `${g.name.slice(0, 8)}…` : g.name,
      key: g.id,
    })),
  ]

  return (
    <div className="details-page">
      <MatchBegun match={match} clickable={false} />

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
