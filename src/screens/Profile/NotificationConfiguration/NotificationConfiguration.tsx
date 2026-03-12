import InfoOutlined from '@mui/icons-material/InfoOutlined'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

const NotificationConfiguration = () => {
  return (
    <div className="mt-8">
      <Typography variant="h3">
        Choisissez les types de notifications:
      </Typography>

      <div className="info-wrapper">
        <FormControlLabel
          control={<Switch disabled />}
          label="Activer les rappels avant match"
        />
        <Tooltip
          title="Notifications non disponibles pour le moment"
          enterTouchDelay={0}
        >
          <InfoOutlined style={{ fontSize: 14, marginLeft: -12 }} />
        </Tooltip>
      </div>
    </div>
  )
}

export default NotificationConfiguration
