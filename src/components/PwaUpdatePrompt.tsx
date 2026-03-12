import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { toast } from 'react-hot-toast'

export const PwaUpdatePrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Vérifier les mises à jour toutes les heures
      if (r) {
        setInterval(() => {
          r.update()
        }, 60 * 60 * 1000)
      }
    },
    onRegisterError(error) {
      console.error("Erreur d'enregistrement du Service Worker", error)
    },
  })

  useEffect(() => {
    if (needRefresh) {
      toast(
        (t) => (
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-navy">
              Une nouvelle version de l'application est disponible !
            </span>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="px-3 py-1.5 text-sm font-medium text-white bg-navy rounded-md hover:bg-navy/90 transition-colors"
                onClick={() => {
                  toast.dismiss(t.id)
                  updateServiceWorker(true)
                }}
              >
                Mettre à jour
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-sm font-medium text-navy bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                onClick={() => {
                  toast.dismiss(t.id)
                  setNeedRefresh(false)
                }}
              >
                Plus tard
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
          position: 'bottom-center',
        }
      )
    }
  }, [needRefresh, setNeedRefresh, updateServiceWorker])

  return null
}

export default PwaUpdatePrompt
