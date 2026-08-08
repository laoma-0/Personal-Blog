<template>
  <div class="container">
    <article v-loading="loading" class="detail-wrap">
      <template v-if="article">
        <!-- 标题区 -->
        <header class="article-head fade-up">
          <h1 class="title">{{ article.title }}</h1>
          <div class="meta">
            <span> {{ formatDate(article.createTime) }}</span>
            <span>👁 {{ article.readCount }} 阅读</span>
            <span :class="{ liked }">{{ liked ? '♥' : '♡' }} {{ article.likeCount }}</span>
          </div>
        </header>

        <!-- 正文卡片 -->
        <div class="content card fade-up">
          <p v-if="article.summary" class="summary">{{ article.summary }}</p>
          <div class="markdown-body" v-html="renderedContent"></div>
        </div>

        <!-- 底部操作 -->
        <div class="actions fade-up">
          <button
            class="like-btn"
            :class="{ liked }"
            :disabled="liking"
            @click="handleLike"
          >
            <span class="heart">{{ liked ? '♥' : '♡' }}</span>
            <span>{{ liked ? '已赞' : '点赞' }} {{ article.likeCount }}</span>
          </button>
          <el-button round @click="$router.push('/')">← 返回首页</el-button>
        </div>

        <!-- 评论区 -->
        <section class="comments fade-up">
          <h2 class="comments-title">评论 <span class="count">{{ comments.length }}</span></h2>

          <!-- 评论表单 -->
          <div class="card comment-form">
            <el-form ref="commentFormRef" :model="commentForm" :rules="commentRules" label-position="top">
              <div class="form-row">
                <el-form-item label="昵称" prop="nickname" class="col">
                  <el-input v-model="commentForm.nickname" placeholder="怎么称呼你？" maxlength="50" />
                </el-form-item>
                <el-form-item label="邮箱（选填）" prop="email" class="col">
                  <el-input v-model="commentForm.email" placeholder="留下邮箱方便回复" />
                </el-form-item>
              </div>
              <el-form-item label="评论内容" prop="content">
                <el-input
                  v-model="commentForm.content"
                  type="textarea"
                  :rows="3"
                  placeholder="说点什么吧…"
                  maxlength="1000"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" round :loading="commentSubmitting" @click="handleComment">
                  发表评论
                </el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 评论列表 -->
          <div v-loading="commentLoading" class="comment-list">
            <div v-for="c in comments" :key="c.id" class="comment-item">
              <div class="c-avatar">{{ c.nickname.charAt(0) }}</div>
              <div class="c-body">
                <div class="c-head">
                  <span class="c-name">{{ c.nickname }}</span>
                  <span class="c-time">{{ formatDate(c.createTime) }}</span>
                </div>
                <div class="c-text">{{ c.content }}</div>
              </div>
            </div>
            <el-empty v-if="!commentLoading && comments.length === 0" description="还没有评论，来抢沙发吧～" />
          </div>
        </section>
      </template>

      <el-empty v-if="!loading && !article" description="文章不存在" />
    </article>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { ElMessage } from 'element-plus'
import { getArticleDetail, likeArticle, unlikeArticle } from '@/api/article'
import { getArticleComments, submitComment } from '@/api/comment'

const route = useRoute()
const article = ref(null)
const loading = ref(false)
const liked = ref(false)
const liking = ref(false)

// 评论相关
const comments = ref([])
const commentLoading = ref(false)
const commentSubmitting = ref(false)
const commentFormRef = ref()
const commentForm = reactive({ nickname: '', email: '', content: '' })
const commentRules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
  content: [{ required: true, message: '请输入评论内容', trigger: 'blur' }]
}

const LIKED_KEY = 'liked_articles'

marked.setOptions({ breaks: true, gfm: true })

const renderedContent = computed(() => {
  if (!article.value?.content) return ''
  return marked.parse(article.value.content)
})

function formatDate(val) {
  if (!val) return ''
  return String(val).slice(0, 10)
}

/** 读取本机已点赞的文章 id 列表 */
function getLikedIds() {
  try {
    return JSON.parse(localStorage.getItem(LIKED_KEY) || '[]')
  } catch {
    return []
  }
}

/** 把某文章 id 从本机已点赞列表移除 */
function removeLikedId(id) {
  const ids = getLikedIds().filter(x => x !== String(id))
  localStorage.setItem(LIKED_KEY, JSON.stringify(ids))
}

async function handleLike() {
  if (liking.value) return
  liking.value = true
  try {
    const id = route.params.id
    if (liked.value) {
      // 已赞 → 取消点赞
      const newCount = await unlikeArticle(id)
      article.value.likeCount = typeof newCount === 'number'
        ? newCount
        : Math.max(0, (article.value.likeCount || 0) - 1)
      removeLikedId(id)
      liked.value = false
      ElMessage.info('已取消点赞')
    } else {
      // 未赞 → 点赞
      const newCount = await likeArticle(id)
      article.value.likeCount = typeof newCount === 'number'
        ? newCount
        : (article.value.likeCount || 0) + 1
      const ids = getLikedIds()
      ids.push(String(id))
      localStorage.setItem(LIKED_KEY, JSON.stringify(ids))
      liked.value = true
      ElMessage.success('感谢点赞 ♥')
    }
  } finally {
    liking.value = false
  }
}

async function load() {
  loading.value = true
  try {
    article.value = await getArticleDetail(route.params.id)
    // 恢复本机是否已点赞的状态
    liked.value = getLikedIds().includes(String(route.params.id))
  } finally {
    loading.value = false
  }
  loadComments()
}

