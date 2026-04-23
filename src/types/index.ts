export interface ChatMessage {
  id: string
  text: string
  sender: string
  timestamp: number
  reactions: Record<string, string[]> // emoji -> array of usernames
}

export interface TypingEvent {
  type: 'typing'
  sender: string
  isTyping: boolean
}

export interface MessageEvent {
  type: 'message'
  message: ChatMessage
}

export interface ReactionEvent {
  type: 'reaction'
  messageId: string
  emoji: string
  sender: string
}

export interface UserJoinEvent {
  type: 'user-join'
  sender: string
}

export interface UserLeaveEvent {
  type: 'user-leave'
  sender: string
}

export interface SyncRequestEvent {
  type: 'sync-request'
  sender: string
}

export interface SyncResponseEvent {
  type: 'sync-response'
  messages: ChatMessage[]
  sender: string
}

export type BroadcastEvent =
  | MessageEvent
  | TypingEvent
  | ReactionEvent
  | UserJoinEvent
  | UserLeaveEvent
  | SyncRequestEvent
  | SyncResponseEvent

export type PeerEvent =
  | MessageEvent
  | TypingEvent
  | ReactionEvent

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'
