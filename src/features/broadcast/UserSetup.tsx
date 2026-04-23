import { useState } from 'react'
import { STORAGE_KEYS } from '../../utils/constants'
import { getAvatarColor, getInitials } from '../../utils/helpers'

interface UserSetupProps {
  onJoin: (username: string) => void
}

export default function UserSetup({ onJoin }: UserSetupProps) {
  const [name, setName] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEYS.BROADCAST_USERNAME) || ''
  })
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Please enter a display name')
      return
    }
    if (trimmed.length > 20) {
      setError('Name must be 20 characters or less')
      return
    }
    sessionStorage.setItem(STORAGE_KEYS.BROADCAST_USERNAME, trimmed)
    onJoin(trimmed)
  }

  const previewColor = name.trim() ? getAvatarColor(name.trim()) : '#52526b'
  const previewInitials = name.trim() ? getInitials(name.trim()) : '?'

  return (
    <div className="min-h-dvh flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/[0.06] blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/[0.06] blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm animate-fade-in">
        {/* Card */}
        <div className="glass-strong rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8" />
                <path d="M12 17v4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-1">Join Tab Chat</h2>
            <p className="text-dark-400 text-sm">
              Pick a display name to start chatting across tabs
            </p>
          </div>

          {/* Avatar Preview */}
          <div className="flex justify-center mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white transition-colors duration-300 shadow-lg"
              style={{ backgroundColor: previewColor }}
            >
              {previewInitials}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                id="username-input"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                placeholder="Enter your name..."
                autoFocus
                autoComplete="off"
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-white/[0.06] text-dark-50 placeholder:text-dark-500
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/30
                  transition-all duration-200 text-sm"
              />
              {error && (
                <p className="text-rose-400 text-xs mt-2 ml-1">{error}</p>
              )}
            </div>

            <button
              id="join-chat-btn"
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm
                hover:from-indigo-400 hover:to-purple-400 transition-all duration-200
                shadow-lg shadow-indigo-500/25 hover:shadow-indigo-400/30
                active:scale-[0.98] cursor-pointer"
            >
              Join Chat
            </button>
          </form>

          {/* Hint */}
          <div className="mt-6 p-3 rounded-lg bg-dark-800/50 border border-white/[0.04]">
            <p className="text-dark-400 text-xs text-center leading-relaxed">
              💡 Open this page in another tab with a different name to start chatting
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
