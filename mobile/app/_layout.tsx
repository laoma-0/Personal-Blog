import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { color } from '../src/theme/tokens';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: color.bg },
          headerTintColor: color.textPrimary,
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: color.bgPage },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="article/list" options={{ title: '文章列表' }} />
        <Stack.Screen name="article/[id]" options={{ title: '文章详情' }} />
        <Stack.Screen name="archive" options={{ title: '归档' }} />
        <Stack.Screen name="message" options={{ title: '留言板' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
