import { useState, useEffect, useCallback, useRef } from 'react'
import Peer from 'peerjs'
import type { DataConnection } from 'peerjs'
import type { ChatMessage, PeerEvent, ConnectionStatus } from '../../types'
import { STORAGE_KEYS } from '../../utils/constants'
import { generateId, generateRoomCode } from '../../utils/helpers'

/**
 * Custom hook that manages the PeerJS WebRTC chat logic.
 *
 * This enables true peer-to-peer connection where one user
 * acts as the host (creates room) and the other joins.
 */
export function usePeerChat(username: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [peerStatus, setPeerStatus] = useState<ConnectionStatus>('idle')
  const [roomCode, setRoomCode] = useState<string>('')
  
  const peerRef = useRef<Peer | null>(null)
  const connectionRef = useRef<DataConnection | null>(null)
  const typingTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  // Handle incoming data from the connection
  const setupConnection = useCallback((conn: DataConnection) => {
    connectionRef.current = conn

    conn.on('open', () => {
      setPeerStatus('connected')
    })

    conn.on('data', (data: any) => {
      const event = data as PeerEvent

      switch (event.type) {
        case 'message':
          setMessages((prev) => {
            if (prev.some((m) => m.id === event.message.id)) return prev
            const newMsgs = [...prev, event.message]
            // Persist to local storage under the room code
            localStorage.setItem(`${STORAGE_KEYS.PEER_MESSAGES}-${roomCode}`, JSON.stringify(newMsgs))
            return newMsgs
          })
          break

        case 'typing': {
          setTypingUsers((prev) => {
            const next = new Set(prev)
            if (event.isTyping) next.add(event.sender)
            else next.delete(event.sender)
            return next
          })

          if (event.isTyping) {
            const existing = typingTimeoutsRef.current.get(event.sender)
            if (existing) clearTimeout(existing)
            typingTimeoutsRef.current.set(
              event.sender,
              setTimeout(() => {
                setTypingUsers((prev) => {
                  const next = new Set(prev)
                  next.delete(event.sender)
                  return next
                })
                typingTimeoutsRef.current.delete(event.sender)
              }, 3000)
            )
          }
          break
        }

        case 'reaction':
          setMessages((prev) => {
            const newMsgs = prev.map((msg) => {
              if (msg.id !== event.messageId) return msg
              const reactions = { ...msg.reactions }
              const users = reactions[event.emoji] ? [...reactions[event.emoji]] : []
              if (users.includes(event.sender)) {
                reactions[event.emoji] = users.filter((u) => u !== event.sender)
                if (reactions[event.emoji].length === 0) delete reactions[event.emoji]
              } else {
                reactions[event.emoji] = [...users, event.sender]
              }
              return { ...msg, reactions }
            })
            localStorage.setItem(`${STORAGE_KEYS.PEER_MESSAGES}-${roomCode}`, JSON.stringify(newMsgs))
            return newMsgs
          })
          break
      }
    })

    conn.on('close', () => {
      setPeerStatus('disconnected')
    })

    conn.on('error', (err) => {
      console.error('Connection error:', err)
      setPeerStatus('error')
    })
  }, [roomCode])

  // Load chat history if we have an active room
  useEffect(() => {
    if (roomCode && peerStatus === 'connected') {
      const stored = localStorage.getItem(`${STORAGE_KEYS.PEER_MESSAGES}-${roomCode}`)
      if (stored) {
        setMessages(JSON.parse(stored))
      }
    }
  }, [roomCode, peerStatus])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      connectionRef.current?.close()
      peerRef.current?.destroy()
      typingTimeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  // Create a new room
  const createRoom = useCallback(() => {
    setPeerStatus('connecting')
    const code = generateRoomCode()
    const peer = new Peer(code) // Use room code as peer ID for simplicity
    peerRef.current = peer

    peer.on('open', (id) => {
      setRoomCode(id)
      setPeerStatus('idle') // Wait for connection
    })

    peer.on('connection', (conn) => {
      setupConnection(conn)
    })

    peer.on('error', (err) => {
      console.error('Peer error:', err)
      setPeerStatus('error')
    })
  }, [setupConnection])

  // Join an existing room
  const joinRoom = useCallback((code: string) => {
    setPeerStatus('connecting')
    const peer = new Peer()
    peerRef.current = peer

    peer.on('open', () => {
      const conn = peer.connect(code)
      setupConnection(conn)
      setRoomCode(code)
    })

    peer.on('error', (err) => {
      console.error('Peer error:', err)
      setPeerStatus('error')
    })
  }, [setupConnection])

  // Send a message
  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || peerStatus !== 'connected' || !connectionRef.current) return

    const message: ChatMessage = {
      id: generateId(),
      text: text.trim(),
      sender: username,
      timestamp: Date.now(),
      reactions: {}
    }

    // Update local state and storage
    setMessages((prev) => {
      const newMsgs = [...prev, message]
      localStorage.setItem(`${STORAGE_KEYS.PEER_MESSAGES}-${roomCode}`, JSON.stringify(newMsgs))
      return newMsgs
    })

    // Send through PeerJS
    connectionRef.current.send({ type: 'message', message })
  }, [username, peerStatus, roomCode])

  // Send typing indicator
  const sendTyping = useCallback((isTyping: boolean) => {
    if (peerStatus !== 'connected' || !connectionRef.current) return
    connectionRef.current.send({ type: 'typing', sender: username, isTyping })
  }, [username, peerStatus])

  // Toggle reaction
  const addReaction = useCallback((messageId: string, emoji: string) => {
    if (peerStatus !== 'connected' || !connectionRef.current) return

    // Update local state and storage
    setMessages((prev) => {
      const newMsgs = prev.map((msg) => {
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
      localStorage.setItem(`${STORAGE_KEYS.PEER_MESSAGES}-${roomCode}`, JSON.stringify(newMsgs))
      return newMsgs
    })

    // Send through PeerJS
    connectionRef.current.send({ type: 'reaction', messageId, emoji, sender: username })
  }, [username, peerStatus, roomCode])
  
  const clearMessages = useCallback(() => {
    setMessages([])
    if (roomCode) {
      localStorage.removeItem(`${STORAGE_KEYS.PEER_MESSAGES}-${roomCode}`)
    }
  }, [roomCode])

  return {
    messages,
    sendMessage,
    sendTyping,
    addReaction,
    clearMessages,
    typingUsers: Array.from(typingUsers),
    peerStatus,
    roomCode,
    createRoom,
    joinRoom,
  }
}
