import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { isPast } from 'date-fns'
import { Suspense, useCallback, useMemo, type ChangeEvent } from 'react'
import { useSelectedWinner } from '../../../hooks/winner'
import { useCompetitionData } from '../../../hooks/competition'
import FinalWinnerChoice from './FinalWinnerChoice'

const FinalWinner = () => {
  const [team, saveWinner] = useSelectedWinner()
  const competitionData = useCompetitionData()

  const CompetitionStartDate = useMemo(() => {
    if (!competitionData?.start_date) return null
    return new Date(competitionData.start_date)
  }, [competitionData?.start_date])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      saveWinner(e.target.value)
    },
    [saveWinner],
  )

  if (!CompetitionStartDate) return null

  return (
    <Card className="winner-card">
      <Typography
        className="winner-typo"
        gutterBottom
        variant="h1"
        component="h2"
      >
        {isPast(CompetitionStartDate)
          ? 'Votre vainqueur final'
          : 'Choix du vainqueur final'}
      </Typography>
      <Typography className="winner-typo" color="textSecondary">
        {isPast(CompetitionStartDate)
          ? 'Vous avez parié pour :'
          : 'Quel pays gagnera la Coupe du Monde 2026 ?'}
      </Typography>
      <CardContent>
        <Suspense fallback={null}>
          <FinalWinnerChoice
            userTeam={team}
            disabled={isPast(CompetitionStartDate)}
            onValueChange={handleChange}
          />
        </Suspense>
      </CardContent>
    </Card>
  )
}

export default FinalWinner
