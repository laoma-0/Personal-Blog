import request from '@/utils/request'

/** 最新评论 */
export function getRecentComments(limit = 5) {
  return request.get('/comments/recent', { params: { limit } })
}

/** 某篇文章的评论列表（审核通过的） */
export function getArticleComments(articleId) {
  return request.get('/comments', { params: { articleId } })
}

/** 提交评论 */
export function submitComment(data) {
  return request.post('/comments', data)
}

// ==================== 后台管理 ====================

/** 后台评论分页 */
export function adminGetComments(params) {
  return request.get('/admin/comments', { params })
}

/** 修改评论状态（1 通过 / 2 拒绝） */
export function adminUpdateCommentStatus(id, status) {
  return request.put(`/admin/comments/${id}/status`, null, { params: { status } })
}

/** 删除评论 */
export function adminDeleteComment(id) {
  return request.delete(`/admin/comments/${id}`)
}
