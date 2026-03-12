import { Menu, X } from 'lucide-react'
import { Suspense, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useIsUserConnected, useIsUserAdmin } from '../../hooks/user'
import AnalyticsPage from '../Analytics'
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
      <header className="site-header">
        <button
          className="header-icon-btn"
          aria-label="Menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <span className="site-header__logo">Paris Entre Potos</span>

        <ConnectionWidget />
      </header>

      <NavigationMenu
        menuOpen={menuOpen}
        closeMenu={() => setMenuOpen(false)}
      />

      <main className="site-main">
        <Suspense fallback={<div className="page-loader">Chargement...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />

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
      </main>
    </>
  )
}

export default App
