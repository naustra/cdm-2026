import { Menu, X } from 'lucide-react'
import { Suspense, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useIsUserConnected, useIsUserAdmin } from '../../hooks/user'
import AdminPage from '../Admin'
import FAQPage from '../FAQ/FAQ'
import GroupsPage from '../Groups/Groups'
import HomePage from '../HomePage/HomePage'
import UserPage from '../User'
import MatchesPage from '../Matches'
import NotFoundPage from '../NotFoundPage'
import Profile from '../Profile/Profile'
import RankingPage from '../Ranking/Ranking'
import RulesPage from '../Rules/rules'
import ConnectionWidget from './ConnectionWidget/ConnectionWidget'
import NavigationMenu from './NavigationMenu'

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const signedIn = useIsUserConnected()
  const adminUser = useIsUserAdmin()

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1100] h-14 flex items-center justify-between px-4 bg-cream/[0.88] backdrop-blur-sm border-b border-black/[0.06]">
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 -ml-2 rounded-full text-navy hover:bg-navy/[0.06] transition-colors"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <span className="text-[1.05rem] font-extrabold text-navy tracking-tight">
          Paris Entre Potos
        </span>

        <ConnectionWidget />
      </header>

      <NavigationMenu
        menuOpen={menuOpen}
        closeMenu={() => setMenuOpen(false)}
      />

      <main className="pt-14 min-h-[calc(100vh-56px)]">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[40vh] text-gray-400">
              Chargement...
            </div>
          }
        >
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

                {adminUser && (
                  <Route path="/admin" element={<AdminPage />} />
                )}
              </>
            )}

            <Route element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Toaster position="bottom-center" />
    </>
  )
}

export default App
