import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface SectionHeaderProps {
  title: string;
  extra?: string;
  onExtraClick?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, extra, onExtraClick }) => {
  return (
    <View className={styles.wrapper}>
      <View className={styles.left}>
        <View className={styles.bar}></View>
        <Text className={styles.title}>{title}</Text>
      </View>
      {extra && (
        <View className={styles.extra} onClick={onExtraClick}>
          <Text className={styles.extraText}>{extra}</Text>
        </View>
      )}
    </View>
  );
};

export default SectionHeader;
