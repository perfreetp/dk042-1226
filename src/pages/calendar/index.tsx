import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import ActivityCard from '@/components/ActivityCard';
import FilterBar from '@/components/FilterBar';
import { activities, cities, dynasties } from '@/data/activities';
import { Activity } from '@/types/activity';
import styles from './index.module.scss';

interface DayItem {
  day: number;
  isEmpty: boolean;
  hasActivity: boolean;
}

const CalendarPage: React.FC = () => {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(now.getDate());
  const [currentCity, setCurrentCity] = useState('全部');
  const [currentDynasty, setCurrentDynasty] = useState('any');

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const result: DayItem[] = [];

    for (let i = 0; i < firstDay; i++) {
      result.push({ day: 0, isEmpty: true, hasActivity: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const hasActivity = activities.some((a: Activity) => a.date === dateStr);
      result.push({ day: d, isEmpty: false, hasActivity });
    }

    return result;
  }, [currentYear, currentMonth]);

  const selectedDateStr = useMemo(() => {
    if (!selectedDay) return null;
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  }, [currentYear, currentMonth, selectedDay]);

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((a: Activity) => {
      const dateMatch = !selectedDateStr || a.date === selectedDateStr;
      const cityMatch = currentCity === '全部' || a.city === currentCity;
      const dynastyMatch = currentDynasty === 'any' || a.dynasty === currentDynasty;
      return dateMatch && cityMatch && dynastyMatch;
    });
  }, [selectedDateStr, currentCity, currentDynasty]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  const cityOptions = cities.map((c) => ({ value: c, label: c }));

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.calendarCard}>
          <View className={styles.calendarHeader}>
            <View className={styles.navBtn} onClick={handlePrevMonth}>
              <Text className={styles.navText}>‹</Text>
            </View>
            <Text className={styles.monthText}>{currentYear}年{currentMonth + 1}月</Text>
            <View className={styles.navBtn} onClick={handleNextMonth}>
              <Text className={styles.navText}>›</Text>
            </View>
          </View>

          <View className={styles.weekRow}>
            {weekDays.map((w) => (
              <Text key={w} className={styles.weekText}>{w}</Text>
            ))}
          </View>

          <View className={styles.dayGrid}>
            {calendarDays.map((item, idx) => {
              if (item.isEmpty) {
                return <View key={idx} className={`${styles.dayCell} ${styles.empty}`}></View>;
              }
              const isToday = selectedDateStr && todayStr === `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`;
              const isSelected = selectedDay === item.day;
              return (
                <View
                  key={idx}
                  className={`${styles.dayCell} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
                  onClick={() => setSelectedDay(isSelected ? null : item.day)}
                >
                  <Text className={styles.dayText}>{item.day}</Text>
                  {item.hasActivity && <View className={styles.dot}></View>}
                </View>
              );
            })}
          </View>
        </View>

        <View className={styles.filterSection}>
          <View className={styles.filterGroup}>
            <Text className={styles.filterLabel}>选择城市</Text>
            <FilterBar
              options={cityOptions}
              value={currentCity}
              onChange={setCurrentCity}
            />
          </View>
          <View className={styles.filterGroup}>
            <Text className={styles.filterLabel}>朝代风格</Text>
            <FilterBar
              options={dynasties}
              value={currentDynasty}
              onChange={setCurrentDynasty}
            />
          </View>
        </View>

        <View className={styles.dayInfo}>
          <Text className={styles.dayInfoText}>
            {selectedDateStr ? `${currentMonth + 1}月${selectedDay}日活动` : '全部活动'}
          </Text>
          <Text className={styles.dayCount}>共 {filteredActivities.length} 场</Text>
        </View>

        <View className={styles.listWrapper}>
          {filteredActivities.length > 0 ? (
            filteredActivities.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))
          ) : (
            <View style={{ padding: '80rpx 0', textAlign: 'center' }}>
              <Text style={{ fontSize: '28rpx', color: '#A09383' }}>当日暂无活动，换个日期看看吧</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default CalendarPage;
