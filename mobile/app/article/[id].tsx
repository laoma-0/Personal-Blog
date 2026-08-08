import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { withBase } from '../../src/config';
import { ArticleHtml } from '../../src/components/ArticleHtml';
import { DetailSkeleton } from '../../src/components/Skeleton';
import { EmptyState, ErrorState } from '../../src/components/States';
import { getArticleDetail, likeArticle, unlikeArticle } from '../../src/services/article';
import { getComments, submitComment } from '../../src/services/comment';
import { color, font, gradient, radius, shadow, space } from '../../src/theme/tokens';
import type { Article, Comment } from '../../src/types';
import { formatDate } from '../../src/utils/format';
import { hasLiked, markLiked, unmarkLiked } from '../../src/utils/likeStore';

const avatarColors = [color.morandiPink, color.morandiGreen, color.morandiPurple, color.morandiCyan, color.morandiApricot];

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const contentWidth = width - space.lg * 2;

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeBusy, setLikeBusy] = useState(false);

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [a, c] = await Promise.all([getArticleDetail(id), getComments(id).catch(() => [])]);
      setArticle(a);
      setLikeCount(a.likeCount ?? 0);
      setComments(c ?? []);
      setLiked(await hasLiked(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const onToggleLike = async () => {
    if (!id || likeBusy) return;
    setLikeBusy(true);
    try {
      if (liked) {
        const latest = await unlikeArticle(id);
        setLikeCount(latest);
        setLiked(false);
        await unmarkLiked(id);
      } else {
        const latest = await likeArticle(id);
        setLikeCount(latest);
        setLiked(true);
        await markLiked(id);
      }
    } catch (e) {
      Alert.alert('操作失败', e instanceof Error ? e.message : '请稍后重试');
    } finally {
      setLikeBusy(false);
    }
  };

  const onSubmitComment = async () => {
    if (!id) return;
    if (!nickname.trim() || !content.trim()) {
      Alert.alert('提示', '昵称和评论内容不能为空');
      return;
    }
    setSubmitting(true);
    try {
      await submitComment({
        articleId: Number(id),
        nickname: nickname.trim(),
        email: email.trim() || undefined,
        content: content.trim(),
      });
      Alert.alert('提交成功', '评论已提交，审核通过后展示');
      setContent('');
    } catch (e) {
      Alert.alert('提交失败', e instanceof Error ? e.message : '请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DetailSkeleton />;
  if (error) return <ErrorState text={error} onRetry={load} />;
  if (!article) return <EmptyState text="文章不存在" />;

  const cover = withBase(article.cover);

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: space.xxl }}>
      {/* 头图 */}
      {cover ? (
        <Image source={{ uri: cover }} style={styles.cover} resizeMode="cover" />
      ) : (
        <LinearGradient colors={gradient.header} style={styles.cover} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      )}

      <View style={styles.container}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.meta}>
          {article.categoryName ? `#${article.categoryName} · ` : ''}
          {formatDate(article.createTime, true)} · 阅读 {article.readCount ?? 0} · ♡ {likeCount}
        </Text>

        {/* 正文 */}
        <View style={styles.htmlBox}>
          <ArticleHtml
            contentWidth={contentWidth}
            html={article.contentHtml || article.content || '<p>暂无内容</p>'}
          />
        </View>

        {/* 点赞 */}
        <View style={styles.likeWrap}>
          <Pressable style={[styles.likeBtn, liked && styles.likeBtnActive]} onPress={onToggleLike} disabled={likeBusy}>
            <Feather name="heart" size={16} color={liked ? color.white : color.textSecondary} />
            <Text style={[styles.likeText, liked && styles.likeTextActive]}>点赞 {likeCount}</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />

        {/* 发表评论（表单在上） */}
        <Text style={styles.h2}>发表评论</Text>
        <View style={styles.form}>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.rowInput]}
              placeholder="昵称"
              placeholderTextColor={color.textPlaceholder}
              value={nickname}
              onChangeText={setNickname}
            />
            <TextInput
              style={[styles.input, styles.rowInput]}
              placeholder="邮箱"
              placeholderTextColor={color.textPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="说点什么……"
            placeholderTextColor={color.textPlaceholder}
            multiline
            value={content}
            onChangeText={setContent}
          />
          <Pressable style={styles.btn} onPress={onSubmitComment} disabled={submitting}>
            {submitting ? <ActivityIndicator color={color.white} /> : <Text style={styles.btnText}>提交评论</Text>}
          </Pressable>
          <Text style={styles.hint}>提交后进入审核，通过后展示</Text>
        </View>

        {/* 全部评论（列表在下） */}
        <Text style={styles.h2}>全部评论（{comments.length}）</Text>
        {comments.length === 0 ? (
          <EmptyState text="还没有评论" />
        ) : (
          comments.map((c, i) => (
            <View key={c.id} style={styles.comment}>
              <View style={styles.cHead}>
                <View style={[styles.dot, { backgroundColor: avatarColors[i % avatarColors.length] }]} />
                <Text style={styles.cName}>{c.nickname}</Text>
                <Text style={styles.cTime}>{formatDate(c.createTime)}</Text>
              </View>
              <Text style={styles.cText}>{c.content}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: color.bgPage },
  cover: { width: '100%', height: 200 },
  container: { padding: space.lg },
  title: { fontSize: font.articleTitle, fontWeight: '600', color: color.textPrimary, lineHeight: 30 },
  meta: { fontSize: 13, color: color.textSecondary, marginTop: space.sm },
  htmlBox: { marginTop: space.lg },
  likeWrap: { alignItems: 'center', marginTop: space.xl },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: 999,
    paddingHorizontal: space.xl,
    paddingVertical: 10,
    backgroundColor: color.bg,
  },
  likeBtnActive: { backgroundColor: color.morandiPink, borderColor: color.morandiPink },
  likeText: { fontSize: 14, color: color.textSecondary },
  likeTextActive: { color: color.white },
  divider: { height: 1, backgroundColor: color.borderLight, marginVertical: space.xl },
  h2: { fontSize: font.cardTitle, fontWeight: '600', color: color.textPrimary, marginBottom: space.md, marginTop: space.md },
  form: {
    backgroundColor: color.bg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.borderLight,
    padding: space.lg,
    gap: space.sm,
    ...shadow.sm,
  },
  row: { flexDirection: 'row', gap: space.sm },
  rowInput: { flex: 1, minWidth: 0 },
  input: {
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: color.textRegular,
    backgroundColor: color.bgPage,
  },
  textarea: { height: 88, textAlignVertical: 'top' },
  btn: { backgroundColor: color.primary, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  btnText: { color: color.white, fontSize: 15, fontWeight: '500' },
  hint: { fontSize: 12, color: color.textSecondary, textAlign: 'center' },
  comment: {
    backgroundColor: color.bg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.borderLight,
    padding: space.lg,
    marginBottom: space.md,
    ...shadow.sm,
  },
  cHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginBottom: 6 },
  dot: { width: 28, height: 28, borderRadius: 14 },
  cName: { fontSize: 14, fontWeight: '500', color: color.textPrimary, flex: 1 },
  cTime: { fontSize: 12, color: color.textSecondary },
  cText: { fontSize: 14, color: color.textRegular, lineHeight: 22 },
});
