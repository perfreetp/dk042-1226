import React, { useMemo } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import Tag from '@/components/Tag';
import { usePhotoshootStore } from '@/stores/photoshoot';
import { roleTextMap } from '@/data/photoshoots';
import { safetyTips } from '@/data/profiles';
import { Photoshoot, ShootRole } from '@/types/photoshoot';
import styles from './index.module.scss';

const roleColorMap: Record<ShootRole, string> = {
  photographer: '#4A7C7C',
  stylist: '#D4985A',
  model: '#8B4557'
};

const roleIconMap: Record<ShootRole, string> = {
  photographer: '📷',
  stylist: '💄',
  model: '👗'
};

const PhotoshootDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id || '';
  const photoshoots = usePhotoshootStore(state => state.photoshoots);
  const incrementView = usePhotoshootStore(state => state.incrementView);
  const isMyPhotoshoot = usePhotoshootStore(state => state.isMyPhotoshoot);
  const removePhotoshoot = usePhotoshootStore(state => state.removePhotoshoot);

  const photoshoot = useMemo(() => {
    if (id) {
      const p = photoshoots.find(x => x.id === id);
      if (p) {
        setTimeout(() => incrementView(id), 0);
        return p;
      }
    }
    return photoshoots[0];
  }, [photoshoots, id]);

  const isMine = useMemo(() => {
    return photoshoot ? isMyPhotoshoot(photoshoot.id) : false;
  }, [photoshoot, isMyPhotoshoot]);

  const isRemoved = photoshoot?.status === 'removed';

  const handleContact = () => {
    Taro.showModal({
      title: '联系方式',
      content: `发布者联系方式：\n${photoshoot?.contact || '暂无'}`,
      confirmText: '复制',
      confirmColor: '#8B4557'
    }).then((res) => {
      if (res.confirm && photoshoot?.contact) {
        Taro.setClipboardData({
          data: photoshoot.contact,
          success: () => {
            Taro.showToast({ title: '已复制到剪贴板', icon: 'success' });
          }
        });
      }
    }).catch(() => {});
  };

  const handleEdit = () => {
    if (!photoshoot) return;
    Taro.navigateTo({
      url: `/pages/publish/index?editId=${photoshoot.id}`
    });
  };

  const handleRemove = () => {
    if (!photoshoot) return;
    Taro.showModal({
      title: '下架确认',
      content: '确定要下架这条约拍信息吗？下架后其他用户将无法看到。',
      confirmText: '确认下架',
      confirmColor: '#C2575A'
    }).then((res) => {
      if (res.confirm) {
        const result = removePhotoshoot(photoshoot.id);
        if (result.success) {
          Taro.showToast({ title: result.message, icon: 'success' });
          setTimeout(() => Taro.navigateBack(), 800);
        } else {
          Taro.showToast({ title: result.message, icon: 'none' });
        }
      }
    }).catch(() => {});
  };

  const handleAuthorClick = () => {
    if (!photoshoot) return;
    if (isMine) {
      Taro.showToast({ title: '这是您自己发布的', icon: 'none' });
      return;
    }
    Taro.navigateTo({
      url: `/pages/chat/index?targetId=${photoshoot.author.id}&targetName=${encodeURIComponent(photoshoot.author.name)}&targetAvatar=${encodeURIComponent(photoshoot.author.avatar)}`
    });
  };

  if (!photoshoot) return null;

  return (
    <View className={styles.page}>
      <ScrollView className={styles.scroll} scrollY>
        <View className={styles.coverWrap}>
          <Image
            className={styles.coverImage}
            src={photoshoot.coverImage}
            mode="aspectFill"
          />
          <View
            className={styles.roleBadge}
            style={{ backgroundColor: roleColorMap[photoshoot.role] }}
          >
            <Text className={styles.roleIcon}>{roleIconMap[photoshoot.role]}</Text>
            <Text className={styles.roleText}>{roleTextMap[photoshoot.role]}</Text>
          </View>
          {isRemoved && (
            <View className={styles.removedMask}>
              <Text className={styles.removedText}>已下架</Text>
            </View>
          )}
        </View>

        <View className={styles.content}>
          <View className={styles.headerCard}>
            <Text className={styles.title}>{photoshoot.title}</Text>
            <View className={styles.metaRow}>
              <View className={styles.metaItem}>
                <Text className={styles.metaIcon}>📍</Text>
                <Text className={styles.metaText}>{photoshoot.city}</Text>
              </View>
              <View className={styles.metaItem}>
                <Text className={styles.metaIcon}>📅</Text>
                <Text className={styles.metaText}>{photoshoot.date}</Text>
              </View>
              <View className={styles.metaItem}>
                <Text className={styles.metaIcon}>💰</Text>
                <Text className={styles.metaText}>{photoshoot.budget}</Text>
              </View>
            </View>
            <View className={styles.tagRow}>
              {photoshoot.style.map((s) => (
                <Tag key={s} text={s} type="primary" size="sm" />
              ))}
            </View>
          </View>

          <View className={styles.authorCard} onClick={handleAuthorClick}>
            <Image
              className={styles.authorAvatar}
              src={photoshoot.author.avatar}
              mode="aspectFill"
            />
            <View className={styles.authorInfo}>
              <Text className={styles.authorName}>
                {photoshoot.author.name}
                {isMine && <Text className={styles.mineTag}>（我发布的）</Text>}
              </Text>
              <Text className={styles.authorSub}>
                发布于 {photoshoot.createTime}
                {photoshoot.updateTime && ` · 更新于 ${photoshoot.updateTime}`}
              </Text>
              <Text className={styles.authorSub}>
                👁️ 浏览 {photoshoot.viewCount} 次
              </Text>
            </View>
            <Text className={styles.arrowIcon}>›</Text>
          </View>

          <View className={styles.sectionCard}>
            <Text className={styles.sectionTitle}>📝 详细描述</Text>
            <Text className={styles.descText}>{photoshoot.description}</Text>
          </View>

          <View className={styles.sectionCard}>
            <Text className={styles.sectionTitle}>🛡️ 约拍安全提醒</Text>
            <View className={styles.safetyList}>
              {safetyTips.slice(0, 5).map((tip, i) => (
                <View key={i} className={styles.safetyItem}>
                  <Text className={styles.safetyDot}>•</Text>
                  <Text className={styles.safetyText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        {isMine ? (
          <>
            <Button
              className={classnames(styles.actionBtn, styles.outline)}
              onClick={handleContact}
            >查看联系方式</Button>
            <View className={styles.rightBtns}>
              <Button
                className={classnames(styles.actionBtn, styles.warning, isRemoved && styles.disabled)}
                onClick={handleEdit}
                disabled={isRemoved}
              >编辑</Button>
              {!isRemoved && (
                <Button
                  className={classnames(styles.actionBtn, styles.danger)}
                  onClick={handleRemove}
                >下架</Button>
              )}
            </View>
          </>
        ) : (
          <>
            <Button
              className={classnames(styles.actionBtn, styles.outline)}
              onClick={handleAuthorClick}
            >私信TA</Button>
            <Button
              className={classnames(styles.actionBtn, styles.primary)}
              onClick={handleContact}
              disabled={isRemoved}
            >获取联系方式</Button>
          </>
        )}
      </View>
    </View>
  );
};

export default PhotoshootDetailPage;
