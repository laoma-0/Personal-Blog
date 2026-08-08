import request from '@/utils/request'

/** 标签列表 */
export function getTags() {
  return request.get('/tags')
}

/** 提交标签 */
export function submitTag(data) {
  return request.post('/tags', data)
}

// ==================== 后台管理 ====================

/** 后台标签列表 */
export function adminGetTags() {
  return request.get('/admin/tags')
}

/** 新增标签 */
export function adminAddTag(data) {
  return request.post('/admin/tags', data)
}

/** 删除标签 */
export function adminDeleteTag(id) {
  return request.delete(`/admin/tags/${id}`)
}
