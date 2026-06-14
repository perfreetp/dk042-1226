import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import Tag from '@/components/Tag';
import { Profile } from '@/types/profile';
import styles from './index.module.scss';

interface ProfileCardProps {
  profile: Profile;
  onClick?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/profile-detail/index?id=${profile.id}`
      });
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.avatarWrapper}>
        <Image
          className={styles.avatar}
          src={profile.avatar}
          mode="aspectFill"
        />
        {profile.verified && (
          <View className={styles.verifiedBadge}>
            <Text className={styles.verifiedText}>✓</Text>
          </View>
        )}
      </View>
      <View className={styles.info}>
        <View className={styles.nameRow}>
          <Text className={styles.name}>{profile.name}</Text>
          <Text className={styles.city}>{profile.city}</Text>
        </View>
        <View className={styles.sizeRow}>
          <Text className={styles.sizeText}>
            {profile.size.height}cm / {profile.size.weight}kg
          </Text>
          <View className={styles.rating}>
            <Text className={styles.star}>★</Text>
            <Text className={styles.ratingText}>{profile.rating}</Text>
            <Text className={styles.reviewCount}>({profile.reviewCount})</Text>
          </View>
        </View>
        <View className={styles.stylesRow}>
          {profile.styles.slice(0, 4).map((s) => (
            <View key={s} className={styles.styleTag}>
              <Tag text={s} type="primary" size="sm" />
            </View>
          ))}
        </View>
        {profile.works.length > 0 && (
          <View className={styles.worksRow}>
            {profile.works.slice(0, 3).map((work, i) => (
              <Image
                key={i}
                className={styles.workThumb}
                src={work}
                mode="aspectFill"
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default ProfileCard;
