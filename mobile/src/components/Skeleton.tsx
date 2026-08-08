import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, type ViewStyle } from 'react-native';
import { color, radius, space } from '../theme/tokens';

/**
 * 骨架屏基础块：一个带缓慢「呼吸微光」的灰色占位矩形。
 * 红线：不用 opacity:0 常驻——微光在 0.45~1 之间循环，不会出现纯透明白屏。
 */
export function SkeletonBlock({ style }: { style?: ViewStyle | ViewStyle[] }) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View style={[styles.block, style as any, { opacity }]} />;
}

/** 文章卡骨架（与 ArticleCard 结构对齐：左封面右三行文字） */
export function ArticleCardSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonBlock style={styles.cover} />
      <View style={styles.body}>
        <SkeletonBlock style={{ width: '80%', height: 16 }} />
        <SkeletonBlock style={{ width: '95%', height: 12 }} />
        <SkeletonBlock style={{ width: '50%', height: 12 }} />
      </View>
    </View>
  );
}

/** 列表骨架：默认渲染 5 张文章卡骨架 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </View>
  );
}

/** 详情骨架：头图 + 标题 + 若干正文行 */
export function DetailSkeleton() {
  return (
    <View>
      <SkeletonBlock style={{ width: '100%', height: 200, borderRadius: 0 }} />
      <View style={{ padding: space.lg, gap: space.md }}>
        <SkeletonBlock style={{ width: '70%', height: 24 }} />
        <SkeletonBlock style={{ width: '40%', height: 12 }} />
        <View style={{ height: space.md }} />
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBlock key={i} style={{ width: i % 3 === 2 ? '55%' : '100%', height: 12 }} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { backgroundColor: color.border, borderRadius: radius.sm },
  card: {
    flexDirection: 'row',
    gap: space.md,
    backgroundColor: color.bg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.borderLight,
    padding: space.md,
    marginBottom: space.md,
  },
  cover: { width: 96, height: 96, borderRadius: radius.md },
  body: { flex: 1, minWidth: 0, justifyContent: 'center', gap: 8 },
});
