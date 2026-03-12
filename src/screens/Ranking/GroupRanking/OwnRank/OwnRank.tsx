import findIndex from 'lodash/findIndex'
import size from 'lodash/size'
import { useAuth } from '../../../../contexts/AuthContext'

interface OwnRankProps {
  opponents: Array<{ id: string; score?: number | null }>
  members?: string[]
}

const OwnRank = ({ opponents }: OwnRankProps) => {
  const { user } = useAuth()
  const uid = user?.id
  const rank = findIndex(opponents, { id: uid }) + 1

  return (
    <p className="ranking-own">
      {rank}
      <sup>{rank === 1 ? 'er' : 'e'}</sup> sur {size(opponents)} joueurs
    </p>
  )
}

export default OwnRank
