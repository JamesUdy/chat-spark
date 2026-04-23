import { EMOJI_LIST } from '../../utils/constants'

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
}

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Picker */}
      <div className="absolute bottom-full right-0 mb-2 z-50 glass-strong rounded-xl p-2 animate-fade-in shadow-xl shadow-black/20">
        <div className="grid grid-cols-4 gap-1">
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onSelect(emoji)
                onClose()
              }}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/[0.08] transition-colors text-lg cursor-pointer active:scale-90"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
