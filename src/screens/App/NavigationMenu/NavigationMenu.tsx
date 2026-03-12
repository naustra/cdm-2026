import {
  Home,
  Trophy,
  Users,
  HelpCircle,
  MessageCircleQuestion,
  Dribbble,
  BarChart3,
} from 'lucide-react'
import { Suspense, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useIsUserConnected } from '../../../hooks/user'

const menuItems = [
  { label: 'Accueil', icon: Home, path: '/', auth: false },
  { label: 'Pronostics', icon: Dribbble, path: '/matches', auth: true },
  { label: 'Classement', icon: Trophy, path: '/ranking', auth: true },
  { label: 'Tribus', icon: Users, path: '/groups', auth: true },
  { label: 'Analytics', icon: BarChart3, path: '/analytics', auth: false },
  { label: 'Règles', icon: HelpCircle, path: '/rules', auth: false },
  { label: 'FAQ', icon: MessageCircleQuestion, path: '/faq', auth: false },
]

interface NavigationMenuProps {
  closeMenu: () => void
  menuOpen: boolean
}

const NavigationMenu = ({ closeMenu, menuOpen }: NavigationMenuProps) => {
  const isConnected = useIsUserConnected()
  const navigate = useNavigate()

  useEffect(() => {
    if (!menuOpen) return

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeMenu()
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [menuOpen, closeMenu])

  const goTo = (to: string) => () => {
    navigate(to)
    closeMenu()
  }

  const visibleItems = menuItems.filter(
    (item) => !item.auth || isConnected,
  )

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
            {visibleItems.map((item) => (
              <button
                key={item.path}
                className="nav-drawer__link"
                onClick={goTo(item.path)}
              >
                <item.icon size={20} className="text-gray-400" />
                <span>{item.label}</span>
              </button>
            ))}
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
