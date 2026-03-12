import Section from '../component/section'
import Table from '../component/table'

const Playoff = () => (
  <Section>
    <div>
      <h2 className="rules-heading">Règles durant la phase finale</h2>
      <p>
        Le fonctionnement des paris à partir de ce niveau de la compétition est
        identique à celui de la phase de groupe, à un détail près, la côte du
        match nul s&apos;applique uniquement pour les tirs au buts.
      </p>
    </div>
    <div>
      <p>
        <u>Exemple pour un match de quart de finale Brésil-Allemagne</u> :
      </p>
      <br />
      <div className="table_section">
        <Table
          header={[
            'Type de résultat',
            'Score pronostiqués',
            'Cote du résultat',
            'Vainqueur pronostiqué',
            'Score réel',
            'Vainqueur réel',
            'Points gagnés',
          ]}
          rows={[
            [
              'Bon score',
              '2-1',
              '320',
              'Brésil',
              '2-1',
              'Brésil',
              '320',
            ],
            [
              'Bon résultat',
              '1-1',
              '320',
              'Brésil',
              '2-1',
              'Brésil',
              '320 - |2-1| - |1-1| = 319',
            ],
            [
              'Bon résultat',
              '3-0',
              '320',
              'Brésil',
              '2-1',
              'Brésil',
              '320 - |2-3| - |1-0| = 318',
            ],
            [
              'Mauvais vainqueur',
              '0-2',
              '600',
              'Allemagne',
              '2-1',
              'Brésil',
              '0',
            ],
          ]}
        />
      </div>
    </div>
  </Section>
)

export default Playoff
