import { memo } from 'react';
import RenderHtml from 'react-native-render-html';
import { color } from '../theme/tokens';

interface Props {
  html: string;
  contentWidth: number;
}

// 用 memo 隔离富文本渲染：详情页的点赞、评论输入等 state 变化不会重建
// TRenderEngineProvider，从而消除 "costly tree rerenders" 告警。
// 仅当 html 或 contentWidth 变化时才重渲染。
const baseStyle = { fontSize: 15, lineHeight: 28, color: color.textRegular } as const;

function ArticleHtmlInner({ html, contentWidth }: Props) {
  return (
    <RenderHtml
      contentWidth={contentWidth}
      source={{ html: html || '<p>暂无内容</p>' }}
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
