import request from '@/utils/request'

/** 站点统计（作者信息 + 文章数 + 标签数 + 总访问量） */
export function getSiteStats() {
  return request.get('/site/stats')
}
