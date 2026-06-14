import React, { useState, useMemo } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { myRegistrations, statusTextMap, statusColorMap } from '@/data/activities';
import { RegisterStatus, MyRegistration } from '@/types/activity';
import styles from './index.module.scss';

const tabs = [
  { value: 'all', label: '全部' },
  { value: 'registered', label: '已报名' },
  { value: 'waiting', label: '候补' },
  { value: 'checkedIn', label: '已签到' },
  { value: 'completed', label: '已完成' }
];

const MyActivitiesPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('all');

  const filteredRegs = useMemo(() => {
    return myRegistrations.filter((r: MyRegistration) => {
      return currentTab === 'all' || r.status === currentTab;
    });
  }, [currentTab]);

  const stats = useMemo(() => {
    return {
      total: myRegistrations.length,
      registered: myRegistrations.filter((r) => r.status === 'registered').length,
      waiting: myRegistrations.filter((r) => r.status === 'waiting').length,
      completed: myRegistrations.filter((r) => r.status === 'completed' || r.status === 'checkedIn').length
    };
  }, []);

  const handleCardClick = (reg: MyRegistration) => {
    Taro.navigateTo({
      url: `/pages/activity-detail/index?id=${reg.activityId}`
    });
  };

  const handleAction = (action: string, reg: MyRegistration) => {
    const actionMap: Record<string, string> = {
      cancel: '确认取消报名该活动？',
      checkIn: '确认签到？请确保已到达活动现场',
      upload: '打开相册选择图片上传',
      contact: '联系主办方：' + reg.activity.organizer.contact
    };

    if (action === 'cancel') {
      Taro.showModal({
        title: '取消报名',
        content: actionMap[action],
        confirmColor: '#C2575A'
      }).then((res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已取消报名', icon: 'success' });
        }
      }).catch(() => {});
    } else if (action === 'contact') {
      Taro.showModal({
        title: '联系方式',
        content: actionMap[action],
        showCancel: false
      });
    } else {
      Taro.showToast({ title: actionMap[action] || '操作成功', icon: 'none' });
    }
  };

  const renderActions = (reg: MyRegistration) => {
    switch (reg.status) {
      case 'registered':
        return (
          <View className={styles.btnGroup}>
            <Button
              className={classnames(styles.actionBtn, styles.outline)}
              onClick={(e) => { e.stopPropagation(); handleAction('cancel', reg); }}
            >取消报名</Button>
            <Button
              className={classnames(styles.actionBtn, styles.primary)}
              onClick={(e) => { e.stopPropagation(); handleAction('checkIn', reg); }}
            >立即签到</Button>
          </View>
        );
      case 'waiting':
        return (
          <Button
            className={classnames(styles.actionBtn, styles.outline)}
            onClick={(e) => { e.stopPropagation(); handleAction('cancel', reg); }}
          >取消候补</Button>
        );
      case 'checkedIn':
      case 'completed':
        return (
          <Button
            className={classnames(styles.actionBtn, styles.success)}
            onClick={(e) => { e.stopPropagation(); handleAction('upload', reg); }}
          >📷 上传相册</Button>
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
          {filteredRegs.length > 0 ? (
            filteredRegs.map((reg) => (
              <View
                key={reg.id}
                className={styles.regCard}
                onClick={() => handleCardClick(reg)}
              >
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
