import type { ReactNode } from 'react'
import type { ChatMessage } from '../../types'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import TypingIndicator from './TypingIndicator'

interface ChatWindowProps {
  title: string
  subtitle?: ReactNode
  currentUser: string
  messages: ChatMessage[]
  typingUsers: string[]
  onlineUsers?: string[]
  onSendMessage: (text: string) => void
  onTyping: (isTyping: boolean) => void
  onReaction: (messageId: string, emoji: string) => void
  onClearMessages?: () => void
  disabled?: boolean
  backPath?: string
}

export default function ChatWindow({
  title,
  subtitle,
  currentUser,
  messages,
  typingUsers,
  onlineUsers,
  onSendMessage,
  onTyping,
  onReaction,
  onClearMessages,
  disabled = false,
  backPath,
}: ChatWindowProps) {
  return (
    <div className="h-dvh flex flex-col bg-dark-950 items-center justify-center">
      <div className="flex flex-col w-full h-full md:h-[95vh] md:max-w-4xl md:border md:border-white/[0.05] md:rounded-2xl md:shadow-2xl bg-dark-900 relative overflow-hidden">
        <ChatHeader
          title={title}
          subtitle={subtitle}
          currentUser={currentUser}
          onlineUsers={onlineUsers}
          onClearMessages={onClearMessages}
          backPath={backPath}
        />

        <MessageList
          messages={messages}
          currentUser={currentUser}
          onReaction={onReaction}
        />

        <TypingIndicator typingUsers={typingUsers} />

        <MessageInput
          onSend={onSendMessage}
          onTyping={onTyping}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
