import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import { useIsUserConnected } from '../../../hooks/user'
import ConnectionModal from '../ConnectionModal'
import User from './User'

const ConnectionWidget = () => {
  const isConnected = useIsUserConnected()
  const [modalOpened, setModalOpened] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (isConnected && modalOpened) {
      setModalOpened(false)
    }
  }, [isConnected, modalOpened])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (modalOpened) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [modalOpened])

  return (
    <>
      {createPortal(
        <dialog
          ref={dialogRef}
          className="modal-dialog"
          onClose={() => setModalOpened(false)}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpened(false)
          }}
        >
          <ConnectionModal />
        </dialog>,
        document.body,
      )}

      {isConnected ? (
        <User />
      ) : (
        <button
          className="btn btn--primary btn--sm"
          onClick={() => setModalOpened(true)}
        >
          Connexion
        </button>
      )}
    </>
  )
}

export default ConnectionWidget
