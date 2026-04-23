import { useState } from 'react'
import UserSetup from './UserSetup'
import ChatWindow from '../../components/chat/ChatWindow'
import { useBroadcastChat } from './useBroadcastChat'

export default function BroadcastChat() {
  const [username, setUsername] = useState<string>('')
  
  const {
    messages,
    sendMessage,
    sendTyping,
    addReaction,
    clearMessages,
    typingUsers,
    onlineUsers,
  } = useBroadcastChat(username)

  if (!username) {
    return <UserSetup onJoin={setUsername} />
  }

  return (
    <ChatWindow
      title="Tab Chat"
      subtitle={
        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Same-device sync active
        </div>
      }
      currentUser={username}
      messages={messages}
      typingUsers={typingUsers}
      onlineUsers={onlineUsers}
      onSendMessage={sendMessage}
      onTyping={sendTyping}
      onReaction={addReaction}
      onClearMessages={clearMessages}
      backPath="/"
    />
  )
}
