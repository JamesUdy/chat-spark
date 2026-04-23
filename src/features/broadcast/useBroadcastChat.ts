import { useState, useEffect, useCallback, useRef } from 'react'
import type { ChatMessage, BroadcastEvent } from '../../types'
import { BROADCAST_CHANNEL_NAME, STORAGE_KEYS } from '../../utils/constants'
import { generateId } from '../../utils/helpers'

/**
 * Custom hook that manages the BroadcastChannel chat logic.
 *
 * Each tab acts as a different user. Messages are broadcast in real-time
 * across tabs via the BroadcastChannel API and persisted in sessionStorage
 * so they survive page refreshes within the same tab.
 *
 * On first load, the hook requests a sync from other active tabs to
 * catch up on any messages that were sent while this tab was closed.
 */
export function useBroadcastChat(username: string) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = sessionStorage.getItem(STORAGE_KEYS.BROADCAST_MESSAGES)
    return stored ? JSON.parse(stored) : []
  })
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())

  const channelRef = useRef<BroadcastChannel | null>(null)
  const typingTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const hasSyncedRef = useRef(false)

  // Persist messages to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.BROADCAST_MESSAGES, JSON.stringify(messages))
  }, [messages])

  // Initialize BroadcastChannel
  useEffect(() => {
    if (!username) return

    const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME)
    channelRef.current = channel

    // Handle incoming events
    channel.onmessage = (event: MessageEvent) => {
      const data = event.data as BroadcastEvent

      switch (data.type) {
        case 'message':
          setMessages((prev) => {
            // Prevent duplicate messages
            if (prev.some((m) => m.id === data.message.id)) return prev
            return [...prev, data.message]
          })
          break

        case 'typing': {
          if (data.sender === username) break
          setTypingUsers((prev) => {
            const next = new Set(prev)
            if (data.isTyping) {
              next.add(data.sender)
            } else {
              next.delete(data.sender)
            }
            return next
          })

          // Auto-clear typing after 3s
          if (data.isTyping) {
            const existing = typingTimeoutsRef.current.get(data.sender)
            if (existing) clearTimeout(existing)
            typingTimeoutsRef.current.set(
              data.sender,
              setTimeout(() => {
                setTypingUsers((prev) => {
                  const next = new Set(prev)
                  next.delete(data.sender)
                  return next
                })
                typingTimeoutsRef.current.delete(data.sender)
              }, 3000)
            )
          }
          break
        }

        case 'reaction':
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id !== data.messageId) return msg
              const reactions = { ...msg.reactions }
              const users = reactions[data.emoji] ? [...reactions[data.emoji]] : []
              if (users.includes(data.sender)) {
                // Toggle off
                reactions[data.emoji] = users.filter((u) => u !== data.sender)
                if (reactions[data.emoji].length === 0) delete reactions[data.emoji]
              } else {
                reactions[data.emoji] = [...users, data.sender]
              }
              return { ...msg, reactions }
            })
          )
          break

        case 'user-join':
          setOnlineUsers((prev) => new Set(prev).add(data.sender))
          // Respond with our presence
          channel.postMessage({ type: 'user-join', sender: username })
          break

        case 'user-leave':
          setOnlineUsers((prev) => {
            const next = new Set(prev)
            next.delete(data.sender)
            return next
          })
          setTypingUsers((prev) => {
            const next = new Set(prev)
            next.delete(data.sender)
            return next
          })
          break

        case 'sync-request':
          // Another tab is asking for message history — send ours
          if (data.sender !== username) {
            channel.postMessage({
              type: 'sync-response',
              messages: JSON.parse(sessionStorage.getItem(STORAGE_KEYS.BROADCAST_MESSAGES) || '[]'),
              sender: username,
            })
          }
          break

        case 'sync-response':
          // Merge received messages with ours (dedup by id)
          if (!hasSyncedRef.current) {
            hasSyncedRef.current = true
            setMessages((prev) => {
              const idSet = new Set(prev.map((m) => m.id))
              const newMsgs = (data.messages as ChatMessage[]).filter((m) => !idSet.has(m.id))
              if (newMsgs.length === 0) return prev
              const merged = [...prev, ...newMsgs].sort((a, b) => a.timestamp - b.timestamp)
              return merged
            })
          }
          break
      }
    }

    // Announce our presence
    channel.postMessage({ type: 'user-join', sender: username })

    // Request sync from other tabs
    channel.postMessage({ type: 'sync-request', sender: username })

    // Cleanup on tab close
    const handleUnload = () => {
      channel.postMessage({ type: 'user-leave', sender: username })
      channel.close()
    }
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      handleUnload()
      window.removeEventListener('beforeunload', handleUnload)
      typingTimeoutsRef.current.forEach((t) => clearTimeout(t))
      typingTimeoutsRef.current.clear()
    }
  }, [username])

  // Send a message
  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !channelRef.current) return

      const message: ChatMessage = {
        id: generateId(),
        text: text.trim(),
        sender: username,
        timestamp: Date.now(),
        reactions: {},
      }

      // Add to local state
      setMessages((prev) => [...prev, message])

      // Broadcast to other tabs
      channelRef.current.postMessage({ type: 'message', message })
    },
    [username]
  )

  // Send typing indicator (debounced externally)
  const sendTyping = useCallback(
    (isTyping: boolean) => {
      channelRef.current?.postMessage({ type: 'typing', sender: username, isTyping })
    },
    [username]
  )

  // Add/toggle a reaction on a message
  const addReaction = useCallback(
    (messageId: string, emoji: string) => {
      // Update local state
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== messageId) return msg
          const reactions = { ...msg.reactions }
          const users = reactions[emoji] ? [...reactions[emoji]] : []
          if (users.includes(username)) {
            reactions[emoji] = users.filter((u) => u !== username)
            if (reactions[emoji].length === 0) delete reactions[emoji]
          } else {
            reactions[emoji] = [...users, username]
          }
          return { ...msg, reactions }
        })
      )

      // Broadcast
      channelRef.current?.postMessage({ type: 'reaction', messageId, emoji, sender: username })
    },
    [username]
  )

  // Clear all messages (local only)
  const clearMessages = useCallback(() => {
    setMessages([])
    sessionStorage.removeItem(STORAGE_KEYS.BROADCAST_MESSAGES)
  }, [])

  return {
    messages,
    sendMessage,
    sendTyping,
    addReaction,
    clearMessages,
    typingUsers: Array.from(typingUsers),
    onlineUsers: Array.from(onlineUsers),
  }
}
