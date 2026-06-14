import React, { useState, useMemo } from 'react';
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import SectionHeader from '@/components/SectionHeader';
import ActivityCard from '@/components/ActivityCard';
import FilterBar from '@/components/FilterBar';
import { useActivityStore } from '@/stores/activity';
import { cities, activityTypes } from '@/data/activities';
import { Activity } from '@/types/activity';
import styles from './index.module.scss';

const bannerData = [
  {
    id: 'b1',
    title: '长安雅集·唐制汉服茶会',
    desc: '品香茗·赏古乐·共话风雅',
    image: 'https://picsum.photos/id/1080/750/400'
  },
  {
    id: 'b2',
    title: '西湖夏日·宋韵游园会',
    desc: '荷畔漫步·宋韵游戏·免费参与',
    image: 'https://picsum.photos/id/1039/750/400'
  },
  {
    id: 'b3',
    title: '金陵汉风市集·非遗手作',
    desc: '50+摊位·穿汉服享折扣',
    image: 'https://picsum.photos/id/431/750/400'
  }
];

const categoryData = [
  { key: 'tea', label: '茶会', icon: '🍵' },
  { key: 'garden', label: '游园', icon: '🌸' },
  { key: 'makeup', label: '妆造', icon: '💄' },
  { key: 'market', label: '市集', icon: '🏮' }
];

const IndexPage: React.FC = () => {
  const [currentCity, setCurrentCity] = useState('全部');
  const [currentType, setCurrentType] = useState('all');
  const activities = useActivityStore(state => state.activities);

  const filteredActivities = useMemo(() => {
    return activities.filter((a: Activity) => {
      const cityMatch = currentCity === '全部' || a.city === currentCity;
      const typeMatch = currentType === 'all' || a.type === currentType;
      return cityMatch && typeMatch;
    });
  }, [activities, currentCity, currentType]);

  const handleCategoryClick = (key: string) => {
    setCurrentType(key);
  };

  const handleCitySelect = () => {
    Taro.showActionSheet({
      itemList: cities
    }).then((res) => {
      if (res.tapIndex !== undefined) {
        setCurrentCity(cities[res.tapIndex]);
      }
    }).catch(() => {});
  };

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <Swiper
          className={styles.bannerSwiper}
          autoplay
          interval={3500}
          circular
          indicatorDots
          indicatorColor="rgba(255,255,255,0.4)"
          indicatorActiveColor="#ffffff"
        >
          {bannerData.map((b) => (
            <SwiperItem key={b.id}>
              <View className={styles.bannerItem}>
                <Image className={styles.bannerImage} src={b.image} mode="aspectFill" />
                <View className={styles.bannerOverlay}>
                  <Text className={styles.bannerTitle}>{b.title}</Text>
                  <Text className={styles.bannerDesc}>{b.desc}</Text>
                </View>
              </View>
            </SwiperItem>
          ))}
        </Swiper>

        <View className={styles.categoryGrid}>
          {categoryData.map((c) => (
            <View
              key={c.key}
              className={styles.categoryItem}
              onClick={() => handleCategoryClick(c.key)}
            >
              <View className={`${styles.categoryIcon} ${styles[c.key]}`}>
                <Text>{c.icon}</Text>
              </View>
              <Text className={styles.categoryText}>{c.label}</Text>
            </View>
          ))}
        </View>

        <View className={styles.cityBar}>
          <View className={styles.cityLeft} onClick={handleCitySelect}>
            <Text className={styles.cityLabel}>热门活动</Text>
            <Text className={styles.cityName}>📍 {currentCity} ▾</Text>
          </View>
        </View>

        <FilterBar
          options={activityTypes}
          value={currentType}
          onChange={setCurrentType}
        />

        <View className={styles.listWrapper}>
          {filteredActivities.length > 0 ? (
            filteredActivities.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))
          ) : (
            <View style={{ padding: '80rpx 0', textAlign: 'center' }}>
              <Text style={{ fontSize: '28rpx', color: '#A09383' }}>暂无符合条件的活动</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default IndexPage;
