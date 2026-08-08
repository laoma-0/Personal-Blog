// 时间格式化：后端返回如 '2026-08-01 12:30:00' 或 ISO 串，统一取 MM-DD / YYYY-MM-DD
export function formatDate(input?: string, withYear = false): string {
  if (!input) return '';
  const normalized = input.replace(' ', 'T');
  const d = new Date(normalized);
  if (isNaN(d.getTime())) {
    // 兜底：直接截取字符串
    return withYear ? input.slice(0, 10) : input.slice(5, 10);
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return withYear ? `${y}-${m}-${day}` : `${m}-${day}`;
}

// 阅读量等大数简化：1234 → 1.2k
export function formatCount(n?: number): string {
  if (n == null) return '0';
  if (n < 1000) return String(n);
  return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
}
