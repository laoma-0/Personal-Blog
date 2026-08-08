import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FadeInView } from '../src/components/FadeInView';
import { EmptyState, ErrorState, Loading } from '../src/components/States';
import { getArchive } from '../src/services/archive';
import { color, font, radius, shadow, space } from '../src/theme/tokens';
import type { ArchiveGroup } from '../src/types';

export default function ArchiveScreen() {
  const router = useRouter();
  const [groups, setGroups] = useState<ArchiveGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setGroups(await getArchive());
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loading />;
  if (error) return <ErrorState text={error} onRetry={load} />;

  const total = groups.reduce((sum, g) => sum + (g.articles?.length ?? 0), 0);
  if (total === 0) return <EmptyState text="还没有文章" />;

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxl }}>
      <Text style={styles.summary}>共 {total} 篇文章</Text>

      {groups.map((group, gi) => (
        <FadeInView key={group.year} delay={Math.min(gi, 6) * 60} style={styles.group}>
          {/* 年份标题 */}
          <View style={styles.yearRow}>
            <Text style={styles.year}>{group.year}</Text>
            <Text style={styles.yearCount}>{group.articles?.length ?? 0} 篇</Text>
          </View>

          {/* 该年的时间线 */}
          <View style={styles.timeline}>
            {group.articles?.map((item) => (
              <Pressable
                key={item.id}
                style={styles.item}
                onPress={() => router.push(`/article/${item.id}`)}
                android_ripple={{ color: color.primaryLight }}
              >
                <View style={styles.dotWrap}>
                  <View style={styles.dot} />
                </View>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </FadeInView>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: color.bgPage },
  summary: { fontSize: 13, color: color.textSecondary, marginBottom: space.lg },
  group: { marginBottom: space.xl },
  yearRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.sm, marginBottom: space.md },
  year: { fontSize: font.pageTitle, fontWeight: '600', color: color.primary },
  yearCount: { fontSize: 12, color: color.textSecondary },
  timeline: {
    backgroundColor: color.bg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.borderLight,
    paddingVertical: space.xs,
    ...shadow.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  dotWrap: { width: 12, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: color.morandiCyan },
  date: { fontSize: 12, color: color.textSecondary, width: 44 },
  title: { flex: 1, minWidth: 0, fontSize: 14, color: color.textRegular },
});
