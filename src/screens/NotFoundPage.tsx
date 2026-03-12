import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
      <span className="text-5xl mb-3">🤔</span>
      <h1 className="text-xl font-extrabold text-navy mb-2">
        Page non trouvée
      </h1>
      <p className="text-sm text-gray-400 mb-5">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <button
        className="inline-flex items-center gap-2 font-semibold rounded-full border-none cursor-pointer transition-all duration-150 bg-navy text-white py-2 px-5 text-sm hover:bg-navy-light"
        onClick={() => navigate('/')}
      >
        Retour à l'accueil
      </button>
    </div>
  )
}

export default NotFound
