import Section from '../component/section/rulesSection'
import Table from '../component/table/table'

const Playoff = () => (
  <Section>
    <div>
      <h2 className="rules-heading">Règles durant la phase finale</h2>
      <p>
        Le fonctionnement est identique à la phase de groupe. La côte du
        match nul s&apos;applique uniquement en cas de tirs au but.
      </p>
    </div>
    <div>
      <p><u>Exemple : Brésil 2-1 Allemagne (cote : 320)</u></p>
      <br />
      <div className="table_section">
        <Table
          header={['Situation', 'Prono', 'Calcul', 'Points']}
          rows={[
            ['Score parfait', '2-1', '320', '320'],
            ['Bon résultat', '1-1', '320 − |2−1| − |1−1|', '319'],
            ['Bon résultat', '3-0', '320 − |2−3| − |1−0|', '318'],
            ['Mauvais vainqueur', '0-2', '—', '0'],
          ]}
        />
      </div>
    </div>
  </Section>
)

export default Playoff
