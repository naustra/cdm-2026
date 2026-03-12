import isEmpty from 'lodash/isEmpty'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useGroupsForUserMember } from '../../hooks/groups'
import GroupRanking from './GroupRanking/GroupRanking'
import { useAllOpponents } from '../../hooks/opponents'

const Ranking = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const urlParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  )
  const [selectedTab, setSelectedTab] = useState(
    Number(urlParams.get('tab') || '0'),
  )

  useEffect(() => {
    const tabFromUrl = urlParams.get('tab') || '0'
    setSelectedTab(Number(tabFromUrl))
  }, [urlParams])

  const groups = useGroupsForUserMember()
  const handleTabChange = (value: number) => {
    setSelectedTab(value)
    navigate(`${location.pathname}?tab=${value}`)
  }

  const allOpponents = useAllOpponents()

  if (isEmpty(groups)) {
    return (
      <div className="page-section" style={{ textAlign: 'center', paddingTop: 60 }}>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
          Pour voir le classement, il faut d'abord{' '}
          <Link to="/groups" style={{ color: '#6366f1', fontWeight: 600 }}>
            créer ou rejoindre une tribu
          </Link>
          .
        </p>
      </div>
    )
  }

  const tabs = [
    { label: 'Général', key: 'general' },
    ...groups.map((g) => ({
      label: g.name.length > 10 ? `${g.name.slice(0, 8)}…` : g.name,
      key: g.id,
    })),
  ]

  return (
    <div className="ranking-page">
      <div className="ranking-tabs">
        {tabs.map((tab, i) => (
          <button
            key={tab.key}
            className={`matches-tab ${selectedTab === i ? 'matches-tab--active' : ''}`}
            onClick={() => handleTabChange(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="ranking-content">
        {selectedTab === 0 ? (
          <GroupRanking name="Général" opponentsProvided={allOpponents} />
        ) : (
          <GroupRanking {...groups[selectedTab - 1]} />
        )}
      </div>
    </div>
  )
}

const RankingWithSuspense = (props: Record<string, unknown>) => {
  return (
    <Suspense fallback="Loading...">
      <Ranking {...props} />
    </Suspense>
  )
}

export default RankingWithSuspense
