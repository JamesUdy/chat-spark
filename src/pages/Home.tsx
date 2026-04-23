import { useNavigate } from 'react-router-dom'

const approaches = [
  {
    id: 'broadcast',
    title: 'Tab Chat',
    subtitle: 'BroadcastChannel API',
    description:
      'Communicate between browser tabs on the same device. Open two tabs — each becomes a different user. Messages sync instantly via the native BroadcastChannel API.',
    path: '/broadcast',
    badges: ['No Setup', 'Same Device', 'Instant Sync'],
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="M7 8h2m2 0h2" />
        <path d="M7 11h5" />
      </svg>
    ),
    gradient: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
    accentColor: 'text-indigo-400',
    borderHover: 'hover:border-indigo-500/30',
    badgeStyle: 'bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-500/20',
    buttonStyle:
      'bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-400/30',
  },
  {
    id: 'peer',
    title: 'Peer Chat',
    subtitle: 'WebRTC · PeerJS',
    description:
      'True peer-to-peer communication. Create a room, share the code, and chat directly — no server stores your messages. Works across devices and networks.',
    path: '/peer',
    badges: ['Cross-Device', 'P2P Encrypted', 'No Backend'],
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="12" r="3" />
        <circle cx="17" cy="12" r="3" />
        <path d="M10 12h4" />
        <path d="M7 3v3m0 12v3M17 3v3m0 12v3" />
      </svg>
    ),
    gradient: 'from-purple-500/20 via-purple-500/5 to-transparent',
    accentColor: 'text-purple-400',
    borderHover: 'hover:border-purple-500/30',
    badgeStyle: 'bg-purple-500/10 text-purple-300 ring-1 ring-purple-500/20',
    buttonStyle:
      'bg-purple-500 hover:bg-purple-400 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-400/30',
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/[0.07] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/[0.07] blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/[0.03] blur-[80px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H6l-4 4V6c0-1.1.9-2 2-2z" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight">
            Chat<span className="text-indigo-400">Spark</span>
          </span>
        </div>
        <a
          href="https://github.com/JamesUdy/chat-spark.git"
          target="_blank"
          rel="noopener noreferrer"
          className="text-dark-400 hover:text-dark-200 transition-colors text-sm flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Source
        </a>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-dark-200 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Real-time chat — no backend required
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5">
            Chat in{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              real time
            </span>
            ,{' '}
            <br className="hidden sm:block" />
            two ways.
          </h1>
          <p className="text-dark-300 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Choose an approach below. One uses browser-native APIs for same-device tab sync.
            The other uses WebRTC for true peer-to-peer across any device.
          </p>
        </div>

        {/* Approach Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          {approaches.map((approach, i) => (
            <button
              key={approach.id}
              id={`approach-card-${approach.id}`}
              onClick={() => navigate(approach.path)}
              className={`group relative text-left rounded-2xl border border-white/[0.06] p-7 transition-all duration-300
                ${approach.borderHover}
                hover:-translate-y-1 hover:shadow-2xl cursor-pointer
                animate-slide-up`}
              style={{ animationDelay: `${i * 100 + 200}ms` }}
            >
              {/* Card gradient bg */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${approach.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                {/* Icon + Title */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className={`${approach.accentColor} mb-3`}>{approach.icon}</div>
                    <h2 className="text-xl font-bold mb-0.5">{approach.title}</h2>
                    <p className="text-dark-400 text-sm font-medium">{approach.subtitle}</p>
                  </div>
                  <svg
                    className="w-5 h-5 text-dark-500 group-hover:text-dark-300 group-hover:translate-x-0.5 transition-all duration-300 mt-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </div>

                {/* Description */}
                <p className="text-dark-300 text-sm leading-relaxed mb-5">
                  {approach.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {approach.badges.map((badge) => (
                    <span
                      key={badge}
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${approach.badgeStyle}`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${approach.buttonStyle}`}
                >
                  Start Chatting
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-dark-500 text-xs">
        Built with React, TypeScript & TailwindCSS — No backend required
      </footer>
    </div>
  )
}
