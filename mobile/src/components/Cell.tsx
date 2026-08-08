import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, radius, shadow, space } from '../theme/tokens';

interface CellProps {
  icon: keyof typeof Feather.glyphMap;
  iconBg?: string;
  title: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
}

export function Cell({ icon, iconBg = color.primary, title, value, onPress, showArrow = true }: CellProps) {
  return (
    <Pressable
      style={styles.cell}
      onPress={onPress}
      disabled={!onPress}
      android_ripple={onPress ? { color: color.primaryLight } : undefined}
    >
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <Feather name={icon} size={16} color={color.white} />
      </View>
      <View style={styles.textBox}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {value ? (
          <Text style={styles.value} numberOfLines={1}>
            {value}
          </Text>
        ) : null}
      </View>
      {showArrow && onPress ? <Feather name="chevron-right" size={18} color={color.textPlaceholder} /> : null}
    </Pressable>
  );
}

export function CellGroup({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      {label ? <Text style={styles.groupLabel}>{label}</Text> : null}
      <View style={styles.groupCard}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginTop: space.xl },
  groupLabel: { fontSize: 13, color: color.textSecondary, marginBottom: space.sm, marginLeft: space.xs },
  groupCard: {
    backgroundColor: color.bg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.borderLight,
    overflow: 'hidden',
    ...shadow.sm,
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.borderLight,
  },
  iconBox: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  textBox: { flex: 1, minWidth: 0 },
  title: { fontSize: 15, color: color.textPrimary },
  value: { fontSize: 12, color: color.textSecondary, marginTop: 2 },
});
