import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { EmptyState, Loading } from '../src/components/States';
import { getMessages, submitMessage } from '../src/services/message';
import { color, font, radius, shadow, space } from '../src/theme/tokens';
import type { Message } from '../src/types';
import { formatDate } from '../src/utils/format';

const avatarColors = [color.morandiPink, color.morandiGreen, color.morandiPurple, color.morandiCyan, color.morandiApricot];

export default function MessageScreen() {
  const [list, setList] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setList((await getMessages()) ?? []);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = async () => {
    if (!nickname.trim() || !content.trim()) {
      Alert.alert('提示', '昵称和留言内容不能为空');
      return;
    }
    setSubmitting(true);
    try {
      await submitMessage({ nickname: nickname.trim(), email: email.trim() || undefined, content: content.trim() });
      Alert.alert('提交成功', '留言已提交，审核通过后展示');
      setContent('');
    } catch (e) {
      Alert.alert('提交失败', e instanceof Error ? e.message : '请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxl }}>
      {/* 写留言（表单在上） */}
      <Text style={styles.h2}>写留言</Text>
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
          placeholder="想说的话……"
          placeholderTextColor={color.textPlaceholder}
          multiline
          value={content}
          onChangeText={setContent}
        />
        <Pressable style={styles.btn} onPress={onSubmit} disabled={submitting}>
          {submitting ? <ActivityIndicator color={color.white} /> : <Text style={styles.btnText}>提交留言</Text>}
        </Pressable>
        <Text style={styles.hint}>提交后进入审核，通过后展示</Text>
      </View>

      {/* 全部留言（列表在下） */}
      <Text style={styles.h2}>全部留言（{list.length}）</Text>
      {loading ? (
        <Loading />
      ) : list.length === 0 ? (
        <EmptyState text="还没有留言，快来抢沙发" />
      ) : (
        list.map((m, i) => (
          <View key={m.id} style={styles.comment}>
            <View style={styles.cHead}>
              <View style={[styles.dot, { backgroundColor: avatarColors[i % avatarColors.length] }]} />
              <Text style={styles.cName}>{m.nickname}</Text>
              <Text style={styles.cTime}>{formatDate(m.createTime)}</Text>
            </View>
            <Text style={styles.cText}>{m.content}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: color.bgPage },
  h2: { fontSize: font.cardTitle, fontWeight: '600', color: color.textPrimary, marginTop: space.lg, marginBottom: space.md },
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
  rowInput: { flex: 1, minWidth: 0 }, // 防止昵称/邮箱撑破容器（原型阶段教训）
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
  btn: {
    backgroundColor: color.primary,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
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
