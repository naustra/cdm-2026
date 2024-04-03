import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useCreateGroup } from '../../../hooks/groups'
import './CreateGroup.scss'

const CreateGroup = () => {
  const [name, setName] = useState('')
  const createGroup = useCreateGroup()

  const errorMessage =
    name.length > 0 && name.length < 5 ? '5 caractères minimum' : undefined

  const isFormValid = () => name && !errorMessage

  const handleNameChange = (e) => setName(e.target.value)

  return (
    <Card className="create-group-card">
      <Typography gutterBottom variant="h1">
        Créer une tribu
      </Typography>
      <br />
      <Typography gutterBottom variant="h3">
        Créez une tribu pour vous confrontez à vos amis, collègues, famille...
      </Typography>
      <br />
      <Typography variant="body2">
        L'inscription aux tribus est gratuite. <br /> Néanmoins, il est
        conseillé aux tribus de mettre en place une cagnotte pour récompenser
        les vainqueurs et rajouter de l'enjeu.
      </Typography>

      <CardContent className="create-group-content">
        <FormControl className="create-group-field" error={!!errorMessage}>
          <TextField
            required
            label="Nom de la tribu"
            value={name}
            onChange={handleNameChange}
          />
          {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
        </FormControl>
      </CardContent>

      <CardActions>
        <Button
          disabled={!isFormValid()}
          onClick={async () => {
            await createGroup({
              name,
            })
            setName('')
          }}
          color="primary"
          variant="contained"
        >
          Envoyer la demande
        </Button>
      </CardActions>
    </Card>
  )
}

CreateGroup.propTypes = {}

export default CreateGroup
