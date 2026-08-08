// 莫兰迪 / 水彩渐变设计令牌
// 与网站 frontend 全局样式、小程序 app.scss 对齐，详见 .trae/documents/App/02-UI设计规范.md
export const color = {
  primary: '#8AA6B8',
  primaryHover: '#7A97AA',
  primaryActive: '#6A889C',
  primaryLight: '#E8EEF2',

  // 莫兰迪辅助色（标签、点缀、无封面占位）
  morandiPink: '#C9AEB0',
  morandiGreen: '#A9B8A0',
  morandiApricot: '#D2B49C',
  morandiPurple: '#B0A6C0',
  morandiCyan: '#9DB8B6',

  // 中性色（暖调）
  textPrimary: '#3A3B3C',
  textRegular: '#5C5E60',
  textSecondary: '#8C8E90',
  textPlaceholder: '#BEC0C2',
  border: '#E6E3E0',
  borderLight: '#F1EFEC',
  bg: '#FDFCFA',
  bgPage: '#F6F4F1',
  white: '#FFFFFF',
} as const;

// 水彩渐变（配合 expo-linear-gradient 使用）
export const gradient = {
  header: ['#E8EEF2', '#F3ECEF', '#EDF0EA'] as const,
  primary: ['#9DB8B6', '#8AA6B8'] as const,
  soft: ['#F5EFEF', '#EEF2F4'] as const,
};

// 无封面占位渐变，列表按 index % 4 取色
export const coverGradients: readonly (readonly [string, string])[] = [
  ['#E8EEF2', '#D9E6E4'],
  ['#F3ECEF', '#E8D8DB'],
  ['#EDF0EA', '#DCE4D2'],
  ['#EFEAF0', '#E1D8E6'],
];

export const radius = { sm: 8, md: 16, lg: 24 } as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

// 弥散柔光阴影（iOS shadow* + Android elevation）
export const shadow = {
  sm: {
    shadowColor: '#786E64',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  md: {
    shadowColor: '#786E64',
    shadowOpacity: 0.07,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
} as const;

export const font = {
  pageTitle: 24,
  articleTitle: 20,
  cardTitle: 17,
  body: 15,
  meta: 13,
} as const;
