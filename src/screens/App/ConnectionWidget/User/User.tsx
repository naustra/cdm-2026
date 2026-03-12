import MuiAvatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../contexts/AuthContext'
import { useLogout } from '../../../../hooks/user'

const User = () => {
  const { user, profile } = useAuth()
  const logout = useLogout()
  const [isOpen, setIsOpen] = useState(false)
  const anchorEl = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()

  const displayName =
    profile?.display_name || user?.user_metadata?.full_name || ''
  const photoURL =
    profile?.avatar_url || user?.user_metadata?.avatar_url || ''

  return (
    <div className="flex items-center">
      <IconButton
        aria-label="Plus"
        aria-haspopup="true"
        onClick={() => setIsOpen(true)}
        ref={anchorEl}
        color="inherit"
      >
        <MuiAvatar src={photoURL} alt={displayName} className="user-avatar" />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={anchorEl.current}
        onClose={() => setIsOpen(false)}
      >
        <MenuItem
          onClick={() => {
            navigate('/profile')
            setIsOpen(false)
          }}
        >
          Profil
        </MenuItem>
        <MenuItem onClick={logout}>Se déconnecter</MenuItem>
      </Menu>
    </div>
  )
}

export default User
