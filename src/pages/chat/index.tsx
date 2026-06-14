import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, Image, Input, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidHide, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { useMessageStore } from '@/stores/message';
import { safetyTips } from '@/data/profiles';
import styles from './index.module.scss';

const ChatPage: React.FC = () => {
  const router = useRouter();
  const conversationId = router.params.conversationId || '';
  const targetId = router.params.targetId || '';
  const targetName = decodeURIComponent(router.params.targetName || '对方');
  const targetAvatar = decodeURIComponent(router.params.targetAvatar || 'https://picsum.photos/id/64/200/200');
  const fromPage = router.params.from || '';

  const messages = useMessageStore(state => state.messages);
  const sendMessage = useMessageStore(state => state.sendMessage);
  const getOrCreateConversation = useMessageStore(state => state.getOrCreateConversation);
  const setActiveConversation = useMessageStore(state => state.setActiveConversation);
  const getMessages = useMessageStore(state => state.getMessages);

  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<any>(null);

  const convId = useMemo(() => {
    if (conversationId) return conversationId;
    const conv = getOrCreateConversation(targetId, targetName, targetAvatar);
    return conv.id;
  }, [conversationId, targetId, targetName, targetAvatar, getOrCreateConversation]);

  const msgList = useMemo(() => {
    return getMessages(convId);
  }, [messages, convId, getMessages]);

  useDidShow(() => {
    setActiveConversation(convId);
    Taro.setNavigationBarTitle({ title: targetName });
  });

  useDidHide(() => {
    setActiveConversation(null);
  });

  useEffect(() => {
    setActiveConversation(convId);
    Taro.setNavigationBarTitle({ title: targetName });
    return () => {
      setActiveConversation(null);
    };
  }, [targetName, convId, setActiveConversation]);

  const handleBack = () => {
    if (fromPage === 'profile') {
      Taro.redirectTo({ url: '/pages/messages/index' });
    } else {
      Taro.navigateBack({ delta: 1 });
    }
  };

  useEffect(() => {
    if (fromPage === 'profile') {
      // @ts-ignore
      Taro.eventCenter && Taro.eventCenter.on && Taro.eventCenter.once('__taroNavigateBackInterceptor__', () => {
        Taro.redirectTo({ url: '/pages/messages/index' });
      });
    }
  }, [fromPage]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(convId, targetId, targetName, targetAvatar, inputText.trim());
    setInputText('');
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollToOffset && scrollRef.current.scrollToOffset({
          offset: 99999,
          animated: true
        });
      }
    }, 300);
  };

  const handleQuickReply = (text: string) => {
    setInputText(text);
  };

  const quickReplies = ['你好呀~', '请问还可以约吗？', '想约拍一套汉服', '方便加个微信吗？'];

  return (
    <View className={styles.page}>
      <View className={styles.safetyBanner}>
        <Text className={styles.safetyIcon}>⚠️</Text>
        <Text className={styles.safetyText}>
          文明交流，谨防诈骗。涉及线下见面请选择公共场所，保护好个人安全与隐私。
        </Text>
      </View>

      <ScrollView
        className={styles.msgList}
        scrollY
        ref={scrollRef}
        scrollWithAnimation
        scrollTop={99999}
      >
        {msgList.length > 0 ? (
          msgList.map((msg) => {
            const isMe = msg.senderId === 'me';
            return (
              <View
                key={msg.id}
                className={classnames(styles.msgItem, isMe ? styles.me : styles.other)}
              >
                {!isMe && (
                  <Image className={styles.msgAvatar} src={msg.senderAvatar} mode="aspectFill" />
                )}
                <View className={styles.msgContent}>
                  <View className={classnames(styles.msgBubble, isMe ? styles.bubbleMe : styles.bubbleOther)}>
                    <Text className={styles.msgText}>{msg.content}</Text>
                  </View>
                  <Text className={styles.msgTime}>{msg.createTime}</Text>
                </View>
                {isMe && (
                  <Image
                    className={styles.msgAvatar}
                    src="https://picsum.photos/id/64/200/200"
                    mode="aspectFill"
                  />
                )}
              </View>
            );
          })
        ) : (
          <View className={styles.welcomeBox}>
            <Text className={styles.welcomeText}>和「{targetName}」打个招呼吧~</Text>
            <View className={styles.quickReplyRow}>
              {quickReplies.map((text) => (
                <View
                  key={text}
                  className={styles.quickItem}
                  onClick={() => handleQuickReply(text)}
                >
                  <Text className={styles.quickText}>{text}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View className={styles.inputBar}>
        <Input
          className={styles.input}
          placeholder="说点什么..."
          value={inputText}
          onInput={(e) => setInputText(e.detail.value)}
          onConfirm={handleSend}
          maxlength={200}
        />
        <Button
          className={classnames(styles.sendBtn, !inputText.trim() && styles.disabled)}
          onClick={handleSend}
        >发送</Button>
      </View>
    </View>
  );
};

export default ChatPage;
