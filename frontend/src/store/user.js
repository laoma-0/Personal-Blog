import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi } from '@/api/auth'

/**
 * 用户状态：登录、token、用户信息
 */
export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(null)

  async function login(loginForm) {
    const data = await loginApi(loginForm)
    token.value = data.token
    userInfo.value = data
    localStorage.setItem('token', data.token)
    return data
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return { token, userInfo, login, logout }
})
