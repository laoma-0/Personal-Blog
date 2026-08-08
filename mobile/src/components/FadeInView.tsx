import { useEffect, useRef } from 'react';
import { Animated, type ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  /** 延迟毫秒，用于列表逐项错峰进场 */
  delay?: number;
  /** 动画时长（默认 420ms，遵守「≤0.6s」红线） */
  duration?: number;
  style?: ViewStyle | ViewStyle[];
}

/**
 * 进场微动效：渐显 + 轻微上移（translateY 12→0）。
 * 红线：初值用 0.01 而非 0，绝不把 opacity:0 作为常驻初始态，防白屏。
 */
export function FadeInView({ children, delay = 0, duration = 420, style }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [progress, delay, duration]);

  const opacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0.01, 1] });
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });

  return (
    <Animated.View style={[style as any, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
