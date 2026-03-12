import MuiAvatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

interface InlineAvatarProps {
  avatarUrl?: string
  displayName?: string
}

const InlineAvatar = ({ avatarUrl, displayName }: InlineAvatarProps) => (
  <div className="avatar-container">
    <MuiAvatar src={avatarUrl} alt={displayName} />
    {displayName && (
      <Typography className="avatar-name" variant="h3">
        {displayName}
      </Typography>
    )}
  </div>
)

export default InlineAvatar
