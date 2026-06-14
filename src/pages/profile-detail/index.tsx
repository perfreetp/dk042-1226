import React, { useState, useMemo } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import Tag from '@/components/Tag';
import { profiles, reviews, safetyTips } from '@/data/profiles';
import { Profile, Review } from '@/types/profile';
import styles from './index.module.scss';

const ProfileDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id || 'u1';
  const profile = useMemo(() => {
    return profiles.find((p: Profile) => p.id === id) || profiles[0];
  }, [id]);

  const profileReviews = useMemo(() => {
    return reviews.filter((r: Review) => r.profileId === id);
  }, [id]);

  const [isBlocked, setIsBlocked] = useState(false);

  const handleMessage = () => {
    Taro.showModal({
      title: '发起私信',
      content: `确定要向「${profile.name}」发送私信吗？\n\n请友好交流，尊重他人。涉及线下见面请务必注意安全。`,
      confirmText: '去私信',
      confirmColor: '#8B4557'
    }).then((res) => {
      if (res.confirm) {
        Taro.showToast({ title: '功能开发中', icon: 'none' });
      }
    }).catch(() => {});
  };

  const handleReport = () => {
    const reasons = ['发布虚假信息', '骚扰/辱骂', '诱导私下交易', '涉嫌违法违规', '其他'];
    Taro.showActionSheet({
      itemList: reasons
    }).then((res) => {
      if (res.tapIndex !== undefined) {
        Taro.showModal({
          title: '举报确认',
          content: `您举报的原因为：${reasons[res.tapIndex]}\n\n我们将在24小时内审核处理，感谢您为营造健康社区做出的贡献。`,
          confirmText: '确认举报',
          confirmColor: '#C2575A'
        }).then((r) => {
          if (r.confirm) {
            Taro.showToast({ title: '举报已提交', icon: 'success' });
          }
        }).catch(() => {});
      }
    }).catch(() => {});
  };

  const handleBlock = () => {
    if (isBlocked) {
      Taro.showModal({
        title: '移出黑名单',
        content: `确定将「${profile.name}」移出黑名单？`,
        confirmColor: '#8B4557'
      }).then((res) => {
        if (res.confirm) {
          setIsBlocked(false);
          Taro.showToast({ title: '已移出黑名单', icon: 'none' });
        }
      }).catch(() => {});
    } else {
      Taro.showModal({
        title: '加入黑名单',
        content: `将「${profile.name}」加入黑名单后，您将不再看到对方的内容和消息。`,
        confirmText: '确认拉黑',
        confirmColor: '#C2575A'
      }).then((res) => {
        if (res.confirm) {
          setIsBlocked(true);
          Taro.showToast({ title: '已加入黑名单', icon: 'none' });
        }
      }).catch(() => {});
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Text key={i} className={styles.star}>★</Text>);
    }
    if (hasHalf) {
      stars.push(<Text key="half" className={styles.star}>☆</Text>);
    }
    const empty = 5 - fullStars - (hasHalf ? 1 : 0);
    for (let i = 0; i < empty; i++) {
      stars.push(<Text key={`e${i}`} className={styles.star} style={{ color: '#D4C8B8' }}>☆</Text>);
    }
    return stars;
  };

  const sizeData = [
    { label: '身高', value: `${profile.size.height}cm` },
    { label: '体重', value: `${profile.size.weight}kg` },
    { label: '三围', value: `${profile.size.bust}/${profile.size.waist}/${profile.size.hip}` },
    { label: '胸围', value: `${profile.size.bust}cm` },
    { label: '腰围', value: `${profile.size.waist}cm` },
    { label: '鞋码', value: `${profile.size.shoeSize}码` }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.headerCard}>
        <View className={styles.profileHeader}>
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
          <View className={styles.profileInfo}>
            <View className={styles.nameRow}>
              <Text className={styles.name}>{profile.name}</Text>
              <Text className={styles.cityText}>📍 {profile.city}</Text>
            </View>
            <View className={styles.ratingRow}>
              <View className={styles.stars}>{renderStars(profile.rating)}</View>
              <Text className={styles.ratingNum}>{profile.rating}</Text>
              <Text className={styles.reviewCount}>({profile.reviewCount}条评价)</Text>
            </View>
            <Text className={styles.bioText}>{profile.bio}</Text>
          </View>
        </View>
        <View className={styles.tagRow}>
          {profile.tags.map((t) => (
            <Tag key={t} text={t} type="primary" size="sm" />
          ))}
        </View>
      </View>

      <ScrollView scrollY className={styles.contentSection}>
        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📏</Text>身体数据
          </Text>
          <View className={styles.sizeGrid}>
            {sizeData.map((s) => (
              <View key={s.label} className={styles.sizeItem}>
                <Text className={styles.sizeLabel}>{s.label}</Text>
                <Text className={styles.sizeValue}>{s.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🎀</Text>常穿风格
          </Text>
          <View className={styles.stylesRow}>
            {profile.styles.map((s) => (
              <Tag key={s} text={s} type="default" size="md" />
            ))}
          </View>
        </View>

        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🖼️</Text>作品展示
            {profile.works.length > 0 && ` (${profile.works.length})`}
          </Text>
          {profile.works.length > 0 ? (
            <View className={styles.worksGrid}>
              {profile.works.map((w, i) => (
                <View key={i} className={styles.workItem}>
                  <Image className={styles.workImage} src={w} mode="aspectFill" />
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ fontSize: '28rpx', color: '#A09383', textAlign: 'center', padding: '40rpx 0' }}>
              暂无作品
            </Text>
          )}
        </View>

        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>💬</Text>可信评价
            {profileReviews.length > 0 && ` (${profileReviews.length})`}
          </Text>
          {profileReviews.length > 0 ? (
            profileReviews.map((r) => (
              <View key={r.id} className={styles.reviewItem}>
                <View className={styles.reviewHeader}>
                  <Image
                    className={styles.reviewerAvatar}
                    src={r.reviewer.avatar}
                    mode="aspectFill"
                  />
                  <View className={styles.reviewerInfo}>
                    <Text className={styles.reviewerName}>{r.reviewer.name}</Text>
                    <View className={styles.reviewMeta}>
                      <View className={styles.reviewStars}>
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Text key={i} className={styles.reviewStar}>★</Text>
                        ))}
                      </View>
                      <Text className={styles.reviewTime}>{r.createTime}</Text>
                      {r.verified && (
                        <Text className={styles.verifiedTag}>合作认证</Text>
                      )}
                    </View>
                  </View>
                </View>
                <Text className={styles.reviewContent}>{r.content}</Text>
              </View>
            ))
          ) : (
            <Text style={{ fontSize: '28rpx', color: '#A09383', textAlign: 'center', padding: '40rpx 0' }}>
              暂无评价
            </Text>
          )}
        </View>

        <View className={styles.safetyCard}>
          <Text className={styles.safetyTitle}>🛡️ 线下见面安全提醒</Text>
          <View className={styles.safetyList}>
            {safetyTips.map((tip, i) => (
              <Text key={i} className={styles.safetyItem}>{tip}</Text>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <Button
          className={classnames(styles.actionBtn, styles.outline)}
          onClick={handleReport}
        >举报</Button>
        <Button
          className={classnames(styles.actionBtn, isBlocked ? styles.danger : styles.outline)}
          onClick={handleBlock}
        >{isBlocked ? '已拉黑' : '拉黑'}</Button>
        <Button
          className={classnames(styles.actionBtn, styles.primary)}
          onClick={handleMessage}
        >💬 私信</Button>
      </View>
    </View>
  );
};

export default ProfileDetailPage;
