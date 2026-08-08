import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'likedArticleIds';

async function readIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

async function writeIds(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // 忽略写入失败
  }
}

export async function hasLiked(id: number | string): Promise<boolean> {
  const ids = await readIds();
  return ids.includes(String(id));
}

export async function markLiked(id: number | string): Promise<void> {
  const ids = await readIds();
  const key = String(id);
  if (!ids.includes(key)) await writeIds([...ids, key]);
}

export async function unmarkLiked(id: number | string): Promise<void> {
  const ids = await readIds();
  await writeIds(ids.filter((x) => x !== String(id)));
}
