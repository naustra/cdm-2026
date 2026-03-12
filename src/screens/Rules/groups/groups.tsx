import Section from '../component/section'
import Table from '../component/table'

const Groups = () => (
  <Section>
    <div>
      <h2 className="rules-heading">Règles durant la phase de groupe</h2>
      <p>
        Les pronostics fonctionnent avec un système de côtes basé sur notre
        propre système de calcul de côtes ! En effet, pour chaque match nous
        proposons une côte pour chaque résultat possible.
        <br />
        Ces côtes multiplieront les points attribués selon les trois différents
        cas ci-dessous.
        <br />
        Nous nous réservons le droit de changer les côtes jusqu&apos;à la veille de
        chaque match.
        <br />
        Les points sont attribués pour les matchs de poules comme suit :
        <ol>
          <li>
            Tout d&apos;abord c&apos;est le type de résultat qui compte en priorité :
            Gagnant/Perdant/Match Nul
          </li>
          <li>
            Ensuite soit on a le score parfait (100% de la côte est attribué),
            soit on a un score plus ou moins proche (un malus correspondant à
            l&apos;écart au score sera appliqué). Le minimum de points étant un tier
            de la côte.
          </li>
        </ol>
      </p>
    </div>
    <div>
      <p>
        <u>Exemple pour un match de poules France-Mexique</u> :
      </p>
      <br />
      <div className="table_section">
        <Table
          header={[
            'Type de résultat',
            'Score pronostiqués',
            'Vainqueur pronostiqué',
            'Score réel',
            'Cote du résultat final',
            'Vainqueur réel',
            'Points gagnés',
          ]}
          rows={[
            [
              'Bon score',
              '3-0',
              'France',
              '3-0',
              '116',
              'France',
              '116',
            ],
            [
              'Bon résultat',
              '2-1',
              'France',
              '3-0',
              '116',
              'France',
              '116 - |3-2| - |0-1| = 114',
            ],
            [
              'Bon résultat',
              '4-0',
              'France',
              '3-0',
              '116',
              'France',
              '116 - |3-4| - |0-0| = 115',
            ],
            [
              'Mauvais vainqueur',
              '1-2',
              'Mexique',
              '3-0',
              '116',
              'France',
              '0',
            ],
          ]}
        />
      </div>
    </div>
  </Section>
)

export default Groups
