interface TypingIndicatorProps {
  typingUsers: string[]
}

export default function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (typingUsers.length === 0) return null

  const text =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing`
      : typingUsers.length === 2
        ? `${typingUsers[0]} and ${typingUsers[1]} are typing`
        : `${typingUsers[0]} and ${typingUsers.length - 1} others are typing`

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-dark-400 text-xs">
      <div className="flex gap-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-dark-400 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-dark-400 animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1s' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-dark-400 animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1s' }} />
      </div>
      <span>{text}</span>
    </div>
  )
}
