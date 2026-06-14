import React, { useState, useMemo } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { useActivityStore } from '@/stores/activity';
import { statusTextMap, statusColorMap, activityTypeTextMap } from '@/data/activities';
import { RegisterStatus, MyRegistration } from '@/types/activity';
import Tag from '@/components/Tag';
import styles from './index.module.scss';

const viewTabs = [
  { value: 'status', label: '按状态', icon: '📊' },
  { value: 'time', label: '按时间', icon: '📅' }
];

const statusTabs = [
  { value: 'all', label: '全部', icon: '📋' },
  { value: 'registered', label: '已报名', icon: '✅' },
  { value: 'waiting', label: '候补', icon: '⏳' },
  { value: 'checkedIn', label: '已签到', icon: '📍' },
  { value: 'completed', label: '已完成', icon: '🏆' },
  { value: 'cancelled', label: '已取消', icon: '❌' }
];

const timeGroups = [
  { key: 'upcoming', label: '近期活动', icon: '🌟', desc: '即将开始或正在进行' },
  { key: 'past', label: '已结束活动', icon: '📚', desc: '活动已完成归档' },
  { key: 'cancelled', label: '已取消记录', icon: '🗑️', desc: '您取消过的报名' }
];

const stageInfo = {
  waiting: { step: 0, label: '候补队列', desc: '有名额时将按顺序转正' },
  registered: { step: 1, label: '报名成功', desc: '请按时到达活动现场' },
  checkedIn: { step: 2, label: '已到场', desc: '活动结束后可上传相册' },
  completed: { step: 3, label: '已完成', desc: '感谢您的参与' },
  cancelled: { step: -1, label: '已取消', desc: '期待下次相遇' }
};

const MyActivitiesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'status' | 'time'>('status');
  const [currentTab, setCurrentTab] = useState('all');
  const registrations = useActivityStore(state => state.registrations);
  const cancelRegistration = useActivityStore(state => state.cancelRegistration);
  const checkIn = useActivityStore(state => state.checkIn);
  const uploadAlbum = useActivityStore(state => state.uploadAlbum);
  const archiveCompleted = useActivityStore(state => state.archiveCompleted);

  useDidShow(() => {
    archiveCompleted();
  });

  const today = dayjs();

  const groupedByTime = useMemo(() => {
    const groups: Record<string, MyRegistration[]> = {
      upcoming: [],
      past: [],
      cancelled: []
    };
    registrations.forEach(reg => {
      if (reg.status === 'cancelled') {
        groups.cancelled.push(reg);
      } else {
        const activityDate = dayjs(reg.activity.date + ' ' + reg.activity.gatherTime);
        if (activityDate.isAfter(today, 'minute')) {
          groups.upcoming.push(reg);
        } else {
          groups.past.push(reg);
        }
      }
    });
    groups.upcoming.sort((a, b) => a.registerTime.localeCompare(b.registerTime));
    groups.past.sort((a, b) => b.registerTime.localeCompare(a.registerTime));
    groups.cancelled.sort((a, b) => b.registerTime.localeCompare(a.registerTime));
    return groups;
  }, [registrations, today]);

  const statusValidRegs = useMemo(() => {
    const filtered = currentTab === 'all' ? registrations : registrations.filter(r => r.status === currentTab);
    return [...filtered].sort((a, b) => b.registerTime.localeCompare(a.registerTime));
  }, [registrations, currentTab]);

  const stats = useMemo(() => {
    return {
      total: registrations.filter(r => r.status !== 'cancelled').length,
      registered: registrations.filter(r => r.status === 'registered').length,
      waiting: registrations.filter(r => r.status === 'waiting').length,
      checkedIn: registrations.filter(r => r.status === 'checkedIn').length,
      completed: registrations.filter(r => r.status === 'completed').length
    };
  }, [registrations]);

  const handleCardClick = (reg: MyRegistration) => {
    Taro.navigateTo({
      url: `/pages/registration-detail/index?id=${reg.id}`
    });
  };

  const handleCancel = (e, reg: MyRegistration) => {
    e.stopPropagation();
    Taro.showModal({
      title: '取消报名',
      content: reg.status === 'waiting'
        ? '确认取消候补？'
        : '确认取消报名该活动？取消后候补用户将自动转正。',
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
    const today = dayjs();
    const activityDate = dayjs(reg.activity.date);
    if (activityDate.isAfter(today, 'day')) {
      Taro.showToast({ title: '活动尚未开始，无法签到', icon: 'none' });
      return;
    }
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
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        if (tempFilePaths && tempFilePaths.length > 0) {
          let done = 0;
          tempFilePaths.forEach((img, idx) => {
            setTimeout(() => {
              uploadAlbum(reg.activityId, img);
              done++;
              if (done === tempFilePaths.length) {
                Taro.showToast({ title: `成功上传${tempFilePaths.length}张`, icon: 'success' });
              }
            }, idx * 200);
          });
        }
      },
      fail: () => {
        const mockImages = Array.from(
          { length: 3 },
          (_, i) => `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 250 + i}/400/400`
        );
        mockImages.forEach((img, idx) => {
          setTimeout(() => uploadAlbum(reg.activityId, img), idx * 150);
        });
        Taro.showToast({ title: '成功上传3张', icon: 'success' });
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

  const renderStage = (reg: MyRegistration) => {
    const stage = stageInfo[reg.status] || stageInfo.registered;
    if (reg.status === 'cancelled') {
      return (
        <View className={styles.stageCancelled}>
          <Text className={styles.stageCancelledIcon}>❌</Text>
          <View>
            <Text className={styles.stageCancelledLabel}>已取消</Text>
            <Text className={styles.stageCancelledDesc}>{stage.desc}</Text>
          </View>
        </View>
      );
    }

    const steps = ['候补', '报名', '签到', '完成'];
    const currentStep = stage.step;
    const waitingPosition = currentStep === 0;

    return (
      <View className={styles.stageWrapper}>
        <View className={styles.stageTimeline}>
          {steps.map((step, i) => {
            let stepStatus = 'pending';
            if (waitingPosition) {
              stepStatus = i === 0 ? 'current' : 'pending';
            } else {
              if (i < currentStep) stepStatus = 'done';
              else if (i === currentStep) stepStatus = 'current';
              else stepStatus = 'pending';
            }
            return (
              <View key={step} className={styles.stageStep}>
                <View className={classnames(styles.stageDot, styles[stepStatus])}></View>
                <Text className={classnames(styles.stageStepText, styles[`text-${stepStatus}`])}>{step}</Text>
                {i < steps.length - 1 && (
                  <View className={classnames(styles.stageLine, stepStatus === 'done' ? styles.lineDone : styles.linePending)}></View>
                )}
              </View>
            );
          })}
        </View>
        <View className={styles.stageCurrentInfo}>
          <View className={styles.stageCurrentTag} style={{ backgroundColor: `${statusColorMap[reg.status]}20`, borderColor: statusColorMap[reg.status] }}>
            <Text className={styles.stageCurrentText} style={{ color: statusColorMap[reg.status] }}>
              当前阶段：{stage.label}
            </Text>
          </View>
          <Text className={styles.stageCurrentDesc}>{stage.desc}</Text>
        </View>
      </View>
    );
  };

  const renderActions = (reg: MyRegistration) => {
    switch (reg.status) {
      case 'registered':
        return (
          <View className={styles.btnGroup}>
            <Button
              className={classnames(styles.actionBtn, styles.outline, styles.danger)}
              onClick={(e) => handleCancel(e, reg)}
            >取消报名</Button>
            <Button
              className={classnames(styles.actionBtn, styles.primary)}
              onClick={(e) => handleCheckIn(e, reg)}
            >立即签到</Button>
          </View>
        );
      case 'waiting': {
        const waitingList = registrations
          .filter(r => r.activityId === reg.activityId && r.status === 'waiting')
          .sort((a, b) => a.registerTime.localeCompare(b.registerTime));
        const myPos = waitingList.findIndex(r => r.id === reg.id) + 1;
        return (
          <View style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ fontSize: '24rpx', color: '#D4985A' }}>
              📌 候补第 {myPos} 位
            </View>
            <Button
              className={classnames(styles.actionBtn, styles.outline, styles.danger)}
              onClick={(e) => handleCancel(e, reg)}
            >取消候补</Button>
          </View>
        );
      }
      case 'checkedIn':
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
            <View style={classnames(styles.statBadge, stats.registered > 0 && styles.badgeActive)}>
              <Text className={styles.statNum}>{stats.registered}</Text>
            </View>
            <Text className={styles.statLabel}>已报名</Text>
          </View>
          <View className={styles.statItem}>
            <View style={classnames(styles.statBadge, stats.waiting > 0 && styles.badgeWait)}>
              <Text className={styles.statNum}>{stats.waiting}</Text>
            </View>
            <Text className={styles.statLabel}>候补中</Text>
          </View>
          <View className={styles.statItem}>
            <View style={classnames(styles.statBadge, stats.checkedIn > 0 && styles.badgeCheck)}>
              <Text className={styles.statNum}>{stats.checkedIn}</Text>
            </View>
            <Text className={styles.statLabel}>已签到</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.completed}</Text>
            <Text className={styles.statLabel}>已完成</Text>
          </View>
        </View>

        <View className={styles.viewTabs}>
          {viewTabs.map((t) => (
            <View
              key={t.value}
              className={classnames(styles.viewTabItem, viewMode === t.value && styles.viewActive)}
              onClick={() => setViewMode(t.value as any)}
            >
              <Text className={styles.viewTabIcon}>{t.icon}</Text>
              <Text className={styles.viewTabText}>{t.label}</Text>
            </View>
          ))}
        </View>

        {viewMode === 'status' && (
          <View className={styles.tabBar}>
            {statusTabs.map((t) => (
              <View
                key={t.value}
                className={classnames(styles.tabItem, currentTab === t.value && styles.active)}
                onClick={() => setCurrentTab(t.value)}
              >
                <Text className={styles.tabIcon}>{t.icon}</Text>
                <Text className={styles.tabText}>{t.label}</Text>
              </View>
            ))}
          </View>
        )}

        <View className={styles.listWrapper}>
          {viewMode === 'status' ? (
            statusValidRegs.length > 0 ? (
              statusValidRegs.map((reg) => (
                <View
                  key={reg.id}
                  className={classnames(styles.regCard, reg.status === 'cancelled' && styles.cardCancelled)}
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
                    <View
                      className={styles.statusBadgeBig}
                      style={{ backgroundColor: `${statusColorMap[reg.status]}30` }}
                    >
                      <Text
                        className={styles.statusTextBig}
                        style={{ color: statusColorMap[reg.status] }}
                      >
                        {statusTextMap[reg.status]}
                      </Text>
                    </View>
                  </View>

                  <View className={styles.cardContent}>
                    <View className={styles.cardTop}>
                      <Text className={styles.title}>{reg.activity.title}</Text>
                    </View>

                    {renderStage(reg)}

                    <View className={styles.infoRow}>
                      <Text className={styles.infoText}>📍 {reg.activity.city} · {reg.activity.location}</Text>
                    </View>
                    <View className={styles.infoRow}>
                      <Text className={styles.infoText}>📅 {reg.activity.date} {reg.activity.gatherTime}集合</Text>
                    </View>
                    <View className={styles.infoRow}>
                      <Text className={styles.infoText}>
                        💰 {reg.activity.fee > 0 ? `¥${reg.activity.fee}/人` : '免费活动'}
                        {'  · 👥 '}{reg.activity.registeredPeople}/{reg.activity.maxPeople}人
                        {reg.activity.waitingPeople > 0 && ` · ⏳候补${reg.activity.waitingPeople}`}
                      </Text>
                    </View>
                    <View className={styles.infoRow}>
                      <Text className={styles.infoText}>
                        👗 服饰要求：{reg.activity.dressCode}
                      </Text>
                    </View>

                    <View className={styles.timeRow}>
                      <Text className={styles.regTime}>报名时间：{reg.registerTime}</Text>
                      {reg.checkInTime && (
                        <Text className={styles.checkInTime}>✓ 签到于 {reg.checkInTime}</Text>
                      )}
                    </View>

                    {renderActions(reg)}
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.emptyBox}>
                <Text className={styles.emptyIcon}>📭</Text>
                <Text className={styles.emptyTitle}>
                  暂无{currentTab === 'all' ? '' : statusTabs.find(t => t.value === currentTab)?.label}报名记录
                </Text>
                <Text className={styles.emptyDesc}>去首页发现更多精彩活动吧~</Text>
              </View>
            )
          ) : (
            timeGroups.map((group) => {
              const list = groupedByTime[group.key] || [];
              return (
                <View key={group.key} className={styles.timeGroupBlock}>
                  <View className={styles.timeGroupHeader}>
                    <Text className={styles.timeGroupIcon}>{group.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text className={styles.timeGroupTitle}>{group.label}</Text>
                      <Text className={styles.timeGroupDesc}>{group.desc}</Text>
                    </View>
                    <View className={styles.timeGroupCount}>
                      <Text className={styles.timeGroupCountText}>{list.length}</Text>
                    </View>
                  </View>

                  {list.length > 0 ? (
                    list.map((reg) => (
                      <View
                        key={reg.id}
                        className={classnames(styles.regCard, reg.status === 'cancelled' && styles.cardCancelled)}
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
                          <View
                            className={styles.statusBadgeBig}
                            style={{ backgroundColor: `${statusColorMap[reg.status]}30` }}
                          >
                            <Text
                              className={styles.statusTextBig}
                              style={{ color: statusColorMap[reg.status] }}
                            >
                              {statusTextMap[reg.status]}
                            </Text>
                          </View>
                        </View>

                        <View className={styles.cardContent}>
                          <View className={styles.cardTop}>
                            <Text className={styles.title}>{reg.activity.title}</Text>
                          </View>

                          {renderStage(reg)}

                          <View className={styles.infoRow}>
                            <Text className={styles.infoText}>📍 {reg.activity.city} · {reg.activity.location}</Text>
                          </View>
                          <View className={styles.infoRow}>
                            <Text className={styles.infoText}>📅 {reg.activity.date} {reg.activity.gatherTime}集合</Text>
                          </View>
                          <View className={styles.timeRow}>
                            <Text className={styles.regTime}>报名时间：{reg.registerTime}</Text>
                            {reg.checkInTime && (
                              <Text className={styles.checkInTime}>✓ 签到于 {reg.checkInTime}</Text>
                            )}
                          </View>
                        </View>
                      </View>
                    ))
                  ) : (
                    <View className={styles.emptyGroup}>
                      <Text className={styles.emptyGroupText}>暂无记录</Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </View>
    </View>
  );
};

export default MyActivitiesPage;
