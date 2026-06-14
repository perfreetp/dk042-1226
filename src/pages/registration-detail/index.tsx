import React, { useMemo } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { useActivityStore } from '@/stores/activity';
import { statusTextMap, statusColorMap } from '@/data/activities';
import { MyRegistration, RegisterStatus } from '@/types/activity';
import styles from './index.module.scss';

const RegistrationDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id || '';

  const registrations = useActivityStore(state => state.registrations);
  const cancelRegistration = useActivityStore(state => state.cancelRegistration);
  const checkIn = useActivityStore(state => state.checkIn);
  const uploadAlbum = useActivityStore(state => state.uploadAlbum);

  const reg = useMemo((): MyRegistration | undefined => {
    return registrations.find(r => r.id === id);
  }, [registrations, id]);

  if (!reg) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '200rpx 0', textAlign: 'center' }}>
          <Text style={{ fontSize: '80rpx' }}>🤷</Text>
          <Text style={{ fontSize: '30rpx', color: '#A09383', display: 'block', marginTop: '24rpx' }}>
            报名记录不存在
          </Text>
        </View>
      </View>
    );
  }

  const timeline = useMemo(() => {
    const list: Array<{
      key: string;
      title: string;
      time?: string;
      desc: string;
      status: 'done' | 'current' | 'pending' | 'cancelled';
    }> = [];

    if (reg.status === 'cancelled') {
      list.push({
        key: 'register',
        title: reg.promotedTime ? '候补报名成功' : '活动报名成功',
        time: reg.registerTime,
        desc: reg.promotedTime ? '已从候补队列转正' : '您已成功报名该活动',
        status: 'done'
      });
      if (reg.checkInTime) {
        list.push({
          key: 'checkin',
          title: '活动签到成功',
          time: reg.checkInTime,
          desc: '您已到场签到',
          status: 'done'
        });
      }
      list.push({
        key: 'cancel',
        title: '已取消报名',
        time: reg.cancelTime,
        desc: '您已取消本次报名',
        status: 'cancelled'
      });
      return list;
    }

    if (reg.status === 'waiting') {
      list.push({
        key: 'waiting',
        title: '已加入候补',
        time: reg.registerTime,
        desc: '有名额时将按顺序自动转正',
        status: 'current'
      });
      list.push({
        key: 'register',
        title: '报名成功',
        desc: '等待候补转正',
        status: 'pending'
      });
      list.push({
        key: 'checkin',
        title: '到场签到',
        desc: '活动当天到现场签到',
        status: 'pending'
      });
      list.push({
        key: 'complete',
        title: '活动完成',
        desc: '活动结束后自动完成',
        status: 'pending'
      });
      return list;
    }

    list.push({
      key: 'register',
      title: reg.promotedTime ? '候补转正成功' : '活动报名成功',
      time: reg.promotedTime || reg.registerTime,
      desc: reg.promotedTime ? '已从候补队列自动转正' : '您已成功报名该活动',
      status: 'done'
    });

    if (reg.promotedTime) {
      list.unshift({
        key: 'waiting',
        title: '已加入候补',
        time: reg.registerTime,
        desc: '候补报名登记',
        status: 'done'
      });
    }

    if (reg.status === 'registered') {
      list.push({
        key: 'checkin',
        title: '到场签到',
        desc: '活动当天到现场签到',
        status: 'current'
      });
      list.push({
        key: 'complete',
        title: '活动完成',
        desc: '活动结束后自动完成',
        status: 'pending'
      });
    } else if (reg.status === 'checkedIn') {
      list.push({
        key: 'checkin',
        title: '活动签到成功',
        time: reg.checkInTime,
        desc: '您已到场签到',
        status: 'done'
      });
      list.push({
        key: 'complete',
        title: '活动完成',
        desc: '活动结束后自动完成',
        status: 'current'
      });
    } else if (reg.status === 'completed') {
      list.push({
        key: 'checkin',
        title: '活动签到成功',
        time: reg.checkInTime,
        desc: '您已到场签到',
        status: 'done'
      });
      list.push({
        key: 'complete',
        title: '活动已完成',
        time: dayjs(reg.activity.date + ' ' + reg.activity.gatherTime).format('YYYY-MM-DD HH:mm'),
        desc: '感谢您的参与',
        status: 'done'
      });
    }

    return list;
  }, [reg]);

  const hasAlbum = reg.activity.album && reg.activity.album.length > 0;

  const handleCancel = () => {
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

  const handleCheckIn = () => {
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

  const handleUploadAlbum = () => {
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

  const handleContact = () => {
    Taro.showModal({
      title: '主办方联系方式',
      content: reg.activity.organizer.contact,
      showCancel: false
    });
  };

  const handleOpenActivity = () => {
    Taro.navigateTo({
      url: `/pages/activity-detail/index?id=${reg.activityId}`
    });
  };

  const renderBottomActions = () => {
    if (reg.status === 'cancelled') {
      return (
        <View className={styles.actionRow}>
          <Button className={classnames(styles.actionBtn, styles.outline)} onClick={handleOpenActivity}>
            查看活动
          </Button>
        </View>
      );
    }
    if (reg.status === 'waiting') {
      return (
        <View className={styles.actionRow}>
          <Button className={classnames(styles.actionBtn, styles.outline)} onClick={handleCancel}>
            取消候补
          </Button>
          <Button className={classnames(styles.actionBtn, styles.primary)} onClick={handleOpenActivity}>
            查看活动
          </Button>
        </View>
      );
    }
    if (reg.status === 'registered') {
      return (
        <View className={styles.actionRow}>
          <Button className={classnames(styles.actionBtn, styles.outline)} onClick={handleCancel}>
            取消报名
          </Button>
          <Button className={classnames(styles.actionBtn, styles.primary)} onClick={handleCheckIn}>
            立即签到
          </Button>
        </View>
      );
    }
    if (reg.status === 'checkedIn' || reg.status === 'completed') {
      return (
        <View className={styles.actionRow}>
          <Button className={classnames(styles.actionBtn, styles.outline)} onClick={handleContact}>
            联系主办方
          </Button>
          <Button className={classnames(styles.actionBtn, styles.success)} onClick={handleUploadAlbum}>
            📷 上传相册
          </Button>
        </View>
      );
    }
    return null;
  };

  return (
    <View className={styles.page}>
      <View className={styles.headerCard}>
        <Text className={styles.headerTitle}>{reg.activity.title}</Text>
        <Text className={styles.headerSub}>
          📅 {reg.activity.date} {reg.activity.gatherTime}集合
        </Text>
        <View>
          <View className={styles.statusTag} style={{ backgroundColor: `${statusColorMap[reg.status]}40` }}>
            {statusTextMap[reg.status]}
          </View>
        </View>
      </View>

      <ScrollView scrollY className={styles.content}>
        <View className={styles.infoCard}>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>活动地点</Text>
            <Text className={styles.infoValue}>{reg.activity.city} · {reg.activity.location}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>活动费用</Text>
            <Text className={styles.infoValue}>
              {reg.activity.fee > 0 ? `¥${reg.activity.fee}/人` : '免费活动'}
            </Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>服饰要求</Text>
            <Text className={styles.infoValue}>{reg.activity.dressCode}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>活动人数</Text>
            <Text className={styles.infoValue}>
              {reg.activity.registeredPeople}/{reg.activity.maxPeople}人
              {reg.activity.waitingPeople > 0 && ` · 候补${reg.activity.waitingPeople}人`}
            </Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>主办方</Text>
            <Text className={styles.infoValue}>{reg.activity.organizer.name}</Text>
          </View>
        </View>

        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📊</Text>报名阶段记录
          </Text>
          <View className={styles.timelineList}>
            {timeline.map((t) => (
              <View key={t.key} className={styles.timelineItem}>
                <View className={classnames(styles.timelineDot, styles[t.status])}></View>
                <Text className={styles.timelineTitle}>{t.title}</Text>
                {t.time && <Text className={styles.timelineTime}>{t.time}</Text>}
                <Text className={styles.timelineDesc}>{t.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📸</Text>活动相册
            {hasAlbum && ` (${reg.activity.album.length}张)`}
          </Text>
          {hasAlbum ? (
            <View className={styles.albumGrid}>
              {reg.activity.album.slice(0, 9).map((img, i) => (
                <View key={i} className={styles.albumItem}>
                  <Image className={styles.albumImage} src={img} mode="aspectFill" />
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.emptyAlbum}>
              <Text className={styles.emptyIcon}>🖼️</Text>
              <Text className={styles.emptyText}>暂未上传相册，活动后可分享精彩瞬间</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {renderBottomActions()}
    </View>
  );
};

export default RegistrationDetailPage;
