import axios from 'axios'
import { ElMessage } from 'element-plus'

/**
 * Axios 封装
 * - baseURL 为 /api，配合 Vite 代理转发到后端 8080
 * - 请求拦截：自动带上 token
 * - 响应拦截：拆解统一响应体 Result，非 200 code 统一提示
 */
const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 后端统一响应体：{ code, message, data }
    if (res.code === 200) {
      return res.data
    }
    // 未登录 / token 失效
    if (res.code === 401 || res.code === 1002) {
      localStorage.removeItem('token')
      ElMessage.warning(res.message || '请重新登录')
      return Promise.reject(new Error(res.message))
    }
    ElMessage.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message || 'Error'))
  },
  (error) => {
    ElMessage.error(error.message || '网络异常，请稍后再试')
    return Promise.reject(error)
  }
)

export default request
