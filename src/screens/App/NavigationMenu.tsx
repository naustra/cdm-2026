import {
  Home,
  Trophy,
  Users,
  HelpCircle,
  MessageCircleQuestion,
  BarChart3,
  ShieldCheck,
  type LucideProps,
} from 'lucide-react'
import { Suspense, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useIsUserConnected, useIsUserAdmin } from '../../hooks/user'

const FootballIcon = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="12 12 9.5 8.5 14.5 8.5" fill="currentColor" stroke="currentColor" />
    <path d="M9.5 8.5L6 7" />
    <path d="M14.5 8.5L18 7" />
    <path d="M12 12v4.5" />
    <path d="M12 16.5L8.5 19" />
    <path d="M12 16.5L15.5 19" />
    <path d="M6 7l-2 3" />
    <path d="M18 7l2 3" />
  </svg>
)

const menuItems = [
  { label: 'Accueil', icon: Home, path: '/', auth: false, admin: false },
  { label: 'Pronostics', icon: FootballIcon, path: '/matches', auth: true, admin: false },
  { label: 'Classement', icon: Trophy, path: '/ranking', auth: true, admin: false },
  { label: 'Tribus', icon: Users, path: '/groups', auth: true, admin: false },
  { label: 'Analytics', icon: BarChart3, path: '/analytics', auth: false, admin: false },
  { label: 'Règles', icon: HelpCircle, path: '/rules', auth: false, admin: false },
  { label: 'FAQ', icon: MessageCircleQuestion, path: '/faq', auth: false, admin: false },
  { label: 'Admin', icon: ShieldCheck, path: '/admin', auth: true, admin: true },
]

interface NavigationMenuProps {
  closeMenu: () => void
  menuOpen: boolean
}

const NavigationMenu = ({ closeMenu, menuOpen }: NavigationMenuProps) => {
  const isConnected = useIsUserConnected()
  const isAdmin = useIsUserAdmin()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!menuOpen) return

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeMenu()
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [menuOpen, closeMenu])

  const visibleItems = menuItems.filter(
    (item) => (!item.auth || isConnected) && (!item.admin || isAdmin),
  )

  const goTo = (to: string) => () => {
    navigate(to)
    closeMenu()
  }

  return (
    <>
      {menuOpen && (
        <div className="drawer-overlay" onClick={closeMenu} />
      )}
      <aside className={`drawer ${menuOpen ? 'drawer--open' : ''}`}>
        <div className="nav-drawer">
          <div className="nav-drawer__brand">
            <span className="nav-drawer__logo">🏆</span>
            <span className="nav-drawer__title">Paris Entre Potos</span>
          </div>

          <nav className="nav-drawer__links">
            {visibleItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path)

              return (
                <button
                  key={item.path}
                  className={`nav-drawer__link ${isActive ? 'nav-drawer__link--active' : ''}`}
                  onClick={goTo(item.path)}
                >
                  <item.icon size={20} className="text-gray-400" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}

const NavigationMenuSuspense = (props: NavigationMenuProps) => {
  return (
    <Suspense fallback={null}>
      <NavigationMenu {...props} />
    </Suspense>
  )
}

export default NavigationMenuSuspense
