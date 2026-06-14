import React, { useState, useMemo } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { useActivityStore } from '@/stores/activity';
import { statusTextMap, statusColorMap, activityTypeTextMap } from '@/data/activities';
import { RegisterStatus, MyRegistration } from '@/types/activity';
import Tag from '@/components/Tag';
import styles from './index.module.scss';

const tabs = [
  { value: 'all', label: '全部' },
  { value: 'registered', label: '已报名' },
  { value: 'waiting', label: '候补' },
  { value: 'checkedIn', label: '已签到' },
  { value: 'cancelled', label: '已取消' }
];

const MyActivitiesPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('all');
  const registrations = useActivityStore(state => state.registrations);
  const cancelRegistration = useActivityStore(state => state.cancelRegistration);
  const checkIn = useActivityStore(state => state.checkIn);
  const uploadAlbum = useActivityStore(state => state.uploadAlbum);

  const validRegs = useMemo(() => {
    if (currentTab === 'all') return registrations;
    return registrations.filter(r => r.status === currentTab);
  }, [registrations, currentTab]);

  const stats = useMemo(() => {
    return {
      total: registrations.filter(r => r.status !== 'cancelled').length,
      registered: registrations.filter(r => r.status === 'registered').length,
      waiting: registrations.filter(r => r.status === 'waiting').length,
      completed: registrations.filter(r => r.status === 'completed' || r.status === 'checkedIn').length
    };
  }, [registrations]);

  const handleCardClick = (reg: MyRegistration) => {
    Taro.navigateTo({
      url: `/pages/activity-detail/index?id=${reg.activityId}`
    });
  };

  const handleCancel = (e, reg: MyRegistration) => {
    e.stopPropagation();
    Taro.showModal({
      title: '取消报名',
      content: '确认取消报名该活动？',
      confirmColor: '#C2575A'
    }).then((res) => {
      if (res.confirm) {
        const result = cancelRegistration(reg.id);
        Taro.showToast({ title: result.message, icon: 'none' });
      }
    }).catch(() => {});
  };

  const handleCheckIn = (e, reg: MyRegistration) => {
    e.stopPropagation();
    Taro.showModal({
      title: '活动签到',
      content: '请确认已到达活动现场，签到后将记录您的参与。',
      confirmColor: '#8B4557'
    }).then((res) => {
      if (res.confirm) {
        const result = checkIn(reg.id);
        Taro.showToast({ title: result.message, icon: result.success ? 'success' : 'none' });
      }
    }).catch(() => {});
  };

  const handleUploadAlbum = (e, reg: MyRegistration) => {
    e.stopPropagation();
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        if (tempFilePaths && tempFilePaths.length > 0) {
          const result = uploadAlbum(reg.activityId, tempFilePaths[0]);
          Taro.showToast({ title: result.message, icon: result.success ? 'success' : 'none' });
        }
      },
      fail: () => {
        const mockImage = `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 250}/400/400`;
        const result = uploadAlbum(reg.activityId, mockImage);
        Taro.showToast({ title: result.message, icon: result.success ? 'success' : 'none' });
      }
    });
  };

  const handleContact = (e, reg: MyRegistration) => {
    e.stopPropagation();
    Taro.showModal({
      title: '主办方联系方式',
      content: reg.activity.organizer.contact,
      showCancel: false
    });
  };

  const renderActions = (reg: MyRegistration) => {
    switch (reg.status) {
      case 'registered':
        return (
          <View className={styles.btnGroup}>
            <Button
              className={classnames(styles.actionBtn, styles.outline)}
              onClick={(e) => handleCancel(e, reg)}
            >取消报名</Button>
            <Button
              className={classnames(styles.actionBtn, styles.primary)}
              onClick={(e) => handleCheckIn(e, reg)}
            >立即签到</Button>
          </View>
        );
      case 'waiting':
        return (
          <Button
            className={classnames(styles.actionBtn, styles.outline)}
            onClick={(e) => handleCancel(e, reg)}
          >取消候补</Button>
        );
      case 'checkedIn':
      case 'completed':
        return (
          <View className={styles.btnGroup}>
            <Button
              className={classnames(styles.actionBtn, styles.outline)}
              onClick={(e) => handleContact(e, reg)}
            >联系主办方</Button>
            <Button
              className={classnames(styles.actionBtn, styles.success)}
              onClick={(e) => handleUploadAlbum(e, reg)}
            >📷 上传相册</Button>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.total}</Text>
            <Text className={styles.statLabel}>总报名</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.registered}</Text>
            <Text className={styles.statLabel}>已报名</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.waiting}</Text>
            <Text className={styles.statLabel}>候补中</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.completed}</Text>
            <Text className={styles.statLabel}>已参与</Text>
          </View>
        </View>

        <View className={styles.tabBar}>
          {tabs.map((t) => (
            <View
              key={t.value}
              className={classnames(styles.tabItem, currentTab === t.value && styles.active)}
              onClick={() => setCurrentTab(t.value)}
            >
              <Text className={styles.tabText}>{t.label}</Text>
            </View>
          ))}
        </View>

        <View className={styles.listWrapper}>
          {validRegs.length > 0 ? (
            validRegs.map((reg) => (
              <View
                key={reg.id}
                className={styles.regCard}
                onClick={() => handleCardClick(reg)}
              >
                <View className={styles.cardCover}>
                  <Image
                    className={styles.coverImage}
                    src={reg.activity.coverImage}
                    mode="aspectFill"
                  />
                  <View className={styles.typeTag}>
                    <Tag text={activityTypeTextMap[reg.activity.type]} type={reg.activity.type as any} size="sm" />
                  </View>
                </View>
                <View className={styles.cardContent}>
                  <View className={styles.cardTop}>
                    <Text className={styles.title}>{reg.activity.title}</Text>
                    <View
                      className={styles.statusBadge}
                      style={{ backgroundColor: `${statusColorMap[reg.status]}20` }}
                    >
                      <Text
                        className={styles.statusText}
                        style={{ color: statusColorMap[reg.status] }}
                      >
                        {statusTextMap[reg.status]}
                      </Text>
                    </View>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoText}>📍 {reg.activity.city} · {reg.activity.location}</Text>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoText}>📅 {reg.activity.date} {reg.activity.gatherTime}集合</Text>
                  </View>
                  <View className={styles.infoRow}>
                    <Text className={styles.infoText}>
                      💰 {reg.activity.fee > 0 ? `¥${reg.activity.fee}/人` : '免费活动'}
                    </Text>
                  </View>
                  <View className={styles.cardBottom}>
                    <Text className={styles.regTime}>报名时间：{reg.registerTime}</Text>
                    {renderActions(reg)}
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={{ padding: '80rpx 0', textAlign: 'center' }}>
              <Text style={{ fontSize: '28rpx', color: '#A09383' }}>暂无相关报名记录</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default MyActivitiesPage;
