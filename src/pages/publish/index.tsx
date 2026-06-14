import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { ShootRole } from '@/types/photoshoot';
import { safetyTips } from '@/data/profiles';
import { cities } from '@/data/activities';
import styles from './index.module.scss';

const typeOptions = [
  { value: 'photographer', label: '我是摄影师', icon: '📷' },
  { value: 'stylist', label: '我是妆娘', icon: '💄' },
  { value: 'model', label: '我是模特', icon: '👗' }
];

const styleOptions = [
  '唐制', '宋制', '明制', '汉制', '魏晋', '汉元素',
  '清雅', '夜景', '旅拍', '复原妆', '新娘妆', '日常妆',
  '男装', '娇小型', '可爱风', '侠客风'
];

const PublishPage: React.FC = () => {
  const [role, setRole] = useState<ShootRole>('photographer');
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');

  const canSubmit = title.trim() && city.trim() && date.trim() && budget.trim() && contact.trim();

  const toggleStyle = (s: string) => {
    if (selectedStyles.includes(s)) {
      setSelectedStyles(selectedStyles.filter((x) => x !== s));
    } else {
      setSelectedStyles([...selectedStyles, s]);
    }
  };

  const handleCitySelect = () => {
    const cityList = cities.filter((c) => c !== '全部');
    Taro.showActionSheet({
      itemList: cityList
    }).then((res) => {
      if (res.tapIndex !== undefined) {
        setCity(cityList[res.tapIndex]);
      }
    }).catch(() => {});
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      Taro.showToast({ title: '请完善必填信息', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '确认发布',
      content: '发布后所有用户均可看到该信息，请确保填写内容真实有效。',
      confirmColor: '#8B4557'
    }).then((res) => {
      if (res.confirm) {
        Taro.showLoading({ title: '发布中...' });
        setTimeout(() => {
          Taro.hideLoading();
          Taro.showToast({ title: '发布成功', icon: 'success' });
          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }, 1000);
      }
    }).catch(() => {});
  };

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <Text className={styles.sectionTitle} style={{ marginBottom: '24rpx' }}>选择您的身份</Text>
        <View className={styles.typeCard}>
          {typeOptions.map((opt) => (
            <View
              key={opt.value}
              className={classnames(styles.typeItem, role === opt.value && styles.active)}
              onClick={() => setRole(opt.value as ShootRole)}
            >
              <Text className={styles.typeIcon}>{opt.icon}</Text>
              <Text className={styles.typeLabel}>{opt.label}</Text>
            </View>
          ))}
        </View>

        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>基本信息</Text>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>需求标题
            </Text>
            <Input
              className={styles.formInput}
              placeholder="如：西湖宋制清雅风约拍，寻女模特一位"
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
              maxlength={50}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>所在城市
            </Text>
            <View
              className={styles.formInput}
              style={{ display: 'flex', alignItems: 'center', color: city ? '#2C2416' : '#C9C0B3' }}
              onClick={handleCitySelect}
            >
              <Text>{city || '请选择城市'}</Text>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>可约时间
            </Text>
            <Input
              className={styles.formInput}
              placeholder="如：6月25日、周末均可、全月可约"
              value={date}
              onInput={(e) => setDate(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>预算/报价
            </Text>
            <Input
              className={styles.formInput}
              placeholder="如：300-500/组、互勉、688起"
              value={budget}
              onInput={(e) => setBudget(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>擅长/偏好风格（可多选）</Text>
            <View className={styles.tagList}>
              {styleOptions.map((s) => (
                <View
                  key={s}
                  className={classnames(styles.tagItem, selectedStyles.includes(s) && styles.active)}
                  onClick={() => toggleStyle(s)}
                >
                  <Text className={styles.tagText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>详细描述</Text>
            <Textarea
              className={styles.formTextarea}
              placeholder="请详细描述您的需求，包括拍摄风格、服装要求、合作方式、注意事项等"
              value={description}
              onInput={(e) => setDescription(e.detail.value)}
              maxlength={500}
              autoHeight
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>联系方式
            </Text>
            <Input
              className={styles.formInput}
              placeholder="微信号/手机号，发布后仅感兴趣的用户可见"
              value={contact}
              onInput={(e) => setContact(e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.safetyCard}>
          <Text className={styles.safetyTitle}>⚠️ 线下约拍安全须知</Text>
          <View className={styles.safetyList}>
            {safetyTips.slice(0, 4).map((tip, i) => (
              <Text key={i} className={styles.safetyItem}>{tip}</Text>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button
          className={classnames(styles.submitBtn, !canSubmit && styles.disabled)}
          onClick={handleSubmit}
        >立即发布</Button>
      </View>
    </View>
  );
};

export default PublishPage;
