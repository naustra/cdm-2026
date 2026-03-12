import Bonus from './bonus/bonus'
import Groups from './groups/groups'
import Playoff from './playoff/playoff'
import Subscription from './subscription/subscription'

const Rules = () => (
  <div className="rules-page">
    <div style={{ textAlign: 'center', marginBottom: 24 }}>
      <h1 className="page-title">Règles du jeu</h1>
      <p className="page-subtitle">Tout savoir sur le fonctionnement des pronostics</p>
    </div>
    <Subscription />
    <Groups />
    <Playoff />
    <Bonus />
  </div>
)

export default Rules
