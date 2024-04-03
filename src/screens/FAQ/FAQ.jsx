import Typography from '@mui/material/Typography'
import { memo } from 'react'
import './FAQ.scss'
import FaqEntry from './FaqEntry'

function FAQPage() {
  return (
    <div className="faq-page-div">
      <p className="faq-speech">
        <Typography>
          Cette page référence les questions fréquentes que vous pourrez vous
          posez sur l&apos;utilisation du site
        </Typography>
      </p>
      <FaqEntry
        question="Qu'est-ce que c'est ?"
        answer="Un site qui vous permet de jouer avec les pronostics de la Coupe du monde de rugby 2023, entre amis ou en famille.
          À chaque bon pronostic, vous marquez un certain nombre de points, qui cumulés au fur et à mesure
          détermineront votre place dans le classement de votre tribu."
      />
      <FaqEntry
        question="Est-ce gratuit ?"
        answer="Oui, l'inscription au site est gratuite. Néanmoins, il est conseillé aux tribus de mettre en place une
          cagnotte pour récompenser les vainqueurs et rajouter de l'enjeu."
      />
      <FaqEntry
        question="Comment participer ?"
        answer="Après vous être connecté, vous devez tout d'abord rejoindre une tribu ou créer votre propre tribu.
          Une fois cette étape réalisée, vous pourrez pronostiquer votre vainqueur final ainsi que vos premiers
          matchs."
      />
      <FaqEntry
        question="Qu'est-ce qu'une tribu ?"
        answer="Une tribu est un groupe de personnes qui regroupe des amis, des connaissances, des familles, avec lesquels vous aurez
          choisi de jouer. Chacun d'entre vous peut créer sa propre tribu s'il le souhaite"
      />
      <FaqEntry
        question="Comment rejoindre une tribu ?"
        answer="Allez dans l'onglet 'Gestion des Tribus' dans le menu déroulant, entrez le code que vous a indiqué
          votre chef d'équipe dans la section 'Rejoindre une tribu'. Ensuite payez le règlement selon l'un des moyens décrits
          si il y en a un. Votre demande sera validée auprès de nos administrateurs et vous pourrez ensuite commencez
          vos pronostics."
      />
      <FaqEntry
        question="Comment créer ma tribu ?"
        answer="Allez dans l'onglet 'Gestion des Tribus' dans le menu déroulant. Dans la section 'Créer une tribu',
          choisissez le nom de la tribu. un code d'accès sera alors crée, et qu'il vous suffira
          à envoyer aux personnes qui souhaitent faire parti de votre tribu"
      />
      <FaqEntry
        question="Administrer une tribu, qu'est-ce que ça implique ?"
        answer="L'administrateur de groupe va à la fois et créer et gérer sa tribu. Comment ?
          C'est à lui que revient
          la charge de transmettre les codes aux joueurs qu'il souhaite voir participer avec lui.
          Sans le code de
          tribu, un joueur ne peut accéder au groupe de jeu."
      />
      <FaqEntry
        question="Je souhaite supprimer quelqu'un de ma tribu ou lui confier le role d'admin ?"
        answer="Si vous souhaitez supprimer quelqu'un de votre tribu, contacter le développeur de l'application qui
        a été un peu trop fainéant pour coder un module de suppression de joueur. Il vous répondra dans les plus brefs délais. (pierre@le-bihan.eu)"
      />
      <FaqEntry
        question="Comment faire un don ?"
        answer="Si vous souhaitez faire un don, aller sur le lien vers la cagnotte
            PayPal et faites un don. L'équipe de la LE BIHAN Corp vous remercie
            d'avance pour votre générosité."
      />
      <FaqEntry
        question="Je ne peux plus accéder à mes paris après m'être connecté !"
        answer="Vérifier votre compte de connexion. Le compte Gmail n'est pas lié.
          Si vous vous connectez avec l'un puis que vous utilisez l'autre, vous n'aurez
          plus accès à vos pronostics"
      />
      <FaqEntry
        question="Comment savoir si je suis toujours en attente pour rejoindre une tribu ?"
        answer="Dans l'onglet mes tribus, vous aurez votre statut d'inscrit, ainsi que le montant que vous avez
          encore à régler avant de rejoindre telle ou telle équipe."
      />
      <FaqEntry
        question="Où se trouve le code ?"
        answer="Après création de votre tribu, et sa validation, le code s'affiche dans une fenêtre.
          Ce code, vous pourrez également le retrouver dans la section « Administrer mes tribus » du menu."
      />
      <FaqEntry
        question="Puis-je faire partie/administrer plusieurs tribus ?"
        answer="Bien entendu, vous pouvez faire partie d'autant de tribu que vous le souhaitez. Le règlement général
          du site et les modalités d'inscriptions restent les mêmes que vous soyez dans une ou plusieurs
          tribus.
          Dans le cas où vous administrez plusieurs tribus, vous trouverez la liste complète des tribus que
          vous gérez depuis l'onglet correspondant. Vous y retrouverez également toutes les informations
          nécessaires à la bonne gestion de vos groupes.
          Par contre, vous ne pourrez parier qu'un seul score de match, et qui sera votre choix dans toutes les tribus auquel vou participez"
      />
      <FaqEntry
        question="Ai-je besoin de plusieurs comptes pour m'inscrire dans des tribus différentes ?"
        answer="Absolument pas. Vous pouvez avoir autant de tribu que vous le désirez sur le même compte.
          Si vous changez de compte de connexion, vous serez aux yeux du site un nouveau
          challenger, et il vous faudra vous inscrire ou réinscrire dans les tribus en suivant les modalités
          précédentes."
      />
      <FaqEntry
        question="J'ai pronostiqué sur le match de ce soir, mais le site n'a pas retenu ma proposition ?"
        answer="Les pronostics pour chaque match doivent être remplis sur le site avant le début de ceux-ci. Si vous
          avez lancé votre pronostic au tout début du match, il se peut très probablement que votre réponse
          n'ait pas été acceptée.
          Dans le cas contraire, vérifiez bien que vous vous êtes connecté avec le bon compte (cf. onglet
          Comment participer ?).
          Dans le cas où vous ne seriez pas concernés par ces deux cas, vous pouvez nous adressez votre
          requête par mail en vérifiant au préalable que vous avez bien suivis la démarche d'inscription."
      />
      <FaqEntry
        question="Je me suis inscris dans une tribu, mais je ne la retrouve plus"
        answer="Vérifiez bien que vous vous êtes connectés avec le bon compte d'inscription. Si malgré tout le
          problème subsiste, contacter nos administrateurs à l'adresse suivante:
          pierre@le-bihan.eu"
      />
      <FaqEntry
        question="Est-ce que les cotes changent ?"
        answer="
            Les côtes des matches sont mises à jour tous les soirs que cela soit avant ou après la compétition et ne bougent plus une fois le match commencé.
            Les côtes de vainqueur final sont figées au démarrage de la compétition."
      />
      <FaqEntry
        question="Pourquoi ne puis-je pas pronostiquer sur le gagnant de la coupe-du-monde ?"
        answer="Si vous avez émis ce pronostic après le 08 septembre 2023 à 21h, il est en effet trop tard (cf. règlement).
          Si ce n'est pas le cas, merci de nous envoyer un mail à pierre@le-bihan.eu avant la date du
          premier match de la coupe."
      />
      <FaqEntry
        question="Je suis sur smartphone, est-ce que cela change quelque chose ?"
        answer="Non, les règles et le mode de jeu ne change pas que vous soyez sur ordinateur ou sur smartphone.
          Petite astuce, pour voir les codes groupes sur smartphone, il vous faut tout simplement faire glisser
          le cadre dédié à cet effet vers la droite."
      />
      <FaqEntry
        question="J'ai trouvé un bug, comment puis-je le signaler ?"
        answer={
          <>
            Vous pouvez envoyer un mail à pierre@le-bihan.eu décrivant le bug.
          </>
        }
      />
      <FaqEntry
        question="Que faites-vous de mes données personnelles ?"
        answer={
          <>
            Les données personnelles collectées le sont uniquement dans le but
            du jeu.&nbsp;
            <b>Aucune donnée ne sera réutilisée pour un autre objectif.</b>
            <br />
            <br />
            Vous pouvez consulter la politique de confidentialité complète{' '}
            <a
              href="https://github.com/naustra/rugby-2023/blob/master/confidentialite.md"
              target="_blank"
              rel="noreferrer"
            >
              ici
            </a>
            .
          </>
        }
      />

      <FaqEntry
        question="Mon problème n'est pas répertorié dans cette FAQ"
        answer="Vous pouvez nous envoyer votre requête à l'adresse pierre@le-bihan.eu. Nous vous
          répondrons le plus rapidement possible afin que votre expérience de jeu soit la plus réussie."
      />
    </div>
  )
}

export default memo(FAQPage)
