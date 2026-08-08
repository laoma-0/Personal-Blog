// 前端数据模型（对齐后端实体 / VO）——见 01-详细设计说明书.md 第五节

// 后端统一响应包装体
export interface Result<T> {
  code: number;
  message: string;
  data: T;
}

// 分页结构（MyBatis-Plus IPage 常见字段，做宽松兼容）
export interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export interface ArticleListItem {
  id: number;
  title: string;
  summary?: string;
  cover?: string;
  categoryId?: number;
  categoryName?: string;
  isTop?: number;
  readCount?: number;
  likeCount?: number;
  createTime?: string;
}

export interface Article extends ArticleListItem {
  content?: string;
  contentHtml?: string; // App 直接渲染此字段
  authorId?: number;
  status?: number;
  updateTime?: string;
}

export interface Category {
  id: number;
  name: string;
  articleCount?: number;
}

export interface Tag {
  id: number;
  name: string;
  articleCount?: number;
}

export interface Comment {
  id: number;
  articleId: number;
  parentId?: number;
  nickname: string;
  email?: string;
  avatar?: string;
  content: string;
  createTime?: string;
  status?: number; // 0 待审 / 1 通过 / 2 拒绝
}

export interface Message {
  id: number;
  nickname: string;
  email?: string;
  content: string;
  createTime?: string;
  status?: number;
}

export interface SiteStats {
  author?: string;
  intro?: string;
  articleCount?: number;
  tagCount?: number;
  viewCount?: number;
}
