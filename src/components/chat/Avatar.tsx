import { getAvatarColor, getInitials } from '../../utils/helpers'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
}

export default function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  const color = getAvatarColor(name)
  const initials = getInitials(name)

  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold text-white shrink-0 ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initials}
    </div>
  )
}
