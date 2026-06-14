import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import Tag from '@/components/Tag';
import { Activity } from '@/types/activity';
import { activityTypeTextMap, dynastyTextMap } from '@/data/activities';
import styles from './index.module.scss';

interface ActivityCardProps {
  activity: Activity;
  onClick?: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/activity-detail/index?id=${activity.id}`
      });
    }
  };

  const progress = Math.min(100, Math.round((activity.registeredPeople / activity.maxPeople) * 100));
  const isFull = activity.registeredPeople >= activity.maxPeople;

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.coverWrapper}>
        <Image
          className={styles.cover}
          src={activity.coverImage}
          mode="aspectFill"
        />
        <View className={styles.typeTag}>
          <Tag
            text={activityTypeTextMap[activity.type]}
            type={activity.type as any}
            size="sm"
          />
        </View>
        {activity.fee === 0 && (
          <View className={styles.freeTag}>
            <Text className={styles.freeText}>免费</Text>
          </View>
        )}
      </View>
      <View className={styles.content}>
        <Text className={styles.title}>{activity.title}</Text>
        <View className={styles.metaRow}>
          <Text className={styles.metaText}>📍 {activity.city} · {activity.location}</Text>
        </View>
        <View className={styles.metaRow}>
          <Text className={styles.metaText}>📅 {activity.date} {activity.gatherTime}集合</Text>
        </View>
        <View className={styles.metaRow}>
          <View className={styles.dynastyTag}>
            <Tag text={dynastyTextMap[activity.dynasty]} type="primary" size="sm" />
          </View>
          {activity.tags.slice(0, 2).map((tag) => (
            <View key={tag} className={styles.dynastyTag}>
              <Tag text={tag} type="default" size="sm" />
            </View>
          ))}
        </View>
        <View className={styles.bottomRow}>
          <View className={styles.progressWrapper}>
            <View className={styles.progressBar}>
              <View
                className={classnames(styles.progressFill, isFull && styles.full)}
                style={{ width: `${progress}%` }}
              ></View>
            </View>
            <Text className={styles.progressText}>
              {activity.registeredPeople}/{activity.maxPeople}人
              {activity.waitingPeople > 0 && ` · 候补${activity.waitingPeople}`}
            </Text>
          </View>
          <View className={styles.feeWrapper}>
            {activity.fee > 0 ? (
              <Text className={styles.feeText}>¥{activity.fee}</Text>
            ) : (
              <Text className={styles.feeFree}>免费</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ActivityCard;
