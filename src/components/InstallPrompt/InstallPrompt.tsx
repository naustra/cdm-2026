import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

// Define the BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [hasDismissed, setHasDismissed] = useState(false)

  useEffect(() => {
    // Check if app is already installed or if user dismissed it recently
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    const dismissedTimestamp = localStorage.getItem('pwaPromptDismissed')
    if (dismissedTimestamp) {
      const isExpired = Date.now() - parseInt(dismissedTimestamp, 10) > 7 * 24 * 60 * 60 * 1000 // 7 days
      if (!isExpired) {
        return
      }
    }

    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Update UI notify the user they can install the PWA
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    await deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setHasDismissed(true)
    localStorage.setItem('pwaPromptDismissed', Date.now().toString())
  }

  if (!showPrompt || hasDismissed) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[9999] p-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col gap-4 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg text-blue-600 dark:text-blue-300">
            <Download size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Installer l'application</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-tight mt-0.5">Pour un accès plus rapide, même hors ligne !</p>
          </div>
        </div>
        <button 
          onClick={handleDismiss}
          className="text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg p-1 transition-colors -mt-1 -mr-1"
          aria-label="Plus tard"
        >
          <X size={20} />
        </button>
      </div>
      
      <button 
        onClick={handleInstallClick}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
      >
        Ajouter à l'écran d'accueil
      </button>
    </div>
  )
}
