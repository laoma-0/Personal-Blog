import request from '@/utils/request'

/** 仪表盘概览 */
export function getDashboard() {
  return request.get('/admin/dashboard')
}
