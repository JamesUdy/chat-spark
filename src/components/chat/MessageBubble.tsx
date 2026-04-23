import { useState } from 'react'
import type { ChatMessage } from '../../types'
import { formatTime } from '../../utils/formatTime'
import { parseMessageText } from '../../utils/helpers'
import Avatar from './Avatar'
import EmojiPicker from './EmojiPicker'
import { EMOJI_LIST } from '../../utils/constants'

interface MessageBubbleProps {
  message: ChatMessage
  isOwn: boolean
  currentUser: string
  onReaction: (messageId: string, emoji: string) => void
  showSender?: boolean
}

export default function MessageBubble({
  message,
  isOwn,
  currentUser,
  onReaction,
  showSender = true,
}: MessageBubbleProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showReactionBar, setShowReactionBar] = useState(false)
  const segments = parseMessageText(message.text)
  const reactionEntries = Object.entries(message.reactions)

  return (
    <div
      className={`group flex gap-2.5 px-4 py-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={() => setShowReactionBar(true)}
      onMouseLeave={() => {
        setShowReactionBar(false)
        setShowEmojiPicker(false)
      }}
    >
      {/* Avatar */}
      {!isOwn && showSender && <Avatar name={message.sender} size="sm" className="mt-1" />}
      {!isOwn && !showSender && <div className="w-7 shrink-0" />}

      {/* Content */}
      <div className={`max-w-[75%] min-w-0 ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Sender name */}
        {!isOwn && showSender && (
          <span className="text-[11px] font-medium text-dark-400 mb-1 ml-1">
            {message.sender}
          </span>
        )}

        {/* Bubble */}
        <div className="relative">
          <div
            className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed break-words
              ${isOwn
                ? 'bg-indigo-500 text-white rounded-br-md'
                : 'bg-dark-700 text-dark-100 rounded-bl-md'
              }`}
          >
            {segments.map((seg, i) =>
              seg.type === 'link' ? (
                <a
                  key={i}
                  href={seg.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`underline underline-offset-2 break-all ${isOwn ? 'text-indigo-100 hover:text-white' : 'text-indigo-400 hover:text-indigo-300'}`}
                >
                  {seg.content}
                </a>
              ) : (
                <span key={i}>{seg.content}</span>
              )
            )}
          </div>

          {/* Quick reaction bar */}
          {showReactionBar && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-0.5 z-30
                ${isOwn ? 'right-full mr-1' : 'left-full ml-1'}`}
            >
              <div className="relative">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="w-7 h-7 flex items-center justify-center rounded-full glass hover:bg-white/[0.1] transition-colors text-dark-400 hover:text-dark-200 cursor-pointer text-xs"
                  title="React"
                >
                  😊
                </button>
                {showEmojiPicker && (
                  <EmojiPicker
                    onSelect={(emoji) => onReaction(message.id, emoji)}
                    onClose={() => setShowEmojiPicker(false)}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Reactions */}
        {reactionEntries.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            {reactionEntries.map(([emoji, users]) => {
              const hasReacted = users.includes(currentUser)
              return (
                <button
                  key={emoji}
                  onClick={() => onReaction(message.id, emoji)}
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs cursor-pointer transition-colors
                    ${hasReacted
                      ? 'bg-indigo-500/20 ring-1 ring-indigo-500/30 text-indigo-300'
                      : 'bg-dark-700 hover:bg-dark-600 text-dark-300'
                    }`}
                  title={users.join(', ')}
                >
                  <span>{emoji}</span>
                  <span className="text-[10px] font-medium">{users.length}</span>
                </button>
              )
            })}
            {/* Quick add common reactions */}
            <button
              onClick={() => {
                // Find first unused reaction
                const used = new Set(reactionEntries.map(([e]) => e))
                const next = EMOJI_LIST.find((e) => !used.has(e))
                if (next) onReaction(message.id, next)
              }}
              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-dark-600 text-dark-500 hover:text-dark-300 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14m-7-7h14" />
              </svg>
            </button>
          </div>
        )}

        {/* Timestamp */}
        <span className={`text-[10px] text-dark-500 mt-0.5 ${isOwn ? 'mr-1 text-right' : 'ml-1'} opacity-0 group-hover:opacity-100 transition-opacity`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  )
}
