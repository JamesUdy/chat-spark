export const BROADCAST_CHANNEL_NAME = 'chatspark-room'

export const STORAGE_KEYS = {
  BROADCAST_MESSAGES: 'chatspark-broadcast-messages',
  BROADCAST_USERNAME: 'chatspark-broadcast-username',
  PEER_MESSAGES: 'chatspark-peer-messages',
  PEER_USERNAME: 'chatspark-peer-username',
  PEER_ROOM_CODE: 'chatspark-peer-room-code',
} as const

export const EMOJI_LIST = ['👍', '❤️', '😂', '🔥', '😮', '😢', '🎉', '💯'] as const

export const AVATAR_COLORS = [
  '#818cf8', // indigo
  '#c084fc', // purple
  '#f472b6', // pink
  '#fb7185', // rose
  '#34d399', // emerald
  '#fbbf24', // amber
  '#38bdf8', // sky
  '#f97316', // orange
  '#a78bfa', // violet
  '#2dd4bf', // teal
] as const
