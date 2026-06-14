import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Tag from '@/components/Tag';
import { Photoshoot } from '@/types/photoshoot';
import { shootRoleTextMap } from '@/data/photoshoots';
import styles from './index.module.scss';

interface PhotoshootCardProps {
  photoshoot: Photoshoot;
  onClick?: () => void;
  isMine?: boolean;
}

const roleTagTypeMap: Record<string, 'primary' | 'success' | 'warning'> = {
  photographer: 'primary',
  stylist: 'success',
  model: 'warning'
};

const PhotoshootCard: React.FC<PhotoshootCardProps> = ({ photoshoot, onClick, isMine }) => {
  return (
    <View className={styles.card} onClick={onClick}>
      <View className={styles.header}>
        <Image
          className={styles.avatar}
          src={photoshoot.author.avatar}
          mode="aspectFill"
        />
        <View className={styles.authorInfo}>
          <View className={styles.nameRow}>
            <Text className={styles.authorName}>{photoshoot.author.name}</Text>
            {isMine && <View className={styles.mineBadge}><Text className={styles.mineText}>我发布的</Text></View>}
          </View>
          <View className={styles.authorMeta}>
            <Tag text={shootRoleTextMap[photoshoot.role]} type={roleTagTypeMap[photoshoot.role]} size="sm" />
            <Text className={styles.cityText}>{photoshoot.city}</Text>
          </View>
        </View>
      </View>
      <View className={styles.body}>
        <Text className={styles.title}>{photoshoot.title}</Text>
        <View className={styles.styleRow}>
          {photoshoot.style.slice(0, 4).map((s) => (
            <View key={s} className={styles.styleTag}>
              <Tag text={s} type="default" size="sm" />
            </View>
          ))}
        </View>
      </View>
      <View className={styles.footer}>
        <View className={styles.footerLeft}>
          <Text className={styles.dateText}>📅 {photoshoot.date}</Text>
        </View>
        <View className={styles.footerRight}>
          <Text className={styles.budgetText}>{photoshoot.budget}</Text>
          <Text className={styles.viewText}>👁 {photoshoot.viewCount}</Text>
        </View>
      </View>
    </View>
  );
};

export default PhotoshootCard;
