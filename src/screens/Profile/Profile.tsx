import { useAuth } from '../../contexts/AuthContext'
import { useLogout } from '../../hooks/user'

const Profile = () => {
  const { user, profile } = useAuth()
  const logout = useLogout()

  const displayName =
    profile?.display_name || user?.user_metadata?.full_name || 'Utilisateur'
  const photoURL =
    profile?.avatar_url || user?.user_metadata?.avatar_url || ''
  const email = user?.email || ''

  return (
    <div className="profile-page">
      <div className="card" style={{ textAlign: 'center' }}>
        {photoURL ? (
          <img
            src={photoURL}
            alt={displayName}
            className="avatar-img"
            style={{ width: 72, height: 72, margin: '0 auto 12px' }}
          />
        ) : (
          <div
            className="avatar-fallback"
            style={{ width: 72, height: 72, fontSize: '1.5rem', margin: '0 auto 12px' }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#19194B', margin: '0 0 4px' }}>
          {displayName}
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0 0 20px' }}>
          {email}
        </p>
        <button className="btn btn--outline" onClick={logout}>
          Se déconnecter
        </button>
      </div>
    </div>
  )
}

export default Profile
