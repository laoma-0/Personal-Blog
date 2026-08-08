import Taro from '@tarojs/taro'
import { BASE_URL, API_PREFIX, REQUEST_TIMEOUT } from '../config'

/**
 * 剔除值为 undefined / null / 空字符串的参数
 * 否则 Taro.request 会把 undefined 序列化成字符串 "undefined" 拼进 URL，
 * 后端 Long 类型参数接到 "undefined" 会转换异常（返回 code:500）。
 */
function cleanParams(data) {
  if (!data || typeof data !== 'object') return data
  const out = {}
  Object.keys(data).forEach((k) => {
    const v = data[k]
    if (v !== undefined && v !== null && v !== '') out[k] = v
  })
  return out
}

/**
 * 统一请求封装
 * - 自动拼接 baseURL + /api 前缀
 * - 请求前清洗空参数
 * - 解包后端 Result<T>：{ code, message, data }，code === 200 为成功
 * - 失败统一 Toast 提示并 reject
 */
function request(options) {
  const { url, method = 'GET', data, header = {} } = options
  const cleaned = cleanParams(data)
  const fullUrl = `${BASE_URL}${API_PREFIX}${url}`

  return new Promise((resolve, reject) => {
    Taro.request({
      url: fullUrl,
      method,
      data: cleaned,
      timeout: REQUEST_TIMEOUT,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      success: (res) => {
        const { statusCode, data: body } = res
        if (statusCode !== 200) {
          showError(`网络错误 ${statusCode}`)
          return reject(new Error(`HTTP ${statusCode}`))
        }
        // 后端 Result：code === 200 成功（见 backend ResultCode.SUCCESS）
        if (body && body.code === 200) {
          resolve(body.data)
        } else {
          const msg = (body && body.message) || '请求失败'
          showError(msg)
          reject(new Error(msg))
        }
      },
      fail: (err) => {
        showError('网络连接失败：' + (err && err.errMsg ? err.errMsg : ''))
        reject(err)
      }
    })
  })
}

function showError(msg) {
  Taro.showToast({ title: msg, icon: 'none', duration: 2000 })
}

export const get = (url, data) => request({ url, method: 'GET', data })
export const post = (url, data) => request({ url, method: 'POST', data })
export const del = (url, data) => request({ url, method: 'DELETE', data })

export default request
