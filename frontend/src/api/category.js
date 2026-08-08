import request from '@/utils/request'

/** 分类列表（含文章数） */
export function getCategories() {
  return request.get('/categories')
}

// ==================== 后台管理 ====================

/** 后台分类列表（含文章数） */
export function adminGetCategories() {
  return request.get('/admin/categories')
}

/** 新增分类 */
export function adminAddCategory(data) {
  return request.post('/admin/categories', data)
}

/** 删除分类 */
export function adminDeleteCategory(id) {
  return request.delete(`/admin/categories/${id}`)
}

/** 分类详情 */
export function getCategoryDetail(id) {
  return request.get(`/categories/${id}`)
}
/** 分类标签列表 */
export function getTags() {
  return request.get('/tags')
}
/** 分类标签详情 */
export function getTagDetail(id) {
  return request.get(`/tags/${id}`)
}
/** 分类标签状态更新 */
export function updateTagStatus(id, status) {
  return request.put(`/tags/${id}/status`, { status })
}
/** 分类标签删除 */
export function deleteTag(id) {
  return request.delete(`/tags/${id}`)
}
/** 分类标签创建 */
export function createTag(data) {
  return request.post('/tags', data)
}
