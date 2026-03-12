import CreateGroup from './CreateGroup/CreateGroup'
import JoinGroup from './JoinGroup/JoinGroup'
import MyGroups from './MyGroups/MyGroups'

const Groups = () => {
  return (
    <div className="groups-page">
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <h1 className="page-title">Mes tribus</h1>
        <p className="page-subtitle">
          Gérez vos tribus et affrontez vos proches
        </p>
      </div>
      <MyGroups />
      <JoinGroup />
      <CreateGroup />
    </div>
  )
}

export default Groups
