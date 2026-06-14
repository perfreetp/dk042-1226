import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import PhotoshootCard from '@/components/PhotoshootCard';
import FilterBar from '@/components/FilterBar';
import { usePhotoshootStore } from '@/stores/photoshoot';
import { cities } from '@/data/activities';
import { ShootRole, Photoshoot } from '@/types/photoshoot';
import { safetyTips } from '@/data/profiles';
import styles from './index.module.scss';

const tabs = [
  { value: 'all', label: '全部' },
  { value: 'photographer', label: '摄影师' },
  { value: 'stylist', label: '妆娘' },
  { value: 'model', label: '模特' }
];

const myUserId = 'me';

const SquarePage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('all');
  const [currentCity, setCurrentCity] = useState('全部');
  const [, forceRefresh] = useState(0);
  const photoshoots = usePhotoshootStore(state => state.photoshoots);

  useDidShow(() => {
    forceRefresh(n => n + 1);
  });

  const filteredShoots = useMemo(() => {
    return photoshoots
      .filter((p: Photoshoot) => p.status !== 'removed')
      .filter((p: Photoshoot) => {
        const tabMatch = currentTab === 'all' || p.role === currentTab;
        const cityMatch = currentCity === '全部' || p.city === currentCity;
        return tabMatch && cityMatch;
      })
      .sort((a, b) => b.createTime.localeCompare(a.createTime));
  }, [photoshoots, currentTab, currentCity]);

  const cityOptions = cities.map((c) => ({ value: c, label: c }));

  const handlePublish = () => {
    Taro.navigateTo({ url: '/pages/publish/index' });
  };

  const handleCardClick = (p: Photoshoot) => {
    Taro.navigateTo({
      url: `/pages/photoshoot-detail/index?id=${p.id}`
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.safetyCard}>
          <Text className={styles.safetyTitle}>⚠️ 线下约拍安全提醒</Text>
          <Text className={styles.safetyText}>
            {safetyTips[0]}；首次见面请选择公共场所，保护好个人隐私。
          </Text>
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

        <View className={styles.filterSection}>
          <Text className={styles.filterLabel}>选择城市</Text>
          <FilterBar
            options={cityOptions}
            value={currentCity}
            onChange={setCurrentCity}
          />
        </View>

        <View className={styles.listWrapper}>
          {filteredShoots.length > 0 ? (
            filteredShoots.map((p) => (
              <PhotoshootCard
                key={p.id}
                photoshoot={p}
                isMine={p.author.id === myUserId}
                onClick={() => handleCardClick(p)}
              />
            ))
          ) : (
            <View style={{ padding: '120rpx 0', textAlign: 'center' }}>
              <Text style={{ fontSize: '80rpx', display: 'block', marginBottom: '24rpx' }}>📷</Text>
              <Text style={{ fontSize: '28rpx', color: '#A09383', display: 'block', marginBottom: '12rpx' }}>
                暂无符合条件的约拍信息
              </Text>
              <Text style={{ fontSize: '24rpx', color: '#C9C0B3' }}>点击右下角按钮发布一条吧~</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.publishBtn} onClick={handlePublish}>
        <Text className={styles.publishIcon}>+</Text>
      </View>
    </View>
  );
};

export default SquarePage;
