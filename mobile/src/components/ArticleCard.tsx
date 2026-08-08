import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { withBase } from '../config';
import { color, coverGradients, font, radius, shadow, space } from '../theme/tokens';
import type { ArticleListItem } from '../types';
import { formatCount, formatDate } from '../utils/format';

interface Props {
  article: ArticleListItem;
  index?: number;
  onPress?: () => void;
}

export function ArticleCard({ article, index = 0, onPress }: Props) {
  const cover = withBase(article.cover);
  const placeholder = coverGradients[index % coverGradients.length];

  return (
    <Pressable style={styles.card} onPress={onPress} android_ripple={{ color: color.primaryLight }}>
      <View style={styles.coverBox}>
        {cover ? (
          <Image source={{ uri: cover }} style={styles.cover} resizeMode="cover" />
        ) : (
          <LinearGradient colors={placeholder} style={styles.cover} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
        )}
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          {article.isTop === 1 ? <Text style={styles.topTag}>置顶</Text> : null}
          <Text style={styles.title} numberOfLines={2}>
            {article.title}
          </Text>
        </View>
        {article.summary ? (
          <Text style={styles.summary} numberOfLines={2}>
            {article.summary}
          </Text>
        ) : null}
        <Text style={styles.meta} numberOfLines={1}>
          {article.categoryName ? `#${article.categoryName} · ` : ''}
          阅读 {formatCount(article.readCount)} · ♡ {article.likeCount ?? 0}
          {article.createTime ? ` · ${formatDate(article.createTime)}` : ''}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: space.md,
    backgroundColor: color.bg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.borderLight,
    padding: space.md,
    marginBottom: space.md,
    ...shadow.sm,
  },
  coverBox: { width: 96, height: 96, borderRadius: radius.md, overflow: 'hidden' },
  cover: { width: '100%', height: '100%' },
  body: { flex: 1, minWidth: 0, justifyContent: 'center', gap: 6 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  topTag: {
    fontSize: 11,
    color: '#8A6A4A',
    backgroundColor: color.morandiApricot,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 1,
    overflow: 'hidden',
  },
  title: { flex: 1, fontSize: font.cardTitle, fontWeight: '500', color: color.textPrimary, lineHeight: 24 },
  summary: { fontSize: 13, color: color.textSecondary, lineHeight: 20 },
  meta: { fontSize: 12, color: color.textSecondary },
});
