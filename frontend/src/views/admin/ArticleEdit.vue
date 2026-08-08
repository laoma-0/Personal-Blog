<template>
  <div v-loading="loading">
    <div class="page-head">
      <h1 class="page-title">{{ isEdit ? '编辑文章' : '写文章' }}</h1>
      <div>
        <el-button @click="goBack">返回</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </div>
    </div>

    <div class="card form-card">
      <el-form :model="form" label-width="72px">
        <el-form-item label="标题" required>
          <el-input v-model="form.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input
            v-model="form.summary"
            type="textarea"
            :rows="2"
            placeholder="一句话摘要（列表页展示）"
          />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="分类" required>
              <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%">
                <el-option
                  v-for="c in categories"
                  :key="c.id"
                  :label="c.name"
                  :value="c.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio-button :value="1">发布</el-radio-button>
                <el-radio-button :value="0">草稿</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="置顶">
              <el-switch v-model="form.isTop" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="封面">
          <div class="cover-uploader">
            <el-upload
              :show-file-list="false"
              :http-request="uploadCover"
              :before-upload="beforeCoverUpload"
              accept="image/*"
              class="cover-upload-box"
            >
              <img v-if="form.cover" :src="form.cover" class="cover-preview" />
              <div v-else class="cover-placeholder">
                <el-icon><Plus /></el-icon>
                <span>上传封面</span>
              </div>
            </el-upload>
            <div class="cover-tip">
              <span>支持 jpg/png/gif/webp，≤ 5MB</span>
              <el-button v-if="form.cover" link type="danger" @click="form.cover = ''">移除</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- Markdown 编辑区 -->
    <div class="card editor-card">
      <div class="editor-head">
        <span>正文（Markdown）</span>
        <div class="editor-toolbar">
          <el-button size="small" :icon="Picture" :loading="imgUploading" @click="triggerInsertImage">
            插入图片
          </el-button>
          <span class="toolbar-tip">也可直接粘贴（Ctrl+V）截图</span>
        </div>
      </div>
      <input
        ref="contentImageInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="onContentImageChange"
      />
      <div class="editor-split">
        <el-input
          ref="contentTextarea"
          v-model="form.content"
          type="textarea"
          class="md-input"
          placeholder="在此输入 Markdown 内容…（支持粘贴图片）"
          resize="none"
          @paste="onContentPaste"
        />
        <div class="md-preview markdown-body" v-html="previewHtml"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import {
  adminGetArticle, adminCreateArticle, adminUpdateArticle
} from '@/api/article'
import { getCategories } from '@/api/category'
import { ElMessage } from 'element-plus'
import { Plus, Picture } from '@element-plus/icons-vue'
import request from '@/utils/request'

marked.setOptions({ breaks: true, gfm: true })

const route = useRoute()
const router = useRouter()

const id = route.params.id
const isEdit = computed(() => !!id)

const loading = ref(false)
const saving = ref(false)
const categories = ref([])

const form = reactive({
  title: '',
  summary: '',
  content: '',
  cover: '',
  categoryId: null,
  status: 1,
  isTop: 0
})

const previewHtml = computed(() => marked.parse(form.content || ''))

// 图片校验（类型 + 大小），封面和正文插图共用
function checkImage(file) {
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('只能上传图片文件')
    return false
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过 5MB')
    return false
  }
  return true
}

// 公共上传：走 request 封装（自动带 token），返回图片 URL
async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// el-upload before-upload 钩子（封面）
function beforeCoverUpload(file) {
  return checkImage(file)
}

// 封面自定义上传：上传成功回填 form.cover
async function uploadCover(options) {
  try {
    const url = await uploadImage(options.file)
    form.cover = url
    ElMessage.success('封面上传成功')
    options.onSuccess && options.onSuccess(url)
  } catch (e) {
    options.onError && options.onError(e)
  }
}

// ===== 正文插图 =====
const contentTextarea = ref(null)
const contentImageInput = ref(null)
const imgUploading = ref(false)

// 点击工具栏「插入图片」→ 触发隐藏 file input
function triggerInsertImage() {
  contentImageInput.value && contentImageInput.value.click()
}

// 选文件后上传并插入
async function onContentImageChange(e) {
  const file = e.target.files && e.target.files[0]
  e.target.value = '' // 清空，允许再次选同一文件
  if (!file) return
  await uploadAndInsert(file)
}

// textarea 粘贴：若剪贴板含图片则上传并插入
async function onContentPaste(e) {
  const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items
  if (!items) return
  for (const item of items) {
    if (item.type && item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        e.preventDefault() // 阻止默认粘贴（避免贴入乱码/base64）
        await uploadAndInsert(file)
      }
      break
    }
  }
}

