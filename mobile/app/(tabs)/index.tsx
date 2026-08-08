import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArticleCard } from '../../src/components/ArticleCard';
import { Carousel } from '../../src/components/Carousel';
import { EmptyState, ErrorState, Loading } from '../../src/components/States';
import { getArticleList } from '../../src/services/article';
import { getSiteStats } from '../../src/services/site';
import { color, font, radius, shadow, space } from '../../src/theme/tokens';
import type { ArticleListItem, SiteStats } from '../../src/types';
import { formatCount } from '../../src/utils/format';

const PAGE_SIZE = 10;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [stats, setStats] = useState<SiteStats | null>(null);
  const [banners, setBanners] = useState<ArticleListItem[]>([]);
  const [list, setList] = useState<ArticleListItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');

  const loadAll = useCallback(async () => {
    setError(null);
    try {
      const [s, first] = await Promise.all([
        getSiteStats().catch(() => null),
        getArticleList({ pageNum: 1, pageSize: PAGE_SIZE }),
      ]);
      setStats(s);
      const records = first.records ?? [];
      setList(records);
      setTotal(first.total ?? 0);
      setPage(1);
      // 轮播：置顶优先，不足则取最新，最多 5 张
      const tops = records.filter((a) => a.isTop === 1);
      setBanners((tops.length ? tops : records).slice(0, 5));
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadAll();
      setLoading(false);
    })();
  }, [loadAll]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (loadingMore || loading || list.length >= total) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const res = await getArticleList({ pageNum: next, pageSize: PAGE_SIZE });
      setList((prev) => [...prev, ...(res.records ?? [])]);
      setPage(next);
    } catch {
      // 静默
    } finally {
      setLoadingMore(false);
    }
  };

  const onSearch = () => {
    const kw = keyword.trim();
    router.push({ pathname: '/article/list', params: kw ? { keyword: kw } : {} });
  };

  const Header = (
    <View style={{ paddingTop: insets.top + space.sm }}>
      {/* 搜索行 */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Feather name="search" size={16} color={color.textPlaceholder} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索文章…"
            placeholderTextColor={color.textPlaceholder}
            value={keyword}
            onChangeText={setKeyword}
            returnKeyType="search"
            onSubmitEditing={onSearch}
          />
        </View>
        <Pressable style={styles.iconBtn} onPress={() => router.push('/article/list')}>
          <Feather name="grid" size={18} color={color.textRegular} />
        </Pressable>
      </View>

      {/* 轮播 */}
      {banners.length > 0 ? (
        <View style={{ marginTop: space.md }}>
          <Carousel items={banners} width={width} onPressItem={(item) => router.push(`/article/${item.id}`)} />
        </View>
      ) : null}

      {/* 作者卡 */}
      <View style={styles.authorCard}>
        <View style={styles.avatar}>
          <Feather name="feather" size={22} color={color.white} />
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{stats?.author ?? '博主'}</Text>
          <Text style={styles.authorIntro} numberOfLines={1}>
            {stats?.intro ?? '软件工程学习笔记与随笔'}
          </Text>
          <Text style={styles.authorStat}>
            文章 {formatCount(stats?.articleCount)} · 标签 {formatCount(stats?.tagCount)} · 访问{' '}
            {formatCount(stats?.viewCount)}
          </Text>
        </View>
      </View>

      <Text style={styles.h2}>最新文章</Text>
    </View>
  );

  if (loading) return <Loading />;
  if (error) return <ErrorState text={error} onRetry={onRefresh} />;

  return (
    <View style={styles.page}>
      <FlatList
        data={list}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={Header}
        contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: space.xxl }}
        renderItem={({ item, index }) => (
          <ArticleCard article={item} index={index} onPress={() => router.push(`/article/${item.id}`)} />
        )}
        ListEmptyComponent={<EmptyState text="还没有文章" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={color.primary} />}
        onEndReachedThreshold={0.3}
        onEndReached={loadMore}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: color.bgPage },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  searchBox: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: color.bg,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: color.borderLight,
    paddingHorizontal: space.lg,
    height: 42,
  },
  searchInput: { flex: 1, minWidth: 0, fontSize: 14, color: color.textRegular, padding: 0 },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: color.bg,
    borderWidth: 1,
    borderColor: color.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: color.bg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.borderLight,
    padding: space.lg,
    marginTop: space.lg,
    ...shadow.sm,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: color.primary, alignItems: 'center', justifyContent: 'center' },
  authorInfo: { flex: 1, minWidth: 0, gap: 3 },
  authorName: { fontSize: font.cardTitle, fontWeight: '600', color: color.textPrimary },
  authorIntro: { fontSize: 13, color: color.textSecondary },
  authorStat: { fontSize: 12, color: color.textSecondary, marginTop: 2 },
  h2: { fontSize: font.cardTitle, fontWeight: '600', color: color.textPrimary, marginTop: space.xl, marginBottom: space.md },
});
