import { http } from './request';
import type { ArchiveGroup } from '../types';

/** 文章归档 GET /api/archive（按年份分组，含 id/title/date） */
export function getArchive() {
  return http.get<ArchiveGroup[]>('/archive');
}
