interface InlineAvatarProps {
  avatarUrl?: string
  displayName?: string
  size?: number
}

function getInitials(name?: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const InlineAvatar = ({ avatarUrl, displayName, size = 32 }: InlineAvatarProps) => (
  <div className="avatar-container">
    {avatarUrl ? (
      <img
        src={avatarUrl}
        alt={displayName || ''}
        className="avatar-img"
        style={{ width: size, height: size }}
      />
    ) : (
      <div
        className="avatar-fallback"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {getInitials(displayName)}
      </div>
    )}
    {displayName && <span className="avatar-name">{displayName}</span>}
  </div>
)

export default InlineAvatar
