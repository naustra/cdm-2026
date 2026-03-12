import isEmpty from 'lodash/isEmpty'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (match) {
      hasLoaded.current = true
    }
    if (hasLoaded.current && !match) {
      navigate('/matches')
    }
  }, [match, navigate])

  if (!match) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-gray-400">
        Chargement...
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
    <div className="min-h-screen max-w-[600px] mx-auto py-4 px-4 pb-10">
      <div className="mb-4">
        <MatchBegun match={match} clickable={false} />
      </div>

      {isEmpty(groups) ? (
        <div className="bg-white rounded-2xl p-5 shadow-card text-center">
          <p className="text-sm text-gray-500">
            Pour voir plus d'infos,{' '}
            <Link to="/groups" className="text-indigo-500 font-semibold">
              créez ou rejoignez une tribu
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-1 justify-center py-3">
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                className={`py-2 px-5 rounded-full text-xs font-semibold border-[1.5px] cursor-pointer transition-all duration-200 ${
                  selectedTab === i
                    ? 'text-white bg-navy border-navy'
                    : 'text-gray-500 bg-transparent border-gray-200 hover:text-navy hover:border-navy'
                }`}
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
              name={groups[selectedTab - 1]?.name ?? ''}
              match={match}
              opponents={allOpponents.filter((opponent) =>
                groups[selectedTab - 1]?.memberIds?.includes(opponent.id),
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
