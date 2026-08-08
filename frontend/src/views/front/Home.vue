<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner container">
        <h1 class="breathe">读书人，当为天地立心，为生民立命，为往圣继绝学，为万世开太平</h1>
        <p>一个软件工程学生的技术笔记与生活随笔</p>
      </div>
    </section>

    <!-- 主体：两栏布局 -->
    <div class="container">
      <div class="layout-two-col">
        <!-- 左侧主内容 -->
        <main>
          <!-- 分类筛选提示 -->
          <div v-if="currentCategoryName" class="filter-bar fade-up">
            <span>正在浏览分类：<b>{{ currentCategoryName }}</b></span>
            <a class="clear-filter" @click="clearFilter">✕ 清除筛选</a>
          </div>

          <!-- 搜索结果提示 -->
          <div v-if="currentKeyword" class="filter-bar fade-up">
            <span>搜索「<b>{{ currentKeyword }}</b>」的结果，共 {{ total }} 篇</span>
            <a class="clear-filter" @click="clearFilter">✕ 清除搜索</a>
          </div>

          <div v-loading="loading">
            <!-- 置顶大卡 -->
            <article
              v-if="featured"
              class="card featured fade-up"
              @click="goDetail(featured.id)"
            >
              <div class="cover" :style="coverStyle(featured)">
                <span class="pin">📌 置顶</span>
              </div>
              <div class="body">
                <div class="meta">
                  <span v-if="featured.categoryName" class="tag">{{ featured.categoryName }}</span>
                </div>
                <h2>{{ featured.title }}</h2>
                <p class="excerpt">{{ featured.summary }}</p>
                <div class="meta">
                  <span><el-icon><Calendar /></el-icon> {{ formatDate(featured.createTime) }}</span>
                  <span>👁 {{ featured.readCount }} 阅读</span>
                  <span>♡ {{ featured.likeCount }}</span>
                </div>
              </div>
            </article>

            <!-- 文章列表 -->
            <div class="article-list">
              <article
                v-for="article in normalArticles"
                :key="article.id"
                class="card article-card fade-up"
                @click="goDetail(article.id)"
              >
                <div class="cover" :style="coverStyle(article)"></div>
                <div class="body">
                  <h3 class="title">{{ article.title }}</h3>
                  <p class="excerpt">{{ article.summary }}</p>
                  <div class="meta">
                    <span v-if="article.categoryName" class="tag">{{ article.categoryName }}</span>
                    <span><el-icon><Calendar /></el-icon> {{ formatDate(article.createTime) }}</span>
                    <span>👁 {{ article.readCount }}</span>
                    <span>♡ {{ article.likeCount }}</span>
                  </div>
                </div>
              </article>

              <el-empty
                v-if="!loading && articles.length === 0"
                :description="currentKeyword ? `没有找到与「${currentKeyword}」相关的文章` : '还没有文章'"
              />
            </div>

            <!-- 分页 -->
            <div v-if="total > pageSize" class="pager">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                :page-size="pageSize"
                :current-page="pageNum"
                @current-change="handlePageChange"
              />
            </div>
          </div>
        </main>

        <!-- 右侧边栏 -->
        <aside class="sidebar">
          <!-- 作者卡 -->
          <div class="card widget author fade-up">
            <div class="avatar breathe" ></div>
            <div class="name">{{ site.author || '博主' }}</div>
            <div class="intro">{{ site.intro || '一个软件工程学生的技术笔记与生活随笔' }}</div>
            <div class="stats">
              <div><b>{{ site.articleCount ?? 0 }}</b><span>文章</span></div>
              <div><b>{{ site.tagCount ?? 0 }}</b><span>标签</span></div>
              <div><b>{{ formatViews(site.viewCount) }}</b><span>访问</span></div>
            </div>
          </div>

          <!-- 标签云 -->
          <div class="card widget fade-up">
            <h4>标签云</h4>
            <div class="tag-cloud">
              <span
                v-for="t in tags"
                :key="t.id"
                class="tag"
                :style="t.color ? { background: hexToSoft(t.color), color: t.color } : {}"
              >{{ t.name }}</span>
              <span v-if="tags.length === 0" class="empty-hint">暂无标签</span>
            </div>
          </div>

          <!-- 最新评论 -->
          <div class="card widget fade-up">
            <h4>最新评论</h4>
            <ul class="recent-comments">
              <li v-for="c in comments" :key="c.id">
                {{ c.nickname }}：{{ c.content }}
              </li>
              <li v-if="comments.length === 0" class="empty-hint">暂无评论</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getArticleList } from '@/api/article'
