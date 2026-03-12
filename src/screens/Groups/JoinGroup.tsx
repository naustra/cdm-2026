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
    <div className="group-card">
      <h3 className="group-card__title">Rejoindre une tribu</h3>
      <p className="group-card__desc">
        Entrez le code fourni par l'administrateur de la tribu
      </p>

      <div className="flex flex-col gap-3">
        <div>
          <label className="form-label" htmlFor="join-code">
            Code d'accès
          </label>
          <input
            id="join-code"
            className="form-input"
            placeholder="Entrez le code..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <button
          className="btn btn--primary"
          disabled={!code}
          onClick={apply}
          style={{ alignSelf: 'flex-start', opacity: code ? 1 : 0.5 }}
        >
          Envoyer la demande
        </button>
      </div>
    </div>
  )
}

export default JoinGroup
