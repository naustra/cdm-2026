import find from 'lodash/find'
import Flag from '../../../components/Flag'
import { useTeams } from '../../../hooks/teams'

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
        <Flag country={selectedTeam.code} className="h-16 mx-auto mb-3" />
      )}

      <select
        value={userTeam ?? ''}
        onChange={onValueChange}
        disabled={disabled}
        className="w-full py-2.5 px-3.5 border-[1.5px] border-gray-200 rounded-[10px] text-sm outline-none transition-colors bg-white focus:border-indigo-500"
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
        <p className="text-xs font-semibold text-indigo-500 mt-2">
          Cote : {selectedTeam.winOdd}
        </p>
      )}
    </div>
  )
}

export default FinalWinnerChoice