import { getCategories } from '@/api/category'
import { getTags } from '@/api/tag'
import { getSiteStats } from '@/api/site'
import { getRecentComments } from '@/api/comment'

const router = useRouter()
const route = useRoute()

const articles = ref([])
const loading = ref(false)
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)
const currentCategoryName = ref('')

// 当前搜索关键词（跟随地址栏 ?keyword=）
const currentKeyword = computed(() => route.query.keyword || '')

// 侧边栏数据
const site = ref({})
const tags = ref([])
const comments = ref([])

// 置顶大卡（列表中第一篇 isTop 文章，且仅在未筛选/首页时展示）
const featured = computed(() => articles.value.find(a => a.isTop === 1) || null)
// 其余文章（排除置顶大卡那篇）
const normalArticles = computed(() => {
  const f = featured.value
  return f ? articles.value.filter(a => a.id !== f.id) : articles.value
})

// 莫兰迪水彩封面（无封面图时按 id 取不同渐变）
const covers = [
  'linear-gradient(135deg,#E8EEF2,#D9E6E4)',
  'linear-gradient(135deg,#F3ECEF,#E8D8DB)',
  'linear-gradient(135deg,#EDF0EA,#DCE4D2)',
  'linear-gradient(135deg,#EFEAF0,#E1D8E6)'
]
function coverStyle(article) {
  if (article.cover) {
    return { backgroundImage: `url(${article.cover})`, backgroundSize: 'cover' }
  }
  return { background: covers[article.id % covers.length] }
}

function formatDate(val) {
  if (!val) return ''
  return String(val).slice(0, 10)
}

// 访问量：>=1000 显示 1.2k
function formatViews(v) {
  const n = Number(v || 0)
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n
}

