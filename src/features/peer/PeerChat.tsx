import { useState } from 'react'
import { usePeerChat } from './usePeerChat'
import RoomSetup from './RoomSetup'
import ChatWindow from '../../components/chat/ChatWindow'
import ConnectionStatusIndicator from '../../components/chat/ConnectionStatus'
import { STORAGE_KEYS } from '../../utils/constants'

export default function PeerChat() {
  const [username, setUsername] = useState<string>(() => {
    return sessionStorage.getItem(STORAGE_KEYS.PEER_USERNAME) || ''
  })

  const {
    messages,
    sendMessage,
    sendTyping,
    addReaction,
    clearMessages,
    typingUsers,
    peerStatus,
    roomCode,
    createRoom,
    joinRoom
  } = usePeerChat(username)

  const handleJoin = (name: string, code: string) => {
    setUsername(name)
    sessionStorage.setItem(STORAGE_KEYS.PEER_USERNAME, name)
    joinRoom(code)
  }

  const handleCreate = (name: string) => {
    setUsername(name)
    sessionStorage.setItem(STORAGE_KEYS.PEER_USERNAME, name)
    createRoom()
  }

  if (peerStatus === 'idle' && !roomCode) {
    return <RoomSetup onJoin={handleJoin} onCreate={handleCreate} />
  }

  // Build a custom header subtitle to show the room code and copy button
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode)
  }

  return (
    <div className="relative h-dvh flex flex-col">
      {/* Absolute container to insert the connection status pill into the top right without modifying ChatHeader heavily */}
      <div className="absolute top-2.5 right-14 z-20 hidden md:block">
        <ConnectionStatusIndicator status={peerStatus} />
      </div>

      <ChatWindow
        title="Peer Chat"
        subtitle={
          roomCode ? (
            <span className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-300 transition-colors" onClick={copyRoomCode} title="Copy code">
              Room: <strong className="text-white tracking-widest bg-white/10 px-1 rounded">{roomCode}</strong>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </span>
          ) : 'PeerJS · P2P via WebRTC'
        }
        currentUser={username}
        messages={messages}
        typingUsers={typingUsers}
        onSendMessage={sendMessage}
        onTyping={sendTyping}
        onReaction={addReaction}
        onClearMessages={clearMessages}
        disabled={peerStatus !== 'connected'}
      />
      
      {/* Mobile connection status override */}
      <div className="absolute top-3 right-3 md:hidden">
         <div className={`w-3 h-3 rounded-full ${peerStatus === 'connected' ? 'bg-emerald-400' : peerStatus === 'connecting' ? 'bg-indigo-400 animate-pulse' : 'bg-rose-400'}`} />
      </div>
      
      {/* Connecting overlay layer */}
      {peerStatus === 'connecting' && (
        <div className="absolute inset-0 z-50 bg-dark-900/60 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
             <div className="glass-strong rounded-2xl p-8 flex flex-col items-center max-w-sm w-full mx-auto shadow-2xl">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mb-6" />
                <h3 className="text-xl font-bold mb-2">Connecting...</h3>
                <p className="text-dark-400 text-sm text-center">
                  Establishing P2P connection via WebRTC
                </p>
                {roomCode && (
                  <div className="mt-8 pt-6 border-t border-white/[0.06] w-full text-center">
                     <p className="text-xs text-dark-500 uppercase tracking-wider font-semibold mb-3">Share this room code</p>
                     <div className="flex items-center justify-center gap-2 mb-2">
                       <span className="text-3xl font-mono tracking-widest font-bold text-white">{roomCode}</span>
                       <button onClick={copyRoomCode} className="p-2 glass rounded-lg hover:bg-white/10 transition-colors text-dark-300 hover:text-white cursor-pointer active:scale-95" title="Copy">
                         <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                       </button>
                     </div>
                     <p className="text-xs text-dark-400 text-center animate-pulse">Waiting for peer to join...</p>
                  </div>
                )}
             </div>
        </div>
      )}
    </div>
  )
}
