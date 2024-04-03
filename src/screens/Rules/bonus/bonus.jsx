import Typography from '@mui/material/Typography'
import Section from '../component/section'
import Table from '../component/table'

const Bonus = () => (
  <Section>
    <Typography variant="h1">Règles additionnelles</Typography>
    <br />
    <Typography variant="h2" color="inherit">
      Vainqueur final
    </Typography>
    <p>
      Chaque joueur pronostique également le champion de la Coupe du monde de
      rugby 2023 avant que la compétition commence. Si jamais celui-ci est
      trouvé par le parieur une fois la compétition terminée, la cote associée
      au pays pronostiqué est ajouté aux autres points gagnés durant toute la
      compétition.
    </p>
    <div>
      <Typography variant="h2">
        Répartition des points sur toute la durée du concours
      </Typography>
      <p>
        On a choisit de répartir le nombre de points de façon la plus équilibrée
        possible, ce qui permet à tous de rester concerné tout au long du
        déroulé du concours. Les retournements de situations sont toujours
        possibles !
      </p>
      <Typography variant="body1">
        Voici le choix de répartition de points par phase
      </Typography>
      <br />
      <div className="table_section">
        <Table
          header={[
            'Phase',
            'Poules',
            'Quart de finale',
            'Demi finale',
            '3eme place',
            'Finale',
            'Vainqueur final',
          ]}
          rows={[
            ['Nombres de matchs', '40', '4', '2', '1', '1', 'N/A'],
            ['Facteur multiplicateur', 'N/A', '2', '4', '6', '10', 'N/A'],
            ['% points total', '45', '12.5', '9', '5', '7', '10'],
          ]}
        />
      </div>
    </div>
    <div>
      <p>
        Cette répartition des points est intégrée directement dans les côtes des
        matches et vainqueurs finaux. Vous pouvez donc directement savoir les
        points à gagner en regardant la côte.
      </p>
    </div>
  </Section>
)

export default Bonus
