import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../contexts/AuthContext'
import { useLogout } from '../../../../hooks/user'

const User = () => {
  const { user, profile } = useAuth()
  const logout = useLogout()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const displayName =
    profile?.display_name || user?.user_metadata?.full_name || ''
  const photoURL =
    profile?.avatar_url || user?.user_metadata?.avatar_url || ''

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && e.target instanceof Node && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="header-icon-btn"
        aria-label="Menu utilisateur"
        aria-haspopup="true"
        onClick={() => setIsOpen(!isOpen)}
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt={displayName}
            className="avatar-img"
            style={{ width: 32, height: 32 }}
          />
        ) : (
          <div className="avatar-fallback" style={{ width: 32, height: 32, fontSize: 13 }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <button
            className="dropdown-menu__item"
            onClick={() => {
              navigate('/profile')
              setIsOpen(false)
            }}
          >
            Profil
          </button>
          <button className="dropdown-menu__item" onClick={logout}>
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  )
}

export default User
