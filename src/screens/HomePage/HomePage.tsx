import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import HelpIcon from '@mui/icons-material/Help'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { isPast } from 'date-fns'
import { useMemo } from 'react'
import myImage from '../../assets/visuels/bandeauEvenement_PM.jpg'
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
    <FinalWinner />
  ) : (
    <Typography variant="h1">
      Le pronostic du vainqueur final sera bientôt accessible ! D'ici là, vous
      pouvez créer votre groupe et inviter vos amis !
    </Typography>
  )
}

const HomePage = () => {
  const navigate = useNavigate()
  const signedIn = useIsUserConnected()

  return (
    <div className="text-center mx-auto w-11/12 max-w-screen-sm pt-5">
      <p className="text-center">
        Bienvenue sur Paris Entre Potos, le site de pronostics de la Coupe du
        Monde 2026. Jouez en famille ou entre amis et affrontez d&apos;autres
        tribus ! Le but ? Pariez au plus proche de la réalité les résultats des
        équipes, marquez des points, et tentez de gagner la première place.
      </p>

      <div className="mx-auto flex justify-center flex-wrap p-2">
        <div className="w-42 m-3 p-2 shadow-md">
          <p>Les règles du jeu :</p>
          <Button
            className="flex w-full"
            onClick={() => navigate('/rules')}
            color="primary"
          >
            <HelpIcon className="mr-2" />
            Règles
          </Button>
        </div>
        {signedIn && (
          <>
            <div className="w-42 m-3 p-2 shadow-md">
              <p>Tous vos paris : </p>
              <Button
                className="flex w-full"
                onClick={() => navigate('/matches')}
                color="primary"
              >
                <EventAvailableIcon className="mr-2" />
                Pariez
              </Button>
            </div>
            <div className="w-42 m-3 p-2 shadow-md">
              <p>Votre classement : </p>
              <Button
                className="flex w-full"
                onClick={() => navigate('/ranking')}
                color="primary"
              >
                <EmojiEventsIcon className="mr-2" />
                Classement
              </Button>
            </div>
          </>
        )}
      </div>
      {signedIn && <WinnerChoice />}
      <img alt="Home" className="mt-8 shadow-md" src={myImage} />
    </div>
  )
}

export default HomePage
