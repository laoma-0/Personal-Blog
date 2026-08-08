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
  items: ArticleListItem[];
  width: number;
  onPressItem?: (item: ArticleListItem) => void;
}

const CARD_HEIGHT = 160;

export function Carousel({ items, width, onPressItem }: Props) {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const cardWidth = width;

  // 自动播放（约 4s/张）
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      const next = (active + 1) % items.length;
      scrollRef.current?.scrollTo({ x: next * cardWidth, animated: true });
      setActive(next);
    }, 4000);
    return () => clearInterval(timer);
  }, [active, items.length, cardWidth]);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
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
      >
        {items.map((item, i) => {
          const cover = withBase(item.cover);
          const ph = coverGradients[i % coverGradients.length];
          return (
            <Pressable key={item.id} style={[styles.slide, { width: cardWidth }]} onPress={() => onPressItem?.(item)}>
              <View style={styles.card}>
                {cover ? (
                  <Image source={{ uri: cover }} style={StyleSheet.absoluteFill as any} resizeMode="cover" />
                ) : (
                  <LinearGradient colors={ph} style={StyleSheet.absoluteFill as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                )}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.35)']}
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
              </View>
            </Pressable>
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
  slide: { paddingHorizontal: space.lg },
  card: { height: CARD_HEIGHT, borderRadius: radius.lg, overflow: 'hidden', ...shadow.md },
  overlay: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: space.lg, gap: 6 },
  badge: { alignSelf: 'flex-start', fontSize: 12, color: color.white, backgroundColor: 'rgba(0,0,0,0.28)', borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 2, overflow: 'hidden' },
  title: { fontSize: 18, fontWeight: '600', color: color.white },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: space.md },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: color.border },
  dotActive: { backgroundColor: color.primary, width: 18 },
});
