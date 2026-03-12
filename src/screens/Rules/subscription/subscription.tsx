import Typography from '@mui/material/Typography'
import Section from '../component/section'

const Subscription = () => (
  <Section>
    <Typography variant="h1">
      Droits d’inscription et mode de qualification
    </Typography>
    <br />
    <Typography variant="h2">Mode de qualification</Typography>
    <p>
      Il n’y a pas d’élimination, tout le monde participe aux pronostics de tous
      les matchs. Chacun des participants garde son nombre de points acquis
      durant toute la compétition.
    </p>
    <Typography variant="h2">Droits d’inscription</Typography>
    <p>
      L'inscription est gratuite et instantanée. Néanmoins, il est conseillé aux
      tribus de mettre en place une cagnotte pour récompenser les vainqueurs et
      rajouter de l'enjeu.
    </p>
    <Typography variant="h2">Date de validation des pronostics</Typography>
    <p>
      <b>
        Les pronostics pour chaque match doivent être remplis sur le site avant
        le début de ceux-ci.
      </b>
      &nbsp;En ce qui concerne les pronostics sur le vainqueur de la
      compétition, ceux-ci doivent être réalisés avant le premier match de la
      compétition, soit
      <b> le vendredi 08 septembre 2023 à 21h.</b>
      <br />
      <br />
      <b>
        <u>En cas de retard ou de non-réponse</u>
      </b>
      &nbsp;sur un match ou pour le vainqueur final,&nbsp;
      <b>
        <u>
          le joueur aura 0 point mais ne sera pas éliminé et pourra donc
          participer aux autres matchs.
        </u>
      </b>
    </p>
  </Section>
)

export default Subscription
