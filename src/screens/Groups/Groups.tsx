import CreateGroup from './CreateGroup'
import JoinGroup from './JoinGroup'
import MyGroups from './MyGroups'

const Groups = () => {
  return (
    <div className="groups-container">
      <MyGroups />
      <JoinGroup />
      <CreateGroup />
    </div>
  )
}

export default Groups
