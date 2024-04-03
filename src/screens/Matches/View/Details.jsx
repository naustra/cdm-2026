import AppBar from '@mui/material/AppBar'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import isEmpty from 'lodash/isEmpty'
import { Suspense, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGroupsForUserMember } from '../../../hooks/groups'
import GroupMatchDetails from './GroupMatchDetails'
import './Details.scss'
import { useAllOpponents } from '../../../hooks/opponents'
import { useMatch } from 'hooks/matches'
import MatchBegun from '../MatchBegun'

const Details = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState(1)
  const groups = useGroupsForUserMember()
  const handleTabChange = (_, value) => {
    setSelectedTab(value)
  }
  const match = useMatch(id)
  const allOpponents = useAllOpponents()

  useEffect(() => {
    if (!match) return navigate('/matches')
  }, [match, navigate])

  if (!match) return null

  return (
    <div className="flex flex-col justify-around items-center gap-4 mt-16 md:mt-14 bg-gray-100">
      <MatchBegun match={match} />
      {isEmpty(groups) ? (
        <>
          <div className="ranking-page-div">
            <p>
              Pour pouvoir visualiser plus d'informations, il vous faut tout
              d&apos;abord
              <Link to="/groups">créer ou rejoindre une tribu</Link>.
            </p>
          </div>
        </>
      ) : (
        <>
          <AppBar
            position="fixed"
            className="ranking-tab-bar"
            color="secondary"
          >
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              centered
              textColor="inherit"
            >
              <Tab label="Général" />
              {groups.map((group) => (
                <Tab
                  key={group.id}
                  label={
                    group.data().name.length > 10
                      ? `${group.data().name.slice(0, 7)}...`
                      : group.data().name
                  }
                />
              ))}
            </Tabs>
          </AppBar>
          <div className="ranking-container">
            {!isEmpty(groups) && selectedTab === 0 ? (
              <GroupMatchDetails
                {...{
                  name: 'Général',
                  opponents: allOpponents,
                  match,
                }}
              />
            ) : (
              <GroupMatchDetails
                {...groups[selectedTab - 1]?.data()}
                match={match}
                opponents={allOpponents.filter((opponent) =>
                  groups[selectedTab - 1]?.data().members.includes(opponent.id),
                )}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}

Details.propTypes = {}

const RankingWithSuspense = (props) => {
  return (
    <Suspense fallback="Loading groups...">
      <Details {...props} />
    </Suspense>
  )
}

export default RankingWithSuspense
