import { useState } from 'react'

interface RoomSetupProps {
  onJoin: (username: string, roomCode: string) => void
  onCreate: (username: string) => void
}

export default function RoomSetup({ onJoin, onCreate }: RoomSetupProps) {
  const [username, setUsername] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [mode, setMode] = useState<'select' | 'join' | 'create'>('select')
  const [error, setError] = useState('')

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return setError('Please enter a display name')
    if (!roomCode.trim()) return setError('Please enter a room code')
    onJoin(username.trim(), roomCode.trim().toUpperCase())
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return setError('Please enter a display name')
    onCreate(username.trim())
  }

  return (
    <div className="min-h-dvh flex items-center justify-center !p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/[0.06] blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/[0.06] blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm animate-fade-in">
        <div className="glass-strong rounded-2xl !p-8 mx-auto w-full">
          <div className="text-center !mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7" cy="12" r="3" />
                <circle cx="17" cy="12" r="3" />
                <path d="M10 12h4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-1">Peer Chat</h2>
            <p className="text-dark-400 text-sm">True P2P across devices</p>
          </div>

          {mode === 'select' && (
            <div className="!space-y-3 !pt-4">
              <button
                onClick={() => setMode('create')}
                className="w-full !py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                Create New Room
              </button>
              <button
                onClick={() => setMode('join')}
                className="w-full !py-3 rounded-xl bg-dark-700 hover:bg-dark-600 font-semibold text-sm transition-all cursor-pointer"
              >
                Join Existing Room
              </button>
            </div>
          )}

          {(mode === 'create' || mode === 'join') && (
            <form onSubmit={mode === 'create' ? handleCreate : handleJoin} className="!space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your display name..."
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError('') }}
                  className="w-full !px-4 !py-3 rounded-xl bg-dark-800 border border-white/[0.06] focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm"
                />
              </div>
              
              {mode === 'join' && (
                <div>
                  <input
                    type="text"
                    placeholder="Room code..."
                    value={roomCode}
                    onChange={(e) => { setRoomCode(e.target.value.toUpperCase()); setError('') }}
                    className="w-full !px-4 !py-3 rounded-xl bg-dark-800 border border-white/[0.06] focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm uppercase"
                  />
                </div>
              )}

              {error && <p className="text-rose-400 text-xs ml-1">{error}</p>}

              <button type="submit" className="w-full !py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-indigo-400/30 cursor-pointer">
                {mode === 'create' ? 'Create Room' : 'Join Room'}
              </button>
              
              <button type="button" onClick={() => setMode('select')} className="w-full py-2 text-dark-400 hover:text-dark-200 text-sm mt-2 transition-colors cursor-pointer">
                Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
