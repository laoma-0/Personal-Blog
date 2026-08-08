import request from '@/utils/request'

/**
 * 发送一条消息给 AI 助手，返回回复文本
 * @param {string} message 用户输入
 */
export function sendChat(message) {
  return request.post('/ai/chat', { message })
}
