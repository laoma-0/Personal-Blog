<template>
  <div class="container page">
    <header class="page-head fade-up">
      <h1>留言板</h1>
      <p>有什么想说的，都可以留在这里 🌿</p>
    </header>

    <!-- 留言表单 -->
    <div class="card form-card fade-up">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="form-row">
          <el-form-item label="昵称" prop="nickname" class="col">
            <el-input v-model="form.nickname" placeholder="怎么称呼你？" maxlength="50" />
          </el-form-item>
          <el-form-item label="邮箱（选填）" prop="email" class="col">
            <el-input v-model="form.email" placeholder="留下邮箱方便回复" />
          </el-form-item>
        </div>
        <el-form-item label="留言内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
            placeholder="写下你的留言…"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round :loading="submitting" @click="handleSubmit">
            发表留言
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 留言列表 -->
    <div v-loading="loading" class="message-list">
      <div v-for="msg in messages" :key="msg.id" class="card message-item fade-up">
        <div class="avatar">{{ msg.nickname.charAt(0) }}</div>
        <div class="body">
          <div class="msg-head">
            <span class="name">{{ msg.nickname }}</span>
            <span class="time">{{ formatDate(msg.createTime) }}</span>
          </div>
          <div class="text">{{ msg.content }}</div>
        </div>
      </div>

      <el-empty v-if="!loading && messages.length === 0" description="还没有留言，来抢沙发吧～" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMessages, submitMessage } from '@/api/message'

const formRef = ref()
const form = reactive({ nickname: '', email: '', content: '' })
const rules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
  content: [{ required: true, message: '请输入留言内容', trigger: 'blur' }]
}
const submitting = ref(false)

const messages = ref([])
const loading = ref(false)

function formatDate(val) {
  if (!val) return ''
  return String(val).slice(0, 10)
}

async function handleSubmit() {
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      await submitMessage({ ...form })
      ElMessage.success('留言提交成功，审核通过后将显示')
      form.nickname = ''
      form.email = ''
      form.content = ''
    } finally {
      submitting.value = false
    }
  })
}

async function load() {
  loading.value = true
  try {
    messages.value = await getMessages()
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.page {
  padding-top: var(--space-2xl);
  min-height: 60vh;
  max-width: 720px;
}
.page-head {
  text-align: center;
  margin-bottom: var(--space-xl);
}
.page-head h1 {
  font-size: var(--font-h1);
  font-weight: 500;
  margin-bottom: var(--space-sm);
}
.page-head p {
  color: var(--color-text-secondary);
}

.form-card {
  padding: var(--space-xl);
  margin-bottom: var(--space-2xl);
}
.form-row {
  display: flex;
  gap: var(--space-lg);
}
.form-row .col {
  flex: 1;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding-bottom: var(--space-3xl);
}
.message-item {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-lg);
}
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-body-lg);
  flex-shrink: 0;
  filter: saturate(0.9);
}
.body { flex: 1; min-width: 0; }
.msg-head {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
  margin-bottom: var(--space-xs);
}
.name { font-weight: 500; }
.time { font-size: var(--font-caption); color: var(--color-text-secondary); }
.text {
  color: var(--color-text-regular);
  line-height: var(--line-height-body);
  word-break: break-word;
}

@media (max-width: 640px) {
  .form-row { flex-direction: column; gap: 0; }
}
</style>
