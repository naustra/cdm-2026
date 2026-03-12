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

  const locked = isPast(CompetitionStartDate)

  return (
    <div className="winner-card">
      <h3 className="winner-card__title">
        {locked ? 'Votre vainqueur final' : 'Choisissez le vainqueur'}
      </h3>
      <p className="winner-card__subtitle">
        {locked
          ? 'Vous avez parié pour :'
          : 'Qui gagnera la Coupe du Monde 2026 ?'}
      </p>
      <Suspense fallback={null}>
        <FinalWinnerChoice
          userTeam={team}
          disabled={locked}
          onValueChange={handleChange}
        />
      </Suspense>
    </div>
  )
}

export default FinalWinner
