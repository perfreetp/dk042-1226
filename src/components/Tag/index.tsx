import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface TagProps {
  text: string;
  type?: 'default' | 'tea' | 'garden' | 'makeup' | 'market' | 'primary' | 'success' | 'warning';
  size?: 'sm' | 'md';
}

const Tag: React.FC<TagProps> = ({ text, type = 'default', size = 'sm' }) => {
  return (
    <View className={classnames(styles.tag, styles[`type-${type}`], styles[`size-${size}`])}>
      <Text className={styles.text}>{text}</Text>
    </View>
  );
};

export default Tag;
