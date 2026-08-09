import { memo } from 'react';
import RenderHtml from 'react-native-render-html';
import { BASE_URL } from '../config';
import { color } from '../theme/tokens';

interface Props {
  html: string;
  contentWidth: number;
}

// 后端正文里的图片/链接是相对路径（如 src="/uploads/xxx.jpg"）。
// 网页版与后端同源，浏览器会自动补全域名；但 App 不知道域名，
// 相对路径无法加载 → 图片只显示 alt 文字。这里在渲染前把
// src/href 的相对根路径 "/..." 统一补上 BASE_URL。
function fixHtmlSrc(html: string): string {
  if (!html) return html;
  // 匹配 src="/xxx" / src='/xxx' / href="/xxx" / href='/xxx'
  // 仅处理以单个 "/" 开头（站内根路径）的地址，跳过 http(s):// 与 //cdn 协议相对地址
  return html.replace(
    /(\b(?:src|href)\s*=\s*)(["'])(\/(?!\/)[^"']*)\2/gi,
    (_m, attr: string, quote: string, path: string) => `${attr}${quote}${BASE_URL}${path}${quote}`
  );
}

// 用 memo 隔离富文本渲染：详情页的点赞、评论输入等 state 变化不会重建
// TRenderEngineProvider，从而消除 "costly tree rerenders" 告警。
// 仅当 html 或 contentWidth 变化时才重渲染。
const baseStyle = { fontSize: 15, lineHeight: 28, color: color.textRegular } as const;

function ArticleHtmlInner({ html, contentWidth }: Props) {
  const fixedHtml = fixHtmlSrc(html) || '<p>暂无内容</p>';
  return (
    <RenderHtml
      contentWidth={contentWidth}
      source={{ html: fixedHtml }}
      baseStyle={baseStyle}
      // 关闭一些运行时告警/优化开关，静态博客内容无需交互
      defaultTextProps={{ selectable: true }}
    />
  );
}

export const ArticleHtml = memo(
  ArticleHtmlInner,
  (prev, next) => prev.html === next.html && prev.contentWidth === next.contentWidth
);
