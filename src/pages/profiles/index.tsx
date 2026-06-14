import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import ProfileCard from '@/components/ProfileCard';
import FilterBar from '@/components/FilterBar';
import { profiles } from '@/data/profiles';
import { cities } from '@/data/activities';
import { Profile } from '@/types/profile';
import { safetyTips } from '@/data/profiles';
import styles from './index.module.scss';

const styleOptions = [
  { value: 'all', label: '全部风格' },
  { value: '唐制', label: '唐制' },
  { value: '宋制', label: '宋制' },
  { value: '明制', label: '明制' },
  { value: '魏晋', label: '魏晋' },
  { value: '汉元素', label: '汉元素' }
];

const ProfilesPage: React.FC = () => {
  const [currentCity, setCurrentCity] = useState('全部');
  const [currentStyle, setCurrentStyle] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const filteredProfiles = useMemo(() => {
    let list = profiles.filter((p: Profile) => {
      const cityMatch = currentCity === '全部' || p.city === currentCity;
      const styleMatch = currentStyle === 'all' || p.styles.includes(currentStyle);
      return cityMatch && styleMatch;
    });

    if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviewCount') {
      list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return list;
  }, [currentCity, currentStyle, sortBy]);

  const cityOptions = cities.map((c) => ({ value: c, label: c }));

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.safetyBanner}>
          <View className={styles.safetyBannerTop}>
            <Text className={styles.safetyIcon}>🛡️</Text>
            <Text className={styles.safetyBannerTitle}>线下见面安全须知</Text>
          </View>
          <Text className={styles.safetyBannerText}>
            {safetyTips[1]} 遇到骚扰或违规行为，请立即举报。
          </Text>
        </View>

        <View className={styles.sortTabs}>
          <View
            className={classnames(styles.sortTab, sortBy === 'rating' && styles.active)}
            onClick={() => setSortBy('rating')}
          >
            <Text className={styles.sortText}>好评优先</Text>
          </View>
          <View
            className={classnames(styles.sortTab, sortBy === 'reviewCount' && styles.active)}
            onClick={() => setSortBy('reviewCount')}
          >
            <Text className={styles.sortText}>评价最多</Text>
          </View>
        </View>

        <View className={styles.filterSection}>
          <Text className={styles.filterLabel}>选择城市</Text>
          <FilterBar
            options={cityOptions}
            value={currentCity}
            onChange={setCurrentCity}
          />
        </View>

        <View className={styles.filterSection}>
          <Text className={styles.filterLabel}>擅长风格</Text>
          <FilterBar
            options={styleOptions}
            value={currentStyle}
            onChange={setCurrentStyle}
          />
        </View>

        <View className={styles.listWrapper}>
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((p) => (
              <ProfileCard key={p.id} profile={p} />
            ))
          ) : (
            <View style={{ padding: '80rpx 0', textAlign: 'center' }}>
              <Text style={{ fontSize: '28rpx', color: '#A09383' }}>暂无符合条件的同袍</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default ProfilesPage;
