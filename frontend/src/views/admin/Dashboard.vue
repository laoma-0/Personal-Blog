<template>
  <div v-loading="loading">
    <h1 class="page-title">仪表盘</h1>

    <!-- 统计卡 -->
    <div class="stat-grid">
      <div class="card stat-card fade-up">
        <div class="label">文章总数</div>
        <div class="value v-primary">{{ data.articleCount ?? 0 }}</div>
      </div>
      <div class="card stat-card fade-up">
        <div class="label">评论总数</div>
        <div class="value v-green">{{ data.commentCount ?? 0 }}</div>
      </div>
      <div class="card stat-card fade-up">
        <div class="label">留言总数</div>
        <div class="value v-apricot">{{ data.messageCount ?? 0 }}</div>
      </div>
      <div class="card stat-card fade-up">
        <div class="label">总访问量</div>
        <div class="value v-purple">{{ formatViews(data.viewCount) }}</div>
      </div>
    </div>

    <!-- 趋势图（示意占位） -->
    <div class="card chart-card fade-up">
      <h4>近 7 天访问趋势</h4>
      <div class="chart">
        <div v-for="(h, i) in barHeights" :key="i" class="bar" :style="{ height: h + '%' }"></div>
      </div>
      <p class="chart-note">* 趋势为示意展示，接入访问日志后将呈现真实数据</p>
    </div>

    <!-- 最近文章 -->
    <div class="card table-card fade-up">
      <h4>最近文章</h4>
      <el-table :data="data.recentArticles || []" style="width: 100%">
        <el-table-column prop="title" label="标题" min-width="240" show-overflow-tooltip />
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success" effect="light">已发布</el-tag>
            <el-tag v-else type="warning" effect="light">草稿</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="readCount" label="阅读" width="90" />
        <el-table-column label="发布时间" width="180">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <el-button link type="primary" @click="goEdit(row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDashboard } from '@/api/dashboard'

const router = useRouter()
const loading = ref(false)
const data = ref({})

// 趋势图示意高度（静态占位）
const barHeights = [40, 65, 50, 80, 70, 90, 60]

function formatViews(v) {
  if (v == null) return 0
  return v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v
}

function formatTime(t) {
  if (!t) return '—'
  return t.replace('T', ' ').slice(0, 16)
}

function goEdit(id) {
  router.push(`/admin/articles/edit/${id}`)
}

async function load() {
  loading.value = true
  try {
    data.value = await getDashboard()
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.page-title {
  font-size: var(--font-h2);
  font-weight: 500;
  margin-bottom: var(--space-lg);
}

/* 统计卡 */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}
.stat-card {
  padding: var(--space-lg);
}
.stat-card .label {
  color: var(--color-text-secondary);
  font-size: var(--font-caption);
}
.stat-card .value {
  font-size: 32px;
  font-weight: 500;
  margin-top: var(--space-sm);
}
.v-primary { color: var(--color-primary); }
.v-green { color: var(--color-morandi-green); }
.v-apricot { color: var(--color-morandi-apricot); }
.v-purple { color: var(--color-morandi-purple); }

/* 趋势图 */
.chart-card {
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
}
.chart-card h4 {
  font-weight: 500;
  margin-bottom: var(--space-lg);
}
.chart {
  height: 180px;
  border-radius: var(--radius-sm);
  background: linear-gradient(180deg, rgba(138, 166, 184, 0.18) 0%, transparent 100%);
  display: flex;
  align-items: flex-end;
  gap: var(--space-md);
  padding: var(--space-md);
}
.bar {
  flex: 1;
  background: var(--gradient-primary);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  transition: height var(--dur-slower) var(--ease-soft);
}
.chart-note {
  color: var(--color-text-placeholder);
  font-size: var(--font-caption);
  margin-top: var(--space-sm);
}

/* 表格 */
.table-card {
  padding: var(--space-lg);
}
.table-card h4 {
  font-weight: 500;
  margin-bottom: var(--space-lg);
}

@media (max-width: 992px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
