import { Menu, X } from 'lucide-react'
import { Suspense, lazy, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useIsUserConnected, useIsUserAdmin } from '../../hooks/user'
import HomePage from '../HomePage/HomePage'
import UserPage from '../User'
import MatchesPage from '../Matches'
import NotFoundPage from '../NotFoundPage'

const AnalyticsPage = lazy(() => import('../Analytics'))
const FAQPage = lazy(() => import('../FAQ/FAQ'))
const GroupsPage = lazy(() => import('../Groups/Groups'))
const Profile = lazy(() => import('../Profile/Profile'))
const RankingPage = lazy(() => import('../Ranking/Ranking'))
const RulesPage = lazy(() => import('../Rules/rules'))
import ConnectionWidget from './ConnectionWidget/ConnectionWidget'
import NavigationMenu from './NavigationMenu'
import InstallPrompt from 'components/InstallPrompt'

const AdminPage = lazy(() => import('../Admin'))

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

        <div style={{ flexShrink: 0 }}>
          <ConnectionWidget />
        </div>
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

                {adminUser && (
                  <Route path="/admin" element={<AdminPage />} />
                )}
              </>
            )}

            <Route element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <InstallPrompt />
    </>
  )
}

export default App
