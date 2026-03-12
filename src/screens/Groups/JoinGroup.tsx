import { useState } from 'react'
import { useApplyInGroup } from '../../hooks/groups'

const JoinGroup = () => {
  const [code, setCode] = useState('')
  const [applyInGroup] = useApplyInGroup()

  const apply = async () => {
    if (code) {
      await applyInGroup(code)
      setCode('')
    }
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      <h3 className="text-lg font-bold text-navy m-0 mb-1">Rejoindre une tribu</h3>
      <p className="text-xs text-gray-400 m-0 mb-4">
        Entrez le code fourni par l'administrateur de la tribu
      </p>

      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5" htmlFor="join-code">
            Code d'accès
          </label>
          <input
            id="join-code"
            className="w-full py-2.5 px-3.5 border-[1.5px] border-gray-200 rounded-[10px] text-sm outline-none transition-colors bg-white focus:border-indigo-500 placeholder:text-gray-300"
            placeholder="Entrez le code..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <button
          className="self-start inline-flex items-center gap-2 font-semibold rounded-full border-none cursor-pointer transition-all duration-150 bg-navy text-white py-2 px-5 text-sm hover:bg-navy-light disabled:opacity-50"
          disabled={!code}
          onClick={apply}
        >
          Envoyer la demande
        </button>
      </div>
    </div>
  )
}

export default JoinGroup
