import Typography from '@mui/material/Typography'

import Section from '../component/section'
import Table from '../component/table'

const Groups = () => (
  <Section>
    <div>
      <Typography variant="h1">Règles durant la phase de groupe</Typography>
      <p>
        Les pronostics fonctionnent avec un système de côtes basé sur notre
        propre système de calcul de côtes ! En effet, pour chaque match nous
        proposons une côte pour chaque résultat possible.
        <br />
        Ces côtes multiplieront les points attribués selon les trois différents
        cas ci-dessous.
        <br />
        Nous nous réservons le droit de changer les côtes jusqu’à la veille de
        chaque match.
        <br />
        Les points sont attribués pour les matchs de poules comme suit :
        <ol>
          <li>
            Tout d’abord c’est le type de résultat qui compte en priorité :
            Gagnant/Perdant/Match Nul
          </li>
          <li>
            Ensuite soit on a le score parfait (100% de la côte est attribué),
            soit on a un score plus ou moins proche (un malus correspondant à
            l'écart au score sera appliqué). Le minimum de points étant un tier
            de la côte.
          </li>
        </ol>
      </p>
    </div>
    <div>
      <p>
        <u>Exemple pour un match de poules France-Australie</u> :
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
              <div>
                <div>30-10</div>
              </div>,
              <div>
                <div>France</div>
              </div>,
              <div>
                <div>30-10</div>
              </div>,
              <div>
                <div>116</div>
              </div>,
              <div>
                <div>France</div>
              </div>,
              <div>
                <div>116</div>
              </div>,
            ],
            [
              'Bon résultat',
              <div>
                <div>20-10</div>
              </div>,
              <div>
                <div>France</div>
              </div>,
              <div>
                <div>30-10</div>
              </div>,
              <div>
                <div>116</div>
              </div>,
              <div>
                <div>France</div>
              </div>,
              <div>
                <div>116 - |30-20| = 106</div>
              </div>,
            ],
            [
              'Bon résultat',
              <div>
                <div>40-0</div>
              </div>,
              <div>
                <div>France</div>
              </div>,
              <div>
                <div>30-10</div>
              </div>,
              <div>
                <div>116</div>
              </div>,
              <div>
                <div>France</div>
              </div>,
              <div>
                <div>116 - |30-40| - |10-0| = 96</div>
              </div>,
            ],
            [
              'Mauvais vainqueur',
              <div>
                <div>15-20</div>
              </div>,
              <div>
                <div>Australie</div>
              </div>,
              <div>
                <div>30-10</div>
              </div>,
              <div>
                <div>116</div>
              </div>,
              <div>
                <div>France</div>
              </div>,
              <div>
                <div>0</div>
              </div>,
            ],
          ]}
        />
      </div>
    </div>
  </Section>
)

export default Groups
