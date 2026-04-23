import { useRef, useCallback } from 'react'

/**
 * Hook to play a subtle notification sound when a new message arrives
 * and the tab is not focused.
 */
export function useNotification() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playNotification = useCallback(() => {
    if (document.hasFocus()) return

    try {
      if (!audioRef.current) {
        // Create a simple notification beep using AudioContext
        const audioContext = new AudioContext()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = 800
        oscillator.type = 'sine'
        gainNode.gain.value = 0.1

        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      }
    } catch {
      // Audio may be blocked by browser policy — silently ignore
    }
  }, [])

  return { playNotification }
}
