import { useState, useRef, useCallback, useEffect } from 'react'

interface MessageInputProps {
  onSend: (text: string) => void
  onTyping: (isTyping: boolean) => void
  disabled?: boolean
}

export default function MessageInput({ onSend, onTyping, disabled = false }: MessageInputProps) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTypingRef = useRef(false)

  // Auto-resize textarea
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [text])

  const stopTyping = useCallback(() => {
    if (isTypingRef.current) {
      isTypingRef.current = false
      onTyping(false)
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
  }, [onTyping])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)

    // Typing indicator logic
    if (!isTypingRef.current) {
      isTypingRef.current = true
      onTyping(true)
    }

    // Reset the "stop typing" timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(stopTyping, 2000)
  }

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText('')
    stopTyping()
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="!px-6 !py-4 border-t border-white/[0.06] bg-dark-900/50 z-10 relative">
      <div className="flex items-end gap-3">
        {/* Input */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            id="message-input"
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            rows={1}
            className="!w-full !px-4 !py-2.5 rounded-xl bg-dark-800 border border-white/[0.06] text-dark-50 placeholder:text-dark-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/20
              transition-all duration-200 text-sm resize-none leading-relaxed
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Send Button */}
        <button
          id="send-message-btn"
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="!w-10 !h-10 flex items-center justify-center rounded-xl bg-indigo-500 text-white
            hover:bg-indigo-400 transition-all duration-200 shrink-0
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-indigo-500
            active:scale-95 cursor-pointer shadow-lg shadow-indigo-500/20"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
      <p className="text-dark-600 text-[10px] mt-1.5 ml-1">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}
