import { useState } from 'react'
import { useCreateGroup } from '../../../hooks/groups'

const CreateGroup = () => {
  const [name, setName] = useState('')
  const createGroup = useCreateGroup()

  const errorMessage =
    name.length > 0 && name.length < 5 ? '5 caractères minimum' : undefined

  const isFormValid = name.length >= 5 && !errorMessage

  return (
    <div className="group-card">
      <h3 className="group-card__title">Créer une tribu</h3>
      <p className="group-card__desc">
        Créez votre tribu et invitez vos proches à vous rejoindre
      </p>

      <div className="flex flex-col gap-3">
        <div>
          <label className="form-label" htmlFor="group-name">
            Nom de la tribu
          </label>
          <input
            id="group-name"
            className="form-input"
            placeholder="Ex: Les Bleus 2026"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errorMessage && <p className="form-error">{errorMessage}</p>}
        </div>

        <button
          className="btn btn--primary"
          disabled={!isFormValid}
          onClick={async () => {
            await createGroup({ name })
            setName('')
          }}
          style={{ alignSelf: 'flex-start', opacity: isFormValid ? 1 : 0.5 }}
        >
          Créer la tribu
        </button>
      </div>
    </div>
  )
}

export default CreateGroup
