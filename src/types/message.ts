export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  createTime: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  targetId: string;
  targetName: string;
  targetAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}
