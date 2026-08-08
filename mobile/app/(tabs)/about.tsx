import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Cell, CellGroup } from '../../src/components/Cell';
import { getSiteStats } from '../../src/services/site';
import { color, font, gradient, radius, shadow, space } from '../../src/theme/tokens';
import type { SiteStats } from '../../src/types';
import { formatCount } from '../../src/utils/format';

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<SiteStats | null>(null);

  const load = useCallback(async () => {
    try {
      setStats(await getSiteStats());
    } catch {
      // 关于页作者卡失败不阻塞其余内容
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={{ padding: space.lg, paddingTop: insets.top + space.md, paddingBottom: space.xxl }}
    >
      <Text style={styles.h1}>关于</Text>

      {/* 作者卡 */}
      <LinearGradient colors={gradient.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.authorCard}>
        <View style={styles.avatar}>
          <Feather name="feather" size={26} color={color.white} />
        </View>
        <Text style={styles.authorName}>{stats?.author ?? '博主'}</Text>
        <Text style={styles.authorIntro} numberOfLines={2}>
          {stats?.intro ?? '软件工程学习笔记与随笔'}
        </Text>
        <View style={styles.statRow}>
          <Stat label="文章" value={stats?.articleCount ?? 0} />
          <Stat label="标签" value={stats?.tagCount ?? 0} />
          <Stat label="访问" value={stats?.viewCount ?? 0} />
        </View>
      </LinearGradient>

      {/* 站点信息 */}
      <CellGroup label="站点信息">
        <Cell
          icon="calendar"
          iconBg={color.morandiCyan}
          title="文章归档"
          value="按年份浏览全部文章"
          onPress={() => router.push('/archive')}
        />
        <Cell icon="info" iconBg={color.morandiCyan} title="版本号" value="v1.0.0" showArrow={false} />
        <Cell icon="settings" iconBg={color.morandiGreen} title="技术栈" value="React Native + Expo" showArrow={false} />
        <Cell
          icon="globe"
          iconBg={color.primary}
          title="网页版"
          onPress={() => Linking.openURL('http://8.134.79.217')}
        />
      </CellGroup>

      {/* 开发者 · 联系方式 */}
      <CellGroup label="开发者 · 联系方式">
        <Cell icon="user" iconBg={color.morandiApricot} title="作者" value={stats?.author ?? '博主'} showArrow={false} />
        <Cell icon="github" iconBg={color.textPrimary} title="GitHub" onPress={() => Linking.openURL('https://github.com')} />
        <Cell icon="mail" iconBg={color.morandiPurple} title="邮箱" onPress={() => Linking.openURL('mailto:')} />
        <Cell icon="heart" iconBg={color.morandiPink} title="捐赠支持" onPress={() => {}} />
      </CellGroup>

      {/* 互动 → 留言板独立页 */}
      <CellGroup label="互动">
        <Cell icon="message-circle" iconBg={color.primary} title="留言板" value="给博主留言，一起交流" onPress={() => router.push('/message')} />
      </CellGroup>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{formatCount(value)}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: color.bgPage },
  h1: { fontSize: font.pageTitle, fontWeight: '600', color: color.textPrimary, marginBottom: space.lg },
  authorCard: { borderRadius: radius.lg, padding: space.xl, alignItems: 'center', gap: 8, ...shadow.md },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  authorName: { fontSize: 18, fontWeight: '600', color: color.white },
  authorIntro: { fontSize: 13, color: 'rgba(255,255,255,0.9)', textAlign: 'center' },
  statRow: { flexDirection: 'row', gap: space.xxl, marginTop: space.sm },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 17, fontWeight: '600', color: color.white },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
});
