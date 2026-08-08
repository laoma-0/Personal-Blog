import { Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ArticleCard } from '../../src/components/ArticleCard';
import { EmptyState, ErrorState, Loading } from '../../src/components/States';
import { getArticleList } from '../../src/services/article';
import { color, space } from '../../src/theme/tokens';
import type { ArticleListItem } from '../../src/types';

const PAGE_SIZE = 10;

export default function ArticleListScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ categoryId?: string; keyword?: string; title?: string }>();
  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;
  const keyword = params.keyword || undefined;

  const [list, setList] = useState<ArticleListItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    const title = params.title || (keyword ? `搜索：${keyword}` : '文章列表');
    navigation.setOptions({ title });
  }, [navigation, params.title, keyword]);

  const fetchPage = useCallback(
    async (pageNum: number) => {
      const res = await getArticleList({ pageNum, pageSize: PAGE_SIZE, categoryId, keyword });
      return res;
    },
    [categoryId, keyword]
  );

  const loadFirst = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPage(1);
      setList(res.records ?? []);
      setTotal(res.total ?? 0);
      setPage(1);
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [fetchPage]);

  useEffect(() => {
    loadFirst();
  }, [loadFirst]);

  const loadMore = async () => {
    if (loadingMore || loading || list.length >= total) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const res = await fetchPage(next);
      setList((prev) => [...prev, ...(res.records ?? [])]);
      setPage(next);
    } catch {
      // 静默失败，用户可继续下滑重试
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <View style={styles.page}>
      <Stack.Screen options={{}} />
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState text={error} onRetry={loadFirst} />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: space.lg }}
          renderItem={({ item, index }) => (
            <ArticleCard article={item} index={index} onPress={() => router.push(`/article/${item.id}`)} />
          )}
          ListEmptyComponent={<EmptyState text="还没有文章" />}
          onEndReachedThreshold={0.3}
          onEndReached={loadMore}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: color.bgPage },
});
