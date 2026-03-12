import { useAuth } from '../../contexts/AuthContext'
import { useLogout } from '../../hooks/user'

function getInitials(name: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const Profile = () => {
  const { user, profile } = useAuth()
  const logout = useLogout()

  const displayName =
    profile?.display_name || user?.user_metadata?.full_name || 'Utilisateur'
  const photoURL =
    profile?.avatar_url || user?.user_metadata?.avatar_url || ''
  const email = user?.email || ''

  return (
    <div className="max-w-[500px] mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl p-5 shadow-card text-center">
        {photoURL ? (
          <img
            src={photoURL}
            alt={displayName}
            className="w-[72px] h-[72px] rounded-full object-cover mx-auto mb-3"
          />
        ) : (
          <div className="w-[72px] h-[72px] rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3 text-2xl font-semibold text-gray-500">
            {getInitials(displayName)}
          </div>
        )}
        <h2 className="text-[1.1rem] font-bold text-navy m-0 mb-1">
          {displayName}
        </h2>
        <p className="text-[0.8rem] text-gray-400 m-0 mb-5">{email}</p>
        <button
          className="border-2 border-gray-300 hover:border-indigo-500 text-navy font-semibold py-2.5 px-4 rounded-[10px] transition-colors"
          onClick={logout}
        >
          Se déconnecter
        </button>
      </div>
    </div>
  )
}

export default Profile
