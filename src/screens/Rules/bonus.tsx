import Section from './component/rulesSection'
import Table from './component/table'

const Bonus = () => (
  <Section>
    <h2 className="text-xl font-bold text-navy">Règles additionnelles</h2>
    <br />
    <h3 className="text-lg font-bold text-navy">Vainqueur final</h3>
    <p>
      Chaque joueur pronostique le champion de la Coupe du Monde 2026 avant
      le début de la compétition. Si le pronostic est correct, la cote
      associée est ajoutée au total de points.
    </p>
    <div>
      <h3 className="text-lg font-bold text-navy">Répartition des points</h3>
      <p>
        Les points sont répartis de façon équilibrée pour que les retournements
        de situation restent possibles jusqu&apos;au bout !
      </p>
      <br />
      <div className="overflow-x-auto">
        <Table
          header={['Phase', 'Matchs', 'Multi.', '% total']}
          rows={[
            ['Poules', '48', '×1', '35%'],
            ['16es', '16', '×1', '12%'],
            ['8es', '8', '×2', '12%'],
            ['Quarts', '4', '×3', '9%'],
            ['Demis', '2', '×5', '7%'],
            ['3e place', '1', '×7', '5%'],
            ['Finale', '1', '×10', '7%'],
            ['Vainqueur', '—', '—', '10%'],
          ]}
        />
      </div>
    </div>
    <div>
      <p>
        Cette répartition est intégrée directement dans les côtes des matchs.
        Vous pouvez donc savoir les points à gagner en regardant la côte.
      </p>
    </div>
  </Section>
)

export default Bonus
