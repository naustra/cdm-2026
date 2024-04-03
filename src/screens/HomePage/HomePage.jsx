/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import HelpIcon from '@mui/icons-material/Help'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { isPast } from 'date-fns'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useSigninCheck } from 'reactfire'
import myImage from '../../assets/visuels/bandeauEvenement_PM.jpg'
import { useCompetitionData } from '../../hooks/competition'
import FinalWinner from './FinalWinner'
import { useNavigate } from 'react-router'

const WinnerChoice = () => {
  const competitionData = useCompetitionData()
  const LaunchBetDate = useMemo(
    () => new Date(competitionData.launchBet.seconds * 1000),
    [competitionData.launchBet.seconds],
  )

  return isPast(LaunchBetDate) ? (
    <FinalWinner />
  ) : (
    <Typography variant="h1">
      ⚠ Le pronostic du vainqueur final sera accessible le 8 Juin à 8h ! D'ici
      là, vous pouvez créer votre groupe et vous inscrire aux notifications pour
      être prévenu de toutes les actualité du site !
    </Typography>
  )
}

const HomePage = ({ beforeInstallPrompt }) => {
  const navigate = useNavigate()
  const {
    data: { signedIn },
  } = useSigninCheck()

  function install() {
    beforeInstallPrompt?.prompt()
  }

  return (
    <div className="text-center mx-auto w-11/12 max-w-screen-sm pt-5">
      {beforeInstallPrompt ? (
        <div className="mx-auto flex justify-center flex-wrap p-2">
          <div className="w-42 p-2 shadow-md">
            <Button className="flex w-full" onClick={install} color="secondary">
              Installez l'application pour une meilleure expérience
            </Button>
          </div>
        </div>
      ) : null}
      <p className="text-center">
        Bienvenue sur Paris Entre Potos, le site de pronostics de la Coupe du
        monde de rugby 2023. Jouez en famille ou entre amis et affrontez
        d&apos;autres tribus ! Le but ? Pariez au plus proche de la réalité les
        résultats des équipes, marquez des points, et tentez de gagner la
        première place.
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

HomePage.propTypes = {
  user: PropTypes.object,
}
