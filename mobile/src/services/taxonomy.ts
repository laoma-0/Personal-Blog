import { http } from './request';
import type { Category, Tag } from '../types';

/** 分类列表（含文章数） GET /api/categories */
export function getCategories() {
  return http.get<Category[]>('/categories');
}

/** 标签列表 GET /api/tags */
export function getTags() {
  return http.get<Tag[]>('/tags');
}