// 把标签的 hex 颜色转成淡背景（叠一层低透明度）
function hexToSoft(hex) {
  const h = hex.replace('#', '')
  if (h.length !== 6) return 'var(--color-primary-light)'
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},0.14)`
}

async function loadArticles() {
  loading.value = true
  try {
    const categoryId = route.query.categoryId ? Number(route.query.categoryId) : undefined
    const keyword = route.query.keyword || undefined
    const data = await getArticleList({ pageNum: pageNum.value, pageSize: pageSize.value, categoryId, keyword })
    articles.value = data.records || []
    total.value = data.total || 0
  } finally {
    loading.value = false
  }
}

// 根据 query.categoryId 解析分类名（用于筛选提示）
async function resolveCategoryName() {
  const categoryId = route.query.categoryId
  if (!categoryId) {
    currentCategoryName.value = ''
    return
  }
  try {
    const list = await getCategories()
    const found = (list || []).find(c => String(c.id) === String(categoryId))
    currentCategoryName.value = found ? found.name : ''
  } catch {
    currentCategoryName.value = ''
  }
}

// 侧边栏数据加载
async function loadSidebar() {
  try {
    site.value = (await getSiteStats()) || {}
  } catch {
    site.value = {}
  }
  try {
    tags.value = (await getTags()) || []
  } catch {
    tags.value = []
  }
  try {
    comments.value = (await getRecentComments()) || []
  } catch {
    comments.value = []
  }
}

function clearFilter() {
  router.push('/')
}

function handlePageChange(p) {
  pageNum.value = p
  loadArticles()
}

function goDetail(id) {
  router.push(`/article/${id}`)
}

// 路由 query 变化时（分类筛选 / 搜索关键词）重新加载
watch(
  () => [route.query.categoryId, route.query.keyword],
  () => {
    pageNum.value = 1
    loadArticles()
    resolveCategoryName()
  }
)

onMounted(() => {
  loadArticles()
  resolveCategoryName()
  loadSidebar()
})
</script>

<style scoped>
.hero {
  padding: var(--space-3xl) 0 var(--space-2xl);
  min-height: clamp(280px, 32vw, 460px);
  display: flex;
  align-items: center;
  text-align: center;
  background: var(--gradient-header);
  background-image: url('/bg1.png');
  background-size: cover;
  background-position: center 28%;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute; inset: 0;
  background:
    linear-gradient(rgba(255,255,255,0.55), rgba(255,255,255,0.55)),
    radial-gradient(circle at 25% 30%, rgba(157,184,182,0.35) 0%, transparent 55%),
    radial-gradient(circle at 78% 65%, rgba(201,174,176,0.30) 0%, transparent 55%);
}
.hero-inner { position: relative; z-index: 1; width: 100%; }
.hero h1 {
  font-size: 40px; font-weight: 500;
  letter-spacing: 0.03em; margin-bottom: var(--space-md);
  color: var(--color-text-primary);
}
.hero p { color: var(--color-text-secondary); font-size: var(--font-body-lg); }

/* 两栏布局 */
.layout-two-col {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: var(--space-xl);
  padding: var(--space-2xl) 0;
  align-items: start;
}

/* 分类筛选提示 */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
  padding: var(--space-md) var(--space-lg);
  background: var(--gradient-header);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-size: var(--font-body);
}
.filter-bar b { color: var(--color-text-primary); font-weight: 500; }
.clear-filter {
  cursor: pointer;
  color: var(--color-primary-active);
  font-size: var(--font-caption);
  transition: opacity var(--dur-base) ease;
}
.clear-filter:hover { opacity: 0.7; }

/* 置顶文章大卡 */
.featured {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: var(--space-xl);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
  overflow: hidden;
  cursor: pointer;
}
.featured .cover {
  aspect-ratio: 16/10;
  border-radius: var(--radius-md);
  position: relative;
  filter: saturate(0.9);
}
.featured .cover .pin {
  position: absolute; top: 12px; left: 12px;
  background: rgba(255,255,255,0.85);
  color: var(--color-primary-active);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--font-caption);
}
.featured .body { display: flex; flex-direction: column; justify-content: center; gap: var(--space-md); min-width: 0; }
.featured h2 { font-size: var(--font-h2); font-weight: 500; }
.featured .excerpt {
  color: var(--color-text-regular);
  line-height: var(--line-height-body);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 文章卡片列表 */
.article-list { display: flex; flex-direction: column; gap: var(--space-xl); }
.article-card {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: var(--space-lg);
  padding: var(--space-lg);
  overflow: hidden;
  cursor: pointer;
}
.article-card .cover {
  aspect-ratio: 16/10;
  border-radius: var(--radius-md);
  filter: saturate(0.9);
}
.article-card .body {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  justify-content: center;
  min-width: 0;
}
.article-card .title { font-size: var(--font-h3); font-weight: 500; }
.article-card .excerpt {
  color: var(--color-text-secondary);
  font-size: var(--font-body);
  line-height: var(--line-height-body);
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.meta {
  display: flex;
  gap: var(--space-md);
  color: var(--color-text-secondary);
  font-size: var(--font-caption);
  align-items: center;
  flex-wrap: wrap;
}

.pager {
  display: flex;
  justify-content: center;
  padding-top: var(--space-2xl);
}

/* 侧边栏 */
.sidebar { display: flex; flex-direction: column; gap: var(--space-xl); }
.widget { padding: var(--space-lg); }
.widget h4 {
  font-size: var(--font-body-lg);
  font-weight: 500;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-border-light);
}
.author { text-align: center; }
.author .avatar {
  width: 80px; height: 80px;
  border-radius: 50%;
  margin: 0 auto var(--space-md);
  background: var(--gradient-primary);
  background-image: url('/tx.jpg');
  background-size: cover;
}
.author .name { font-size: var(--font-body-lg); font-weight: 500; }
.author .intro { color: var(--color-text-secondary); font-size: var(--font-caption); margin-top: var(--space-xs); }
.author .stats { display: flex; justify-content: space-around; margin-top: var(--space-md); }
.author .stats b { display: block; font-size: var(--font-h3); font-weight: 500; color: var(--color-primary); }
.author .stats span { font-size: var(--font-caption); color: var(--color-text-secondary); }
.tag-cloud { display: flex; flex-wrap: wrap; gap: var(--space-sm); }
.recent-comments li {
  list-style: none;
  padding: var(--space-sm) 0;
  border-bottom: 1px dashed var(--color-border-light);
  font-size: var(--font-caption);
  color: var(--color-text-regular);
}
.recent-comments li:last-child { border: none; }
.empty-hint { color: var(--color-text-placeholder); font-size: var(--font-caption); }

/* 响应式：窄屏降为单栏，侧边栏移到下方 */
@media (max-width: 992px) {
  .layout-two-col { grid-template-columns: 1fr; }
  .sidebar { order: 2; }
}
@media (max-width: 768px) {
  .featured, .article-card { grid-template-columns: 1fr; }
  .featured .cover, .article-card .cover { max-height: 180px; }
}
</style>
