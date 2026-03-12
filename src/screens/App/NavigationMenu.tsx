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
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="12 12 9.5 8.5 14.5 8.5" fill="currentColor" stroke="currentColor" />
    <path d="M9.5 8.5L6 7" /><path d="M14.5 8.5L18 7" /><path d="M12 12v4.5" />
    <path d="M12 16.5L8.5 19" /><path d="M12 16.5L15.5 19" />
    <path d="M6 7l-2 3" /><path d="M18 7l2 3" />
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
        <div className="fixed inset-0 z-[1050] bg-black/30" onClick={closeMenu} />
      )}
      <aside className={`fixed top-0 left-0 bottom-0 z-[1100] w-64 bg-cream shadow-xl transform transition-transform duration-200 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex flex-col gap-6">
          <button onClick={goTo('/')} className="flex items-center gap-2.5 py-2 px-1 hover:opacity-80 transition-opacity text-left cursor-pointer border-none bg-transparent">
            <span className="text-2xl">🏆</span>
            <span className="text-base font-extrabold text-navy">Paris Entre Potos</span>
          </button>

          <nav className="flex flex-col gap-0.5">
            {visibleItems.map((item) => {
              const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
              return (
                <button
                  key={item.path}
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-[10px] border-none bg-transparent text-sm font-medium cursor-pointer text-left w-full transition-colors ${isActive ? 'bg-navy/[0.08] text-navy font-semibold' : 'text-gray-700 hover:bg-navy/[0.06]'}`}
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
