import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { withBase } from '../config';
import { color, coverGradients, radius, shadow, space } from '../theme/tokens';
import type { ArticleListItem } from '../types';

interface Props {
  /** 整个屏幕宽度（由父组件传入 useWindowDimensions().width） */
  screenWidth: number;
  items: ArticleListItem[];
  onPressItem?: (item: ArticleListItem) => void;
}

const CARD_HEIGHT = 170;
const SIDE = space.lg; // 卡片左右留白

export function Carousel({ screenWidth, items, onPressItem }: Props) {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // 关键：每一页的宽度 = 整屏宽度；卡片视觉宽度 = 整屏 - 两侧留白。
  // 分页步长与页宽严格一致，避免出现“半张 / 错位”。
  const pageWidth = screenWidth;
  const cardWidth = screenWidth - SIDE * 2;

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      const next = (active + 1) % items.length;
      scrollRef.current?.scrollTo({ x: next * pageWidth, animated: true });
      setActive(next);
    }, 4000);
    return () => clearInterval(timer);
  }, [active, items.length, pageWidth]);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
    setActive(idx);
  };

  if (items.length === 0) return null;

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        // 每页固定为整屏宽度，卡片在页内居中
        decelerationRate="fast"
      >
        {items.map((item, i) => {
          const cover = withBase(item.cover);
          const ph = coverGradients[i % coverGradients.length];
          return (
            <View key={item.id} style={{ width: pageWidth, alignItems: 'center' }}>
              <Pressable style={[styles.card, { width: cardWidth }]} onPress={() => onPressItem?.(item)}>
                {cover ? (
                  <Image source={{ uri: cover }} style={StyleSheet.absoluteFill as any} resizeMode="cover" />
                ) : (
                  <LinearGradient colors={ph} style={StyleSheet.absoluteFill as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                )}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.4)']}
                  style={StyleSheet.absoluteFill as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
                <View style={styles.overlay}>
                  <Text style={styles.badge}>{item.isTop === 1 ? '📌 置顶' : '🔥 推荐'}</Text>
                  <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.dots}>
        {items.map((_, i) => (
          <View key={i} style={[styles.dot, i === active && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { height: CARD_HEIGHT, borderRadius: radius.lg, overflow: 'hidden', ...shadow.md },
  overlay: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: space.lg, gap: 6 },
  badge: {
    alignSelf: 'flex-start',
    fontSize: 12,
    color: color.white,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  title: { fontSize: 18, fontWeight: '600', color: color.white },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: space.md },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: color.border },
  dotActive: { backgroundColor: color.primary, width: 18 },
});
