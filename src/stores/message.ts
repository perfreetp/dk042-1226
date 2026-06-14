import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, Conversation } from '@/types/message';

interface MessageState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  sendMessage: (conversationId: string, targetId: string, targetName: string, targetAvatar: string, content: string) => void;
  getOrCreateConversation: (targetId: string, targetName: string, targetAvatar: string) => Conversation;
  getMessages: (conversationId: string) => Message[];
  markAsRead: (conversationId: string) => void;
  getUnreadTotal: () => number;
}

const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    targetId: 'u2',
    targetName: '锦绣·妆娘',
    targetAvatar: 'https://picsum.photos/id/177/200/200',
    lastMessage: '好的，那我们就定在周六上午10点哦',
    lastMessageTime: '2026-06-13 18:42',
    unreadCount: 1
  },
  {
    id: 'conv_2',
    targetId: 'u1',
    targetName: '墨白·摄影师',
    targetAvatar: 'https://picsum.photos/id/64/200/200',
    lastMessage: '请问宋制的话可以拍什么风格呢？',
    lastMessageTime: '2026-06-12 09:15',
    unreadCount: 0
  }
];

const mockMessages: Record<string, Message[]> = {
  'conv_1': [
    {
      id: 'm1',
      conversationId: 'conv_1',
      senderId: 'u2',
      senderName: '锦绣·妆娘',
      senderAvatar: 'https://picsum.photos/id/177/200/200',
      content: '你好呀，请问是想约唐制新娘妆吗？',
      createTime: '2026-06-13 15:30',
      isRead: true
    },
    {
      id: 'm2',
      conversationId: 'conv_1',
      senderId: 'me',
      senderName: '我',
      senderAvatar: 'https://picsum.photos/id/64/200/200',
      content: '是的，下周六婚礼，想做唐制造型',
      createTime: '2026-06-13 16:05',
      isRead: true
    },
    {
      id: 'm3',
      conversationId: 'conv_1',
      senderId: 'u2',
      senderName: '锦绣·妆娘',
      senderAvatar: 'https://picsum.photos/id/177/200/200',
      content: '好的，唐制我很擅长的，可以先发一些参考图给你',
      createTime: '2026-06-13 16:20',
      isRead: true
    },
    {
      id: 'm4',
      conversationId: 'conv_1',
      senderId: 'u2',
      senderName: '锦绣·妆娘',
      senderAvatar: 'https://picsum.photos/id/177/200/200',
      content: '好的，那我们就定在周六上午10点哦',
      createTime: '2026-06-13 18:42',
      isRead: false
    }
  ],
  'conv_2': [
    {
      id: 'm5',
      conversationId: 'conv_2',
      senderId: 'me',
      senderName: '我',
      senderAvatar: 'https://picsum.photos/id/64/200/200',
      content: '请问宋制的话可以拍什么风格呢？',
      createTime: '2026-06-12 09:15',
      isRead: true
    }
  ]
};

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      conversations: mockConversations,
      messages: mockMessages,

      getOrCreateConversation: (targetId: string, targetName: string, targetAvatar: string) => {
        const state = get();
        let conv = state.conversations.find(c => c.targetId === targetId);
        if (!conv) {
          conv = {
            id: `conv_${targetId}`,
            targetId,
            targetName,
            targetAvatar,
            lastMessage: '暂无消息',
            lastMessageTime: new Date().toLocaleString('zh-CN'),
            unreadCount: 0
          };
          set({
            conversations: [conv, ...state.conversations],
            messages: { ...state.messages, [conv.id]: [] }
          });
        }
        return conv;
      },

      sendMessage: (conversationId: string, targetId: string, targetName: string, targetAvatar: string, content: string) => {
        const state = get();
        const now = new Date().toLocaleString('zh-CN');

        const newMessage: Message = {
          id: `m_${Date.now()}`,
          conversationId,
          senderId: 'me',
          senderName: '我',
          senderAvatar: 'https://picsum.photos/id/64/200/200',
          content,
          createTime: now,
          isRead: true
        };

        const convMessages = state.messages[conversationId] || [];
        const updatedMessages = {
          ...state.messages,
          [conversationId]: [...convMessages, newMessage]
        };

        const updatedConversations = state.conversations.map(c => {
          if (c.id === conversationId) {
            return {
              ...c,
              lastMessage: content,
              lastMessageTime: now,
              unreadCount: 0
            };
          }
          return c;
        });

        if (!updatedConversations.find(c => c.id === conversationId)) {
          updatedConversations.unshift({
            id: conversationId,
            targetId,
            targetName,
            targetAvatar,
            lastMessage: content,
            lastMessageTime: now,
            unreadCount: 0
          });
        }

        set({
          messages: updatedMessages,
          conversations: updatedConversations
        });

        setTimeout(() => {
          const s = get();
          const replyTime = new Date().toLocaleString('zh-CN');
          const replies = [
            '好的，收到~',
            '没问题的呀',
            '可以的，我们约个时间吧',
            '嗯嗯，我这边可以的',
            '好呀好呀，期待合作！'
          ];
          const replyContent = replies[Math.floor(Math.random() * replies.length)];

          const replyMessage: Message = {
            id: `m_${Date.now()}_reply`,
            conversationId,
            senderId: targetId,
            senderName: targetName,
            senderAvatar: targetAvatar,
            content: replyContent,
            createTime: replyTime,
            isRead: false
          };

          const currentMsgs = s.messages[conversationId] || [];
          set({
            messages: {
              ...s.messages,
              [conversationId]: [...currentMsgs, replyMessage]
            },
            conversations: s.conversations.map(c =>
              c.id === conversationId
                ? { ...c, lastMessage: replyContent, lastMessageTime: replyTime, unreadCount: c.unreadCount + 1 }
                : c
            )
          });
        }, 1500 + Math.random() * 1000);
      },

      getMessages: (conversationId: string) => {
        return get().messages[conversationId] || [];
      },

      markAsRead: (conversationId: string) => {
        set({
          conversations: get().conversations.map(c =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
          ),
          messages: {
            ...get().messages,
            [conversationId]: (get().messages[conversationId] || []).map(m => ({ ...m, isRead: true }))
          }
        });
      },

      getUnreadTotal: () => {
        return get().conversations.reduce((sum, c) => sum + c.unreadCount, 0);
      }
    }),
    {
      name: 'hanfu-message-storage'
    }
  )
);
