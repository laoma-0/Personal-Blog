import request from '@/utils/request'

/** 文章分页列表 */
export function getArticleList(params) {
  return request.get('/articles', { params })
}

/** 文章详情 */
export function getArticleDetail(id) {
  return request.get(`/articles/${id}`)
}

/** 文章点赞（返回最新点赞数） */
export function likeArticle(id) {
  return request.post(`/articles/${id}/like`)
}

/** 取消点赞（返回最新点赞数） */
export function unlikeArticle(id) {
  return request.delete(`/articles/${id}/like`)
}

// ==================== 后台管理 ====================

/** 后台文章分页 */
export function adminGetArticles(params) {
  return request.get('/admin/articles', { params })
}

/** 后台文章详情（编辑回显） */
export function adminGetArticle(id) {
  return request.get(`/admin/articles/${id}`)
}

/** 新增文章 */
export function adminCreateArticle(data) {
  return request.post('/admin/articles', data)
}

/** 更新文章 */
export function adminUpdateArticle(id, data) {
  return request.put(`/admin/articles/${id}`, data)
}

/** 删除文章 */
export function adminDeleteArticle(id) {
  return request.delete(`/admin/articles/${id}`)
}