/** 加载本文已审核的评论 */
async function loadComments() {
  commentLoading.value = true
  try {
    comments.value = await getArticleComments(route.params.id)
  } finally {
    commentLoading.value = false
  }
}

/** 提交评论 */
async function handleComment() {
  await commentFormRef.value.validate(async (valid) => {
    if (!valid) return
    commentSubmitting.value = true
    try {
      await submitComment({
        articleId: Number(route.params.id),
        nickname: commentForm.nickname,
        email: commentForm.email,
        content: commentForm.content
      })
      ElMessage.success('评论提交成功，审核通过后将显示')
      commentForm.nickname = ''
      commentForm.email = ''
      commentForm.content = ''
    } finally {
      commentSubmitting.value = false
    }
  })
}

onMounted(load)
</script>

<style scoped>
.detail-wrap {
  padding: var(--space-2xl) 0;
  max-width: 800px;
  margin: 0 auto;
}

.article-head {
  text-align: center;
  margin-bottom: var(--space-xl);
}
.title {
  font-size: var(--font-h1);
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: var(--space-md);
  color: var(--color-text-primary);
}
.meta {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  color: var(--color-text-secondary);
  font-size: var(--font-caption);
}

.content {
  padding: var(--space-2xl);
}
.summary {
  color: var(--color-text-regular);
  font-size: var(--font-body-lg);
  padding: var(--space-md) var(--space-lg);
  margin-bottom: var(--space-xl);
  background: var(--gradient-soft);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-primary);
}

.actions {
  margin-top: var(--space-xl);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-md);
}

/* meta 里已点赞的爱心变色 */
.meta .liked {
  color: var(--color-morandi-pink, #c9aeb0);
}

/* 点赞按钮 */
.like-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 22px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-card, #fff);
  color: var(--color-text-regular);
  font-size: var(--font-body);
  cursor: pointer;
  transition: all 0.4s ease;
}
.like-btn:hover:not(:disabled) {
  border-color: var(--color-morandi-pink, #c9aeb0);
  color: var(--color-morandi-pink, #c9aeb0);
  transform: translateY(-2px);
}
.like-btn .heart {
  font-size: 18px;
  transition: transform 0.3s ease;
}
.like-btn:active:not(:disabled) .heart {
  transform: scale(1.4);
}
.like-btn.liked {
  border-color: var(--color-morandi-pink, #c9aeb0);
  background: var(--color-primary-light, #f5eaea);
  color: var(--color-morandi-pink, #c9aeb0);
}

/* ===== Markdown 正文排版 ===== */
.markdown-body {
  color: var(--color-text-primary);
  line-height: var(--line-height-body);
  font-size: var(--font-body-lg);
}
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  font-weight: 500;
  line-height: 1.6;
  margin: var(--space-xl) 0 var(--space-md);
  color: var(--color-text-primary);
}
.markdown-body :deep(h1) { font-size: var(--font-h2); }
.markdown-body :deep(h2) {
  font-size: var(--font-h3);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-border-light);
}
.markdown-body :deep(h3) { font-size: var(--font-body-lg); }
.markdown-body :deep(p) { margin: var(--space-md) 0; }
.markdown-body :deep(a) { color: var(--color-primary-active); border-bottom: 1px solid var(--color-primary-light); }
.markdown-body :deep(ul),
.markdown-body :deep(ol) { padding-left: var(--space-lg); margin: var(--space-md) 0; }
.markdown-body :deep(li) { margin: var(--space-xs) 0; }
.markdown-body :deep(blockquote) {
  margin: var(--space-md) 0;
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-primary-light);
  border-left: 3px solid var(--color-primary);
  border-radius: var(--radius-sm);
  color: var(--color-text-regular);
}
.markdown-body :deep(code) {
  background: var(--color-bg-page);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "JetBrains Mono", Consolas, Monaco, monospace;
  font-size: 0.9em;
  color: var(--color-morandi-purple);
}
.markdown-body :deep(pre) {
  background: #2E3033;
  color: #E8E6E3;
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: var(--space-md) 0;
}
.markdown-body :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}
.markdown-body :deep(img) {
  border-radius: var(--radius-md);
  margin: var(--space-md) 0;
}
.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: var(--space-xl) 0;
}

/* ===== 评论区 ===== */
.comments {
  margin-top: var(--space-3xl);
}
.comments-title {
  font-size: var(--font-h2);
  font-weight: 500;
  margin-bottom: var(--space-lg);
}
.comments-title .count {
  color: var(--color-text-secondary);
  font-size: var(--font-body);
  margin-left: 4px;
}
.comment-form {
  padding: var(--space-xl);
  margin-bottom: var(--space-xl);
}
.comment-form .form-row {
  display: flex;
  gap: var(--space-lg);
}
.comment-form .form-row .col {
  flex: 1;
}
.comment-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}
.comment-item {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--color-bg-card, #fff);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}
.c-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-body);
  flex-shrink: 0;
  filter: saturate(0.9);
}
.c-body { flex: 1; min-width: 0; }
.c-head {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
  margin-bottom: var(--space-xs);
}
.c-name { font-weight: 500; }
.c-time { font-size: var(--font-caption); color: var(--color-text-secondary); }
.c-text {
  color: var(--color-text-regular);
  line-height: var(--line-height-body);
  word-break: break-word;
}

@media (max-width: 640px) {
  .comment-form .form-row { flex-direction: column; gap: 0; }
}
</style>
