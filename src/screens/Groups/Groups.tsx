import CreateGroup from './CreateGroup/CreateGroup'
import JoinGroup from './JoinGroup'
import MyGroups from './MyGroups/MyGroups'

const Groups = () => {
  return (
    <div className="max-w-[600px] mx-auto py-6 px-4 pb-12 flex flex-col gap-5">
      <div className="text-center mb-1">
        <h1 className="text-xl font-extrabold text-navy m-0 mb-1">Mes tribus</h1>
        <p className="text-sm text-gray-500 m-0 mb-5">
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
