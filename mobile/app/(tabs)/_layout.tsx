import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { color } from '../../src/theme/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.primary,
        tabBarInactiveTintColor: color.textSecondary,
        tabBarStyle: {
          backgroundColor: color.bg,
          borderTopColor: color.borderLight,
          height: 58,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color: c, size }) => <Feather name="home" size={size} color={c} />,
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          title: '分类',
          tabBarIcon: ({ color: c, size }) => <Feather name="grid" size={size} color={c} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: '关于',
          tabBarIcon: ({ color: c, size }) => <Feather name="user" size={size} color={c} />,
        }}
      />
    </Tabs>
  );
}
