import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import { Suspense, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Baniere from '../../assets/visuels/bandeauSignature.jpg'
import BaniereTablette from '../../assets/visuels/baniere_pm.jpg'
import BaniereMobile from '../../assets/visuels/bandeauTitreMobile.png'
import { useIsUserConnected, useIsUserAdmin } from '../../hooks/user'
import FAQPage from '../FAQ'
import GroupsPage from '../Groups'
import HomePage from '../HomePage'
import UserPage from '../User'
import MatchesPage from '../Matches'
import NotFoundPage from '../NotFoundPage'
import Profile from '../Profile'
import RankingPage from '../Ranking'
import RulesPage from '../Rules'
import ConnectionWidget from './ConnectionWidget'
import NavigationMenu from './NavigationMenu'

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const signedIn = useIsUserConnected()
  const adminUser = useIsUserAdmin()

  return (
    <>
      <AppBar>
        <Toolbar className="app-toolbar">
          <IconButton
            color="inherit"
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <div className="app-toolbar-title">
            <img id="imgDesktop" src={Baniere} alt="Baniere" />
            <img id="imgTablette" src={BaniereTablette} alt="Baniere" />
            <img id="imgMobile" src={BaniereMobile} alt="Baniere" />
          </div>
          <ConnectionWidget />
        </Toolbar>
      </AppBar>

      <NavigationMenu
        menuOpen={menuOpen}
        closeMenu={() => setMenuOpen(false)}
      />

      <div className="app-content">
        <Suspense fallback={<>Loading page...</>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/faq" element={<FAQPage />} />

            {signedIn && (
              <>
                <Route path="/matches/*" element={<MatchesPage />} />
                <Route path="/user/*" element={<UserPage />} />
                <Route path="/ranking" element={<RankingPage />} />
                <Route path="/groups" element={<GroupsPage />} />
                <Route path="/profile" element={<Profile />} />

                {adminUser && <></>}
              </>
            )}

            <Route element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </>
  )
}

export default App
