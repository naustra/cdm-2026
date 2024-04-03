import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import HelpIcon from '@mui/icons-material/Help'
import ListIcon from '@mui/icons-material/List'
import HomeIcon from '@mui/icons-material/Home'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GroupsIcon from '@mui/icons-material/Groups'
import PropTypes from 'prop-types'
import { Suspense } from 'react'
import { useNavigate } from 'react-router'
import SideImg from '../../../assets/visuels/rules-281x310.jpg'
import { useIsUserConnected } from '../../../hooks/user'
import { ListItemIcon } from '@mui/material'

const NavigationMenu = ({ closeMenu, menuOpen }) => {
  const isConnected = useIsUserConnected()
  // const isAdmin = useIsUserAdmin()
  const navigate = useNavigate()

  const goTo = (to) => () => {
    navigate(to)
    closeMenu()
  }

  return (
    <Drawer color="primary" open={menuOpen} onClose={closeMenu}>
      <List>
        {/* Route accessibles sans connexion */}
        <ListItemButton onClick={goTo('/')} sx={{ m: -2, mb: -1 }}>
          <img src={SideImg} alt="Accueil" />
        </ListItemButton>
        <Divider />

        {/* Route accessibles sans connexion (Doublon page d'accueil) */}
        <ListItemButton onClick={goTo('/')}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Accueil" />
        </ListItemButton>

        {/* Route accessibles avec connexion */}
        {isConnected && (
          <ListItemButton onClick={goTo('/matches')}>
            <ListItemIcon>
              <EventAvailableIcon />
            </ListItemIcon>
            <ListItemText primary="Pariez" />
          </ListItemButton>
        )}

        {/* Route accessibles avec connexion */}
        {isConnected && (
          <ListItemButton onClick={goTo('/ranking')}>
            <ListItemIcon>
              <EmojiEventsIcon />
            </ListItemIcon>
            <ListItemText primary="Classement" />
          </ListItemButton>
        )}

        {/* Route accessibles avec connexion */}
        {isConnected && (
          <ListItemButton onClick={goTo('/groups')}>
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary="Gestion des tribus" />
          </ListItemButton>
        )}

        {/* Routes accessibles sans connexion */}
        <ListItemButton onClick={goTo('/rules')}>
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Règles" />
        </ListItemButton>

        {/* Routes accessibles sans connexion */}
        <ListItemButton onClick={goTo('/faq')}>
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="FAQ" />
        </ListItemButton>
      </List>
    </Drawer>
  )
}

NavigationMenu.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
  closeMenu: PropTypes.func.isRequired,
}

const NavigationMenuSuspense = (props) => {
  return (
    <Suspense fallback="Loading Navigation menu">
      <NavigationMenu {...props} />
    </Suspense>
  )
}

export default NavigationMenuSuspense
