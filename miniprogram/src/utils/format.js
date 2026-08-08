/** 日期：取前 10 位 yyyy-MM-dd */
export function formatDate(val) {
  if (!val) return ''
  return String(val).slice(0, 10)
}

/** 访问量：>=1000 显示 1.2k */
export function formatViews(v) {
  const n = Number(v || 0)
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n)
}

/** 无封面时按 id % 4 取一组莫兰迪水彩渐变（内联 style 用） */
const COVERS = [
  'linear-gradient(135deg,#E8EEF2,#D9E6E4)',
  'linear-gradient(135deg,#F3ECEF,#E8D8DB)',
  'linear-gradient(135deg,#EDF0EA,#DCE4D2)',
  'linear-gradient(135deg,#EFEAF0,#E1D8E6)'
]
export function coverBg(article) {
  const id = Number(article && article.id) || 0
  return COVERS[id % COVERS.length]
}

/** 无封面时按 id % 4 取一个占位封面 class（cover-0 ~ cover-3，样式见 app.scss） */
export function coverClass(article) {
  const id = Number(article && article.id) || 0
  return `cover-${id % 4}`
}

/** 把标签 hex 颜色转成淡背景（14% 透明度） */
export function hexToSoft(hex) {
  if (!hex) return 'var(--color-primary-light)'
  const h = hex.replace('#', '')
  if (h.length !== 6) return 'var(--color-primary-light)'
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},0.14)`
}
