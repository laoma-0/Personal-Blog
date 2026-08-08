<template>
  <div class="login-page">
    <div class="login-card card">
      <div class="login-brand">◍ 博客后台</div>
      <p class="login-tip">登录以管理你的博客</p>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @keyup.enter="handleLogin"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-button
          type="primary"
          class="login-btn"
          :loading="loading"
          @click="handleLogin"
        >
          登 录
        </el-button>
      </el-form>
      <p class="login-hint">默认账号：admin / 123456</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)
const form = reactive({
  username: 'admin',
  password: ''
})
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function handleLogin() {
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    try {
      await userStore.login({ username: form.username, password: form.password })
      ElMessage.success('登录成功')
      const redirect = route.query.redirect || '/admin/dashboard'
      router.push(redirect)
    } catch (e) {
      // 错误提示已在响应拦截器处理
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-soft);
  padding: var(--space-lg);
}
.login-card {
  width: 380px;
  max-width: 100%;
  padding: var(--space-xl);
}
.login-brand {
  font-size: var(--font-h2);
  font-weight: 500;
  text-align: center;
  letter-spacing: 0.05em;
}
.login-tip {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-caption);
  margin: var(--space-sm) 0 var(--space-xl);
}
.login-btn {
  width: 100%;
  margin-top: var(--space-sm);
}
.login-hint {
  text-align: center;
  color: var(--color-text-placeholder);
  font-size: var(--font-caption);
  margin-top: var(--space-lg);
}
</style>
