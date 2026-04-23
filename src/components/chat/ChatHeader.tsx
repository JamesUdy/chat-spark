import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'

interface ChatHeaderProps {
  title: string
  subtitle?: ReactNode
  currentUser: string
  onlineUsers?: string[]
  onClearMessages?: () => void
  backPath?: string
}

export default function ChatHeader({
  title,
  subtitle,
  currentUser,
  onlineUsers = [],
  onClearMessages,
  backPath = '/',
}: ChatHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between !px-6 !py-4 border-b border-white/[0.06] glass-strong z-10 relative">
      {/* Left: Back + Info */}
      <div className="flex items-center gap-3">
        <button
          id="back-btn"
          onClick={() => navigate(backPath)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors text-dark-400 hover:text-dark-200 cursor-pointer"
          title="Back to home"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5m7-7-7 7 7 7" />
          </svg>
        </button>

        <div>
          <h1 className="text-sm font-semibold">{title}</h1>
          {subtitle && <p className="text-dark-400 text-xs">{subtitle}</p>}
        </div>
      </div>

      {/* Right: Online users + actions */}
      <div className="flex items-center gap-3">
        {/* Online users avatars */}
        {onlineUsers.length > 0 && (
          <div className="flex items-center -space-x-2">
            {onlineUsers.filter(u => u !== currentUser).slice(0, 3).map((user) => (
              <Avatar key={user} name={user} size="sm" className="ring-2 ring-dark-900" />
            ))}
            {onlineUsers.filter(u => u !== currentUser).length > 3 && (
              <div className="w-7 h-7 rounded-full bg-dark-600 flex items-center justify-center text-[10px] font-medium text-dark-300 ring-2 ring-dark-900">
                +{onlineUsers.filter(u => u !== currentUser).length - 3}
              </div>
            )}
          </div>
        )}

        {/* Online count badge */}
        <div className="flex items-center gap-1.5 !px-2.5 !py-1 rounded-lg bg-dark-800 text-xs text-dark-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {onlineUsers.length > 0 ? `${onlineUsers.length + 1}` : '1'} online
        </div>

        {/* Clear messages */}
        {onClearMessages && (
          <button
            id="clear-messages-btn"
            onClick={onClearMessages}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors text-dark-500 hover:text-rose-400 cursor-pointer"
            title="Clear messages"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
