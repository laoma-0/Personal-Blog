// 环境配置单点（对齐小程序 src/config/index.js）
// 备案后将 BASE_URL 改为 https://域名 即可，其余无需变动
export const BASE_URL = 'http://8.134.79.217';
export const API_PREFIX = '/api';
export const REQUEST_TIMEOUT = 10000; // ms

// 拼接后端返回的相对图片地址
export function withBase(path?: string | null): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return BASE_URL + (path.startsWith('/') ? path : '/' + path);
}
