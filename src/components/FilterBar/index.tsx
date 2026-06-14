import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ options, value, onChange }) => {
  return (
    <ScrollView scrollX className={styles.scrollWrapper}>
      <View className={styles.wrapper}>
        {options.map((opt) => (
          <View
            key={opt.value}
            className={classnames(styles.item, value === opt.value && styles.active)}
            onClick={() => onChange(opt.value)}
          >
            <Text className={classnames(styles.text, value === opt.value && styles.activeText)}>
              {opt.label}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default FilterBar;
