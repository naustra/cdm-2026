import Typography from '@mui/material/Typography'
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
    <Typography variant="caption" align="right">
      {rank}
      <sup>{rank === 1 ? 'er' : 'ème'}</sup> sur {size(opponents)}
    </Typography>
  )
}

export default OwnRank
