import { http } from './request';
import type { Comment } from '../types';

export interface CommentDTO {
  articleId: number;
  parentId?: number;
  nickname: string;
  email?: string;
  content: string;
}

/** 某文章评论列表 GET /api/comments?articleId=x（仅已审核） */
export function getComments(articleId: number | string) {
  return http.get<Comment[]>('/comments', { articleId });
}

/** 提交评论 POST /api/comments（提交后待审核） */
export function submitComment(data: CommentDTO) {
  return http.post<void>('/comments', data);
}
