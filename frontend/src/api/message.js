import request from '@/utils/request'

/** 留言列表 */
export function getMessages() {
  return request.get('/messages')
}

/** 提交留言 */
export function submitMessage(data) {
  return request.post('/messages', data)
}

// ==================== 后台管理 ====================

/** 后台留言分页 */
export function adminGetMessages(params) {
  return request.get('/admin/messages', { params })
}

/** 修改留言状态（1 通过 / 2 拒绝） */
export function adminUpdateMessageStatus(id, status) {
  return request.put(`/admin/messages/${id}/status`, null, { params: { status } })
}

/** 删除留言 */
export function adminDeleteMessage(id) {
  return request.delete(`/admin/messages/${id}`)
}
