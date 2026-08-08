import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState, ErrorState, Loading } from '../../src/components/States';
import { getCategories, getTags } from '../../src/services/taxonomy';
import { color, font, radius, shadow, space } from '../../src/theme/tokens';
import type { Category, Tag } from '../../src/types';

const chipColors = [
  color.morandiPink,
  color.morandiGreen,
  color.morandiApricot,
  color.morandiPurple,
  color.morandiCyan,
];

export default function CategoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [c, t] = await Promise.all([getCategories(), getTags()]);
      setCategories(c ?? []);
      setTags(t ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={{ padding: space.lg, paddingTop: insets.top + space.md }}
    >
      <Text style={styles.h1}>分类</Text>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState text={error} onRetry={load} />
      ) : (
        <>
          {categories.length === 0 ? (
            <EmptyState text="还没有分类" />
          ) : (
            <View style={styles.grid}>
              {categories.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={styles.catCard}
                  android_ripple={{ color: color.primaryLight }}
                  onPress={() =>
                    router.push({ pathname: '/article/list', params: { categoryId: cat.id, title: cat.name } })
                  }
                >
                  <Text style={styles.catName} numberOfLines={1}>
                    {cat.name}
                  </Text>
                  <Text style={styles.catCount}>{cat.articleCount ?? 0} 篇</Text>
                </Pressable>
              ))}
            </View>
          )}

          <Text style={styles.h2}>标签云</Text>
          {tags.length === 0 ? (
            <EmptyState text="还没有标签" />
          ) : (
            <View style={styles.tagWrap}>
              {tags.map((tag, i) => (
                <View key={tag.id} style={[styles.tag, { backgroundColor: chipColors[i % chipColors.length] + '33' }]}>
                  <Text style={[styles.tagText, { color: chipColors[i % chipColors.length] }]}>#{tag.name}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: color.bgPage },
  h1: { fontSize: font.pageTitle, fontWeight: '600', color: color.textPrimary, marginBottom: space.lg },
  h2: { fontSize: font.cardTitle, fontWeight: '600', color: color.textPrimary, marginTop: space.xl, marginBottom: space.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  catCard: {
    width: '47%',
    backgroundColor: color.bg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.borderLight,
    padding: space.lg,
    gap: 6,
    ...shadow.sm,
  },
  catName: { fontSize: font.cardTitle, fontWeight: '500', color: color.textPrimary },
  catCount: { fontSize: 12, color: color.textSecondary },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  tag: { borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 4 },
  tagText: { fontSize: 13 },
});
