import { useEffect, useState } from 'react'
import { useIsUserConnected } from '../../../hooks/user'
import ConnectionModal from '../ConnectionModal'
import User from './User'

const ConnectionWidget = () => {
  const isConnected = useIsUserConnected()
  const [modalOpened, setModalOpened] = useState(false)

  useEffect(() => {
    if (isConnected && modalOpened) {
      setModalOpened(false)
    }
  }, [isConnected, modalOpened])

  return (
    <>
      {modalOpened && (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50"
          onClick={() => setModalOpened(false)}
          role="presentation"
          aria-hidden="true"
        >
          <div
            className="bg-white rounded-2xl mx-4 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <ConnectionModal />
          </div>
        </div>
      )}

      {isConnected ? (
        <User />
      ) : (
        <button
          type="button"
          className="inline-flex items-center gap-2 font-semibold rounded-full border-none cursor-pointer transition-all duration-150 bg-navy text-white py-1.5 px-4 text-xs hover:bg-navy-light"
          onClick={() => setModalOpened(true)}
        >
          Connexion
        </button>
      )}
    </>
  )
}

export default ConnectionWidget
