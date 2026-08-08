import request from '@/utils/request'

/** 文章归档（按年份分组） */
export function getArchive() {
  return request.get('/archive')
}
