import { http } from './request';
import type { SiteStats } from '../types';

/** 站点统计 GET /api/site/stats（博主昵称/简介/文章数/标签数/访问量） */
export function getSiteStats() {
  return http.get<SiteStats>('/site/stats');
}
