import type { ConnectionStatus } from '../../types'

interface ConnectionStatusIndicatorProps {
  status: ConnectionStatus
}

export default function ConnectionStatusIndicator({ status }: ConnectionStatusIndicatorProps) {
  let color = 'bg-dark-500'
  let label = 'Unknown'
  let animate = false

  switch (status) {
    case 'idle':
      color = 'bg-amber-400'
      label = 'Waiting for peer...'
      animate = true
      break
    case 'connecting':
      color = 'bg-indigo-400'
      label = 'Connecting...'
      animate = true
      break
    case 'connected':
      color = 'bg-emerald-400'
      label = 'Connected directly'
      break
    case 'disconnected':
    case 'error':
      color = 'bg-rose-400'
      label = 'Disconnected'
      break
  }

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-800 text-xs text-dark-300 pointer-events-none">
      <span className={`w-1.5 h-1.5 rounded-full ${color} ${animate ? 'animate-pulse' : ''}`} />
      <span className="truncate">{label}</span>
      {status === 'connected' && (
        <svg className="w-3 h-3 text-emerald-400 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )}
    </div>
  )
}
