import { get, post } from './request'

/** 某文章评论列表 GET /api/comments?articleId=x */
export const getComments = (articleId) => get('/comments', { articleId })

/** 最新评论 GET /api/comments/recent?limit=5 */
export const getRecentComments = (limit = 5) => get('/comments/recent', { limit })

/** 提交评论 POST /api/comments */
export const submitComment = (data) => post('/comments', data)
