import { useRef, useEffect } from 'react'
import type { ChatMessage } from '../../types'
import MessageBubble from './MessageBubble'

interface MessageListProps {
  messages: ChatMessage[]
  currentUser: string
  onReaction: (messageId: string, emoji: string) => void
}

export default function MessageList({ messages, currentUser, onReaction }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isNearBottomRef = useRef(true)

  // Track if user is near bottom
  const handleScroll = () => {
    const el = containerRef.current
    if (!el) return
    const threshold = 100
    isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < threshold
  }

  // Auto-scroll on new messages if near bottom
  useEffect(() => {
    if (isNearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Group consecutive messages from the same sender
  const shouldShowSender = (index: number): boolean => {
    if (index === 0) return true
    const prev = messages[index - 1]
    const curr = messages[index]
    if (prev.sender !== curr.sender) return true
    // Show sender again if gap is > 2 minutes
    if (curr.timestamp - prev.timestamp > 2 * 60 * 1000) return true
    return false
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto py-4 space-y-0.5 scroll-smooth"
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-dark-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H6l-4 4V6c0-1.1.9-2 2-2z" />
            </svg>
          </div>
          <h3 className="text-dark-300 font-medium mb-1">No messages yet</h3>
          <p className="text-dark-500 text-sm max-w-xs">
            Start the conversation! Your messages will appear here.
          </p>
        </div>
      ) : (
        messages.map((msg, i) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender === currentUser}
            currentUser={currentUser}
            onReaction={onReaction}
            showSender={shouldShowSender(i)}
          />
        ))
      )}
      <div ref={bottomRef} />
    </div>
  )
}
