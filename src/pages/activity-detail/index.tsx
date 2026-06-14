import React, { useState } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import Tag from '@/components/Tag';
import { activities, activityTypeTextMap, dynastyTextMap } from '@/data/activities';
import { Activity } from '@/types/activity';
import styles from './index.module.scss';

type RegisterState = 'none' | 'registered' | 'waiting' | 'checkedIn';

const ActivityDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id || '1';
  const activity = activities.find((a: Activity) => a.id === id) || activities[0];
  const [registerState, setRegisterState] = useState<RegisterState>('none');

  const isFull = activity.registeredPeople >= activity.maxPeople;

  const handleRegister = () => {
    if (isFull) {
      Taro.showModal({
        title: '活动名额已满',
        content: '是否加入候补名单？有名额时将优先通知您。',
        confirmText: '加入候补',
        confirmColor: '#D4985A'
      }).then((res) => {
        if (res.confirm) {
          setRegisterState('waiting');
          Taro.showToast({ title: '候补成功', icon: 'success' });
        }
      }).catch(() => {});
    } else {
      Taro.showModal({
        title: '确认报名',
        content: `活动费用：${activity.fee > 0 ? `¥${activity.fee}` : '免费'}，确认报名该活动？`,
        confirmColor: '#8B4557'
      }).then((res) => {
        if (res.confirm) {
          setRegisterState('registered');
          Taro.showToast({ title: '报名成功', icon: 'success' });
        }
      }).catch(() => {});
    }
  };

  const handleCancel = () => {
    Taro.showModal({
      title: '取消报名',
      content: '确认取消该活动的报名？',
      confirmColor: '#C2575A'
    }).then((res) => {
      if (res.confirm) {
        setRegisterState('none');
        Taro.showToast({ title: '已取消报名', icon: 'none' });
      }
    }).catch(() => {});
  };

  const handleCheckIn = () => {
    Taro.showModal({
      title: '活动签到',
      content: '请确认已到达活动现场，签到后将记录您的参与。',
      confirmColor: '#8B4557'
    }).then((res) => {
      if (res.confirm) {
        setRegisterState('checkedIn');
        Taro.showToast({ title: '签到成功', icon: 'success' });
      }
    }).catch(() => {});
  };

  const handleUploadAlbum = () => {
    Taro.showToast({ title: '打开相册上传图片', icon: 'none' });
  };

  const handleContact = () => {
    Taro.showModal({
      title: '主办方联系方式',
      content: activity.organizer.contact,
      showCancel: false
    });
  };

  const renderBottomBar = () => {
    return (
      <View className={styles.bottomBar}>
        <View className={styles.feeInfo}>
          <Text className={styles.feeLabel}>活动费用</Text>
          <Text className={classnames(styles.feeAmount, activity.fee === 0 && styles.free)}>
            {activity.fee > 0 ? `¥${activity.fee}` : '免费'}
          </Text>
          <Text className={styles.peopleInfo}>
            {activity.registeredPeople}/{activity.maxPeople}人
            {activity.waitingPeople > 0 && ` · 候补${activity.waitingPeople}`}
          </Text>
        </View>
        <View className={styles.btnGroup}>
          <Button
            className={classnames(styles.actionBtn, styles.outline)}
            onClick={handleContact}
          >联系主办方</Button>
          {registerState === 'none' && (
            <Button
              className={classnames(styles.actionBtn, isFull ? styles.warning : styles.primary)}
              onClick={handleRegister}
            >{isFull ? '加入候补' : '立即报名'}</Button>
          )}
          {registerState === 'waiting' && (
            <Button
              className={classnames(styles.actionBtn, styles.outline)}
              onClick={handleCancel}
            >取消候补</Button>
          )}
          {registerState === 'registered' && (
            <Button
              className={classnames(styles.actionBtn, styles.success)}
              onClick={handleCheckIn}
            >立即签到</Button>
          )}
          {registerState === 'checkedIn' && (
            <Button
              className={classnames(styles.actionBtn, styles.primary)}
              onClick={handleUploadAlbum}
            >📷 上传相册</Button>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className={styles.page}>
      <Image
        className={styles.coverImage}
        src={activity.coverImage}
        mode="aspectFill"
      />

      <View className={styles.content}>
        <View className={styles.mainCard}>
          <View className={styles.titleRow}>
            <Text className={styles.title}>{activity.title}</Text>
            <View className={styles.typeTag}>
              <Tag text={activityTypeTextMap[activity.type]} type={activity.type as any} size="md" />
            </View>
          </View>
          <View className={styles.tagRow}>
            <Tag text={dynastyTextMap[activity.dynasty]} type="primary" size="sm" />
            {activity.tags.map((t) => (
              <Tag key={t} text={t} type="default" size="sm" />
            ))}
            {activity.fee === 0 && <Tag text="免费" type="success" size="sm" />}
          </View>
        </View>

        <View className={styles.infoSection}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📍</Text>活动信息
          </Text>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>活动地点</Text>
            <Text className={styles.infoValue}>{activity.city} · {activity.location}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>活动时间</Text>
            <Text className={styles.infoValue}>{activity.date}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>集合时间</Text>
            <Text className={styles.infoValue}>{activity.gatherTime}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>活动人数</Text>
            <Text className={styles.infoValue}>
              {activity.maxPeople}人（已报{activity.registeredPeople}人
              {activity.waitingPeople > 0 && `，候补${activity.waitingPeople}人`}）
            </Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>服饰要求</Text>
            <Text className={styles.infoValue}>{activity.dressCode}</Text>
          </View>
        </View>

        <View className={styles.infoSection}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📝</Text>活动介绍
          </Text>
          <Text className={styles.descText}>{activity.description}</Text>
        </View>

        <View className={styles.infoSection}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>👥</Text>主办方
          </Text>
          <View className={styles.organizerCard}>
            <Image
              className={styles.organizerAvatar}
              src={activity.organizer.avatar}
              mode="aspectFill"
            />
            <View className={styles.organizerInfo}>
              <Text className={styles.organizerName}>{activity.organizer.name}</Text>
              <Text className={styles.organizerContact}>点击底部按钮获取联系方式</Text>
            </View>
          </View>
        </View>

        <View className={styles.infoSection}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📸</Text>活动相册
            {activity.album.length > 0 && ` (${activity.album.length})`}
          </Text>
          {activity.album.length > 0 ? (
            <View className={styles.albumGrid}>
              {activity.album.slice(0, 9).map((img, i) => (
                <View key={i} className={styles.albumItem}>
                  <Image className={styles.albumImage} src={img} mode="aspectFill" />
                  {i === 8 && activity.album.length > 9 && (
                    <Text className={styles.albumCount}>+{activity.album.length - 9}</Text>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <Text className={styles.emptyAlbum}>暂无活动相册，参与活动后可上传精彩照片</Text>
          )}
        </View>
      </View>

      {renderBottomBar()}
    </View>
  );
};

export default ActivityDetailPage;
