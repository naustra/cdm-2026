import Section from '../component/section'
import Table from '../component/table'

const Bonus = () => (
  <Section>
    <h2 className="rules-heading">Règles additionnelles</h2>
    <br />
    <h3 className="rules-subheading">
      Vainqueur final
    </h3>
    <p>
      Chaque joueur pronostique également le champion de la Coupe du Monde 2026 avant que
      la compétition commence. Si jamais celui-ci est trouvé par le parieur une
      fois la compétition terminée, la cote associée au pays pronostiqué est
      ajouté aux autres points gagnés durant toute la compétition.
    </p>
    <div>
      <h3 className="rules-subheading">
        Répartition des points sur toute la durée du concours
      </h3>
      <p>
        On a choisit de répartir le nombre de points de façon la plus équilibrée
        possible, ce qui permet à tous de rester concerné tout au long du
        déroulé du concours. Les retournements de situations sont toujours
        possibles !
      </p>
      <p className="text-sm font-medium mt-2">
        Voici le choix de répartition de points par phase
      </p>
      <br />
      <div className="table_section">
        <Table
          header={[
            'Phase',
            'Poules',
            '16es',
            '8es',
            'Quarts',
            'Demis',
            '3e place',
            'Finale',
            'Vainqueur',
          ]}
          rows={[
            ['Nb matchs', '48', '16', '8', '4', '2', '1', '1', 'N/A'],
            ['Multiplicateur', 'x1', 'x1', 'x2', 'x3', 'x5', 'x7', 'x10', 'N/A'],
            ['% points total', '35', '12', '12', '9', '7', '5', '7', '10'],
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
