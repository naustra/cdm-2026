import find from 'lodash/find'
import Flag from '../../../../components/Flag'
import { useTeams } from '../../../../hooks/teams'

interface FinalWinnerChoiceProps {
  userTeam: string | null | undefined
  disabled: boolean
  onValueChange: (e: any) => void
}

const FinalWinnerChoice = ({
  userTeam,
  disabled,
  onValueChange,
}: FinalWinnerChoiceProps) => {
  const teams = useTeams()
  const selectedTeam = find(teams, (t) => t.id === userTeam)

  return (
    <div className="flex flex-col items-center gap-3">
      {selectedTeam && (
        <Flag country={selectedTeam.code} className="winner-card__flag" />
      )}

      <select
        value={userTeam ?? ''}
        onChange={onValueChange}
        disabled={disabled}
        className="native-select"
      >
        <option value="" disabled>
          Sélectionner une équipe
        </option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>

      {selectedTeam?.winOdd && (
        <p className="winner-card__odd">
          Cote : {selectedTeam.winOdd}
        </p>
      )}
    </div>
  )
}

export default FinalWinnerChoice