// 上传图片并在光标处插入 Markdown 图片语法
async function uploadAndInsert(file) {
  if (!checkImage(file)) return
  imgUploading.value = true
  try {
    const url = await uploadImage(file)
    const md = `\n![${file.name || 'image'}](${url})\n`
    insertAtCursor(md)
    ElMessage.success('图片已插入正文')
  } catch (e) {
    // 错误提示已由 request 拦截器统一处理
  } finally {
    imgUploading.value = false
  }
}

// 在 textarea 当前光标位置插入文本（保持 v-model 同步）
function insertAtCursor(text) {
  const inner = contentTextarea.value?.textarea // el-input 的原生 textarea
  if (!inner) {
    form.content += text
    return
  }
  const start = inner.selectionStart
  const end = inner.selectionEnd
  const val = form.content || ''
  form.content = val.slice(0, start) + text + val.slice(end)
  // 光标移到插入内容之后
  requestAnimationFrame(() => {
    const pos = start + text.length
    inner.focus()
    inner.setSelectionRange(pos, pos)
  })
}

function goBack() {
  router.push('/admin/articles')
}

async function loadCategories() {
  categories.value = await getCategories()
}

async function loadArticle() {
  loading.value = true
  try {
    const data = await adminGetArticle(id)
    form.title = data.title
    form.summary = data.summary
    form.content = data.content
    form.cover = data.cover
    form.categoryId = data.categoryId
    form.status = data.status
    form.isTop = data.isTop
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  if (!form.title.trim()) {
    ElMessage.warning('请输入标题')
    return
  }
  if (!form.content.trim()) {
    ElMessage.warning('请输入正文')
    return
  }
  if (!form.categoryId) {
    ElMessage.warning('请选择分类')
    return
  }
  saving.value = true
  try {
    const payload = {
      title: form.title,
      summary: form.summary,
      content: form.content,
      contentHtml: previewHtml.value,
      cover: form.cover,
      categoryId: form.categoryId,
      status: form.status,
      isTop: form.isTop
    }
    if (isEdit.value) {
      await adminUpdateArticle(id, payload)
    } else {
      await adminCreateArticle(payload)
    }
    ElMessage.success('保存成功')
    router.push('/admin/articles')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadCategories()
  if (isEdit.value) {
    await loadArticle()
  }
})
</script>

<style scoped>
.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
}
.page-title {
  font-size: var(--font-h2);
  font-weight: 500;
}
.form-card {
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
}
.cover-uploader {
  display: flex;
  align-items: flex-end;
  gap: var(--space-md);
}
.cover-upload-box :deep(.el-upload) {
  width: 160px;
  height: 100px;
  border: 1px dashed var(--color-border-light);
  border-radius: var(--radius-sm);
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s;
}
.cover-upload-box :deep(.el-upload:hover) {
  border-color: var(--color-primary);
}
.cover-preview {
  width: 160px;
  height: 100px;
  object-fit: cover;
  display: block;
}
.cover-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--color-text-secondary);
  font-size: var(--font-sm, 13px);
}
.cover-tip {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: var(--color-text-secondary);
}
.editor-card {
  padding: var(--space-lg);
}
.editor-head {
  font-weight: 500;
  margin-bottom: var(--space-md);
  color: var(--color-text-regular);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.editor-toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-sm, 8px);
}
.toolbar-tip {
  font-size: 12px;
  font-weight: 400;
  color: var(--color-text-secondary);
}
.editor-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  min-height: 480px;
}
.md-input :deep(.el-textarea__inner) {
  height: 480px;
  font-family: "Consolas", "Monaco", monospace;
  line-height: 1.8;
}
.md-preview {
  height: 480px;
  overflow-y: auto;
  padding: var(--space-md);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
}

/* Markdown 预览排版 */
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin: 0.8em 0 0.4em;
  font-weight: 500;
  color: var(--color-text-primary);
}
.markdown-body :deep(p) { margin: 0.6em 0; }
.markdown-body :deep(pre) {
  background: #f5f3f0;
  padding: var(--space-md);
  border-radius: var(--radius-sm);
  overflow-x: auto;
}
.markdown-body :deep(code) {
  font-family: "Consolas", "Monaco", monospace;
}
.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--color-primary);
  padding-left: var(--space-md);
  color: var(--color-text-secondary);
}
.markdown-body :deep(img) { border-radius: var(--radius-sm); }

@media (max-width: 992px) {
  .editor-split { grid-template-columns: 1fr; }
}
</style>
