import { isPast } from 'date-fns'
import { useMemo } from 'react'
import { useCompetitionData } from '../../hooks/competition'
import { useIsUserConnected } from '../../hooks/user'
import FinalWinner from './FinalWinner'
import { useNavigate } from 'react-router'

const WinnerChoice = () => {
  const competitionData = useCompetitionData()

  const LaunchBetDate = useMemo(
    () =>
      competitionData?.launchBet
        ? new Date(competitionData.launchBet.seconds * 1000)
        : null,
    [competitionData?.launchBet],
  )

  if (!competitionData || !LaunchBetDate) return null

  return isPast(LaunchBetDate) ? (
    <div className="winner-section">
      <FinalWinner />
    </div>
  ) : (
    <div className="card" style={{ textAlign: 'center' }}>
      <p className="text-gray-500 text-sm">
        Le pronostic du vainqueur final sera bientôt accessible !
      </p>
    </div>
  )
}

const HomePage = () => {
  const navigate = useNavigate()
  const signedIn = useIsUserConnected()

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-hero__emoji">🏆</div>
        <h1 className="home-hero__title">Coupe du Monde 2026</h1>
        <p className="home-hero__desc">
          Pronostiquez les résultats des matches, marquez des points et
          affrontez vos amis et votre famille dans votre tribu !
        </p>
      </div>

      <div className="home-actions">
        <button
          className="home-action-card"
          onClick={() => navigate('/rules')}
        >
          <div className="home-action-card__icon">📋</div>
          <div className="home-action-card__label">Règles</div>
        </button>

        {signedIn && (
          <>
            <button
              className="home-action-card"
              onClick={() => navigate('/matches')}
            >
              <div className="home-action-card__icon">⚽</div>
              <div className="home-action-card__label">Pronostics</div>
            </button>
            <button
              className="home-action-card"
              onClick={() => navigate('/ranking')}
            >
              <div className="home-action-card__icon">🥇</div>
              <div className="home-action-card__label">Classement</div>
            </button>
          </>
        )}
      </div>

      {signedIn && <WinnerChoice />}

      {!signedIn && (
        <div className="card" style={{ textAlign: 'center', marginTop: 12 }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Connectez-vous pour commencer à pronostiquer !
          </p>
        </div>
      )}
    </div>
  )
}

export default HomePage
