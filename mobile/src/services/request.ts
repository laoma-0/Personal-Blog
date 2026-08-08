import { API_PREFIX, BASE_URL, REQUEST_TIMEOUT } from '../config';
import type { Result } from '../types';

type Params = Record<string, string | number | boolean | undefined | null>;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Params;
  data?: unknown;
}

// 清洗查询参数：去除 undefined/null/''，避免 Long 类型字段收到字符串 'undefined'（既往教训）
function toQuery(params?: Params): string {
  if (!params) return '';
  const pairs: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }
  return pairs.length ? `?${pairs.join('&')}` : '';
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// 统一请求：拼 BASE_URL + API_PREFIX、超时、解包 Result
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', params, data } = options;
  const url = BASE_URL + API_PREFIX + path + toQuery(params);

  const init: RequestInit = { method, headers: {} };
  if (data !== undefined) {
    (init.headers as Record<string, string>)['Content-Type'] = 'application/json';
    init.body = JSON.stringify(data);
  }

  let res: Response;
  try {
    res = await fetchWithTimeout(url, init);
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error('请求超时，请检查网络后重试');
    }
    throw new Error('网络异常，请稍后重试');
  }

  if (!res.ok) {
    throw new Error(`请求失败（${res.status}）`);
  }

  const json = (await res.json()) as Result<T>;
  if (json.code !== 200) {
    throw new Error(json.message || '请求失败');
  }
  return json.data;
}

export const http = {
  get: <T>(path: string, params?: Params) => request<T>(path, { method: 'GET', params }),
  post: <T>(path: string, data?: unknown, params?: Params) =>
    request<T>(path, { method: 'POST', data, params }),
  del: <T>(path: string, params?: Params) => request<T>(path, { method: 'DELETE', params }),
};
