import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { color, space } from '../theme/tokens';

export function Loading({ text = '加载中…' }: { text?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={color.primary} />
      <Text style={styles.hint}>{text}</Text>
    </View>
  );
}

export function EmptyState({ text = '还没有内容' }: { text?: string }) {
  return (
    <View style={styles.center}>
      <Text style={styles.emoji}>(·_·)</Text>
      <Text style={styles.hint}>{text}</Text>
    </View>
  );
}

export function ErrorState({ text = '加载失败', onRetry }: { text?: string; onRetry?: () => void }) {
  return (
    <View style={styles.center}>
      <Text style={styles.hint}>{text}</Text>
      {onRetry ? (
        <Text style={styles.retry} onPress={onRetry}>
          点击重试
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    paddingVertical: space.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  emoji: { fontSize: 28, color: color.textPlaceholder },
  hint: { fontSize: 13, color: color.textSecondary },
  retry: {
    marginTop: space.xs,
    fontSize: 13,
    color: color.primary,
    paddingVertical: space.xs,
    paddingHorizontal: space.lg,
  },
});
