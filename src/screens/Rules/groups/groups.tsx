import Section from '../component/section/rulesSection'
import Table from '../component/table/table'

const Groups = () => (
  <Section>
    <div>
      <h2 className="rules-heading">Règles durant la phase de groupe</h2>
      <p>
        Les pronostics fonctionnent avec un système de côtes basé sur notre
        propre système de calcul. Pour chaque match, une côte est proposée pour
        chaque résultat possible. Ces côtes multiplieront les points attribués.
      </p>
      <p>
        Les points sont attribués comme suit :
      </p>
      <ol>
        <li>
          Le type de résultat compte en priorité : Gagnant / Perdant / Match Nul
        </li>
        <li>
          Score parfait = 100% de la côte. Score approchant = malus
          proportionnel à l&apos;écart (minimum : un tiers de la côte).
        </li>
      </ol>
    </div>
    <div>
      <p><u>Exemple : France 3-0 Mexique (cote : 116)</u></p>
      <br />
      <div className="table_section">
        <Table
          header={['Situation', 'Prono', 'Calcul', 'Points']}
          rows={[
            ['Score parfait', '3-0', '116', '116'],
            ['Bon résultat', '2-1', '116 − |3−2| − |0−1|', '114'],
            ['Bon résultat', '4-0', '116 − |3−4|', '115'],
            ['Mauvais vainqueur', '1-2', '—', '0'],
          ]}
        />
      </div>
    </div>
  </Section>
)

export default Groups
