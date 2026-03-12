import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="not-found-page">
      <span style={{ fontSize: '3rem', marginBottom: 12 }}>🤔</span>
      <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#19194B', margin: '0 0 8px' }}>
        Page non trouvée
      </h1>
      <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: 20 }}>
        Cette page n'existe pas ou a été déplacée.
      </p>
      <button className="btn btn--primary" onClick={() => navigate('/')}>
        Retour à l'accueil
      </button>
    </div>
  )
}

export default NotFound
