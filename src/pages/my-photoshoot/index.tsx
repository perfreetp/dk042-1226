import React, { useState, useMemo } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { usePhotoshootStore } from '@/stores/photoshoot';
import { roleTextMap } from '@/data/photoshoots';
import { Photoshoot, ShootRole } from '@/types/photoshoot';
import Tag from '@/components/Tag';
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

const statusGroups = [
  { key: 'active', label: '上架中', icon: '🟢', desc: '已发布在广场可见' },
  { key: 'removed', label: '已下架', icon: '⬛', desc: '仅您自己可见' }
];

const MyPhotoshootPage: React.FC = () => {
  const photoshoots = usePhotoshootStore(state => state.photoshoots);
  const getMyPhotoshoots = usePhotoshootStore(state => state.getMyPhotoshoots);
  const removePhotoshoot = usePhotoshootStore(state => state.removePhotoshoot);
  const relistPhotoshoot = usePhotoshootStore(state => state.relistPhotoshoot);

  useDidShow(() => {
    // 强制刷新
  });

  const myList = useMemo(() => {
    return getMyPhotoshoots().sort((a, b) => {
      const at = new Date(a.updateTime || a.createTime).getTime();
      const bt = new Date(b.updateTime || b.createTime).getTime();
      return bt - at;
    });
  }, [photoshoots, getMyPhotoshoots]);

  const groupedList = useMemo(() => {
    return {
      active: myList.filter(p => p.status !== 'removed'),
      removed: myList.filter(p => p.status === 'removed')
    };
  }, [myList]);

  const stats = useMemo(() => ({
    total: myList.length,
    active: groupedList.active.length,
    removed: groupedList.removed.length
  }), [myList, groupedList]);

  const handleCardClick = (p: Photoshoot) => {
    Taro.navigateTo({
      url: `/pages/photoshoot-detail/index?id=${p.id}`
    });
  };

  const handleEdit = (e, p: Photoshoot) => {
    e.stopPropagation();
    Taro.navigateTo({
      url: `/pages/publish/index?editId=${p.id}`
    });
  };

  const handleRemove = (e, p: Photoshoot) => {
    e.stopPropagation();
    Taro.showModal({
      title: '下架确认',
      content: '确定要下架这条约拍信息吗？下架后其他用户将无法看到。',
      confirmText: '确认下架',
      confirmColor: '#C2575A'
    }).then((res) => {
      if (res.confirm) {
        const result = removePhotoshoot(p.id);
        Taro.showToast({ title: result.message, icon: result.success ? 'success' : 'none' });
      }
    }).catch(() => {});
  };

  const handleRelist = (e, p: Photoshoot) => {
    e.stopPropagation();
    Taro.showModal({
      title: '重新上架',
      content: '确定要重新上架这条约拍信息吗？上架后其他用户可正常看到。',
      confirmText: '确认上架',
      confirmColor: '#8B4557'
    }).then((res) => {
      if (res.confirm) {
        const result = relistPhotoshoot(p.id);
        Taro.showToast({ title: result.message, icon: result.success ? 'success' : 'none' });
      }
    }).catch(() => {});
  };

  const handlePublish = () => {
    Taro.navigateTo({ url: '/pages/publish/index' });
  };

  const renderCard = (p: Photoshoot) => {
    const isRemoved = p.status === 'removed';
    return (
      <View
        key={p.id}
        className={classnames(styles.cardItem, isRemoved && styles.cardRemoved)}
        onClick={() => handleCardClick(p)}
      >
        <View className={styles.cardInner}>
          <View className={styles.cardCover}>
            <Image className={styles.coverImage} src={p.coverImage} mode="aspectFill" />
            {isRemoved && (
              <View className={styles.coverMask}>
                <Text className={styles.maskText}>已下架</Text>
              </View>
            )}
          </View>
          <View className={styles.cardInfo}>
            <View style={{ display: 'flex', alignItems: 'center', gap: '12rpx' }}>
              <Text
                className={styles.roleTag}
                style={{
                  fontSize: '22rpx',
                  color: roleColorMap[p.role],
                  fontWeight: 600
                }}
              >
                {roleIconMap[p.role]} {roleTextMap[p.role]}
              </Text>
            </View>
            <Text className={styles.title}>{p.title}</Text>
            <View className={styles.metaRow}>
              <View className={styles.metaItem}>
                <Text className={styles.metaIcon}>📍</Text>
                <Text>{p.city}</Text>
              </View>
              <View className={styles.metaItem}>
                <Text className={styles.metaIcon}>📅</Text>
                <Text>{p.date}</Text>
              </View>
              <View className={styles.metaItem}>
                <Text className={styles.metaIcon}>💰</Text>
                <Text>{p.budget}</Text>
              </View>
            </View>
            <Text className={styles.timeRow}>
              发布于 {p.createTime}
              {p.updateTime && ` · 更新于 ${p.updateTime}`}
              {isRemoved && p.removeTime && ` · 下架于 ${p.removeTime}`}
            </Text>
            <Text className={styles.viewCount}>
              👁️ 浏览 {p.viewCount} 次
            </Text>
          </View>
        </View>
        <View className={styles.actionBar}>
          <Button
            className={classnames(styles.actionBtn, styles.warning)}
            onClick={(e) => handleEdit(e, p)}
          >编辑</Button>
          {isRemoved ? (
            <Button
              className={classnames(styles.actionBtn, styles.primary)}
              onClick={(e) => handleRelist(e, p)}
            >重新上架</Button>
          ) : (
            <Button
              className={classnames(styles.actionBtn, styles.danger)}
              onClick={(e) => handleRemove(e, p)}
            >下架</Button>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.total}</Text>
            <Text className={styles.statLabel}>总发布</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.active}</Text>
            <Text className={styles.statLabel}>上架中</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNum}>{stats.removed}</Text>
            <Text className={styles.statLabel}>已下架</Text>
          </View>
        </View>

        <Button className={styles.publishBtn} onClick={handlePublish}>
          ➕ 发布新的约拍需求
        </Button>

        <View className={styles.listWrapper}>
          {myList.length === 0 ? (
            <View className={styles.emptyBox}>
              <Text className={styles.emptyIcon}>📝</Text>
              <Text className={styles.emptyTitle}>还没有发布过约拍需求</Text>
              <Text className={styles.emptyDesc}>点击上方按钮发布第一条吧</Text>
            </View>
          ) : (
            statusGroups.map((group) => {
              const list = groupedList[group.key] || [];
              return (
                <View key={group.key} className={styles.groupBlock}>
                  <View className={styles.groupHeader}>
                    <Text className={styles.groupIcon}>{group.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text className={styles.groupTitle}>{group.label}</Text>
                      <Text className={styles.groupDesc}>{group.desc}</Text>
                    </View>
                    <View className={styles.groupCount}>
                      <Text className={styles.groupCountText}>{list.length}</Text>
                    </View>
                  </View>

                  {list.length > 0 ? (
                    list.map(renderCard)
                  ) : (
                    <View style={{ padding: '40rpx 0', textAlign: 'center' }}>
                      <Text style={{ fontSize: '26rpx', color: '#A09383' }}>
                        {group.label === '上架中' ? '暂无上架内容' : '暂无下架记录'}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </View>
    </View>
  );
};

export default MyPhotoshootPage;
