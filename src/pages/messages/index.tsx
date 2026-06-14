import React, { useMemo, useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { useMessageStore } from '@/stores/message';
import { safetyTips } from '@/data/profiles';
import styles from './index.module.scss';

const MessagesPage: React.FC = () => {
  const [, forceRefresh] = useState(0);
  const conversations = useMessageStore(state => state.conversations);
  const getUnreadTotal = useMessageStore(state => state.getUnreadTotal);
  const markAsRead = useMessageStore(state => state.markAsRead);

  useDidShow(() => {
    forceRefresh(n => n + 1);
  });

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => b.lastMessageTime.localeCompare(a.lastMessageTime));
  }, [conversations]);

  const unreadTotal = useMemo(() => getUnreadTotal(), [conversations, getUnreadTotal]);

  const handleConversationClick = (conv) => {
    markAsRead(conv.id);
    Taro.navigateTo({
      url: `/pages/chat/index?conversationId=${conv.id}&targetId=${conv.targetId}&targetName=${encodeURIComponent(conv.targetName)}&targetAvatar=${encodeURIComponent(conv.targetAvatar)}`
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.safetyCard}>
          <Text className={styles.safetyTitle}>🛡️ 聊天安全提醒</Text>
          <Text className={styles.safetyText}>
            {safetyTips[1]} 保护好个人隐私和财产安全。
          </Text>
        </View>

        {sortedConversations.length > 0 ? (
          <View className={styles.convList}>
            {sortedConversations.map((conv) => (
              <View
                key={conv.id}
                className={styles.convItem}
                onClick={() => handleConversationClick(conv)}
              >
                <View className={styles.avatarWrapper}>
                  <Image
                    className={styles.avatar}
                    src={conv.targetAvatar}
                    mode="aspectFill"
                  />
                  {conv.unreadCount > 0 && (
                    <View className={styles.unreadBadge}>
                      <Text className={styles.unreadText}>
                        {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
                <View className={styles.convInfo}>
                  <View className={styles.convTop}>
                    <Text className={classnames(styles.convName, conv.unreadCount > 0 && styles.unread)}>
                      {conv.targetName}
                    </Text>
                    <Text className={styles.convTime}>{conv.lastMessageTime}</Text>
                  </View>
                  <Text className={classnames(styles.convLastMsg, conv.unreadCount > 0 && styles.unread)}>
                    {conv.lastMessage}
                  </Text>
                </View>
                {conv.unreadCount > 0 && <View className={styles.unreadDot}></View>}
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyBox}>
            <Text className={styles.emptyIcon}>💬</Text>
            <Text className={styles.emptyText}>暂无消息</Text>
            <Text className={styles.emptyDesc}>去同袍名片找找志同道合的小伙伴吧~</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MessagesPage;
