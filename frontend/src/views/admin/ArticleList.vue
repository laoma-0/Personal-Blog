<template>
  <div>
    <div class="page-head">
      <h1 class="page-title">文章管理</h1>
      <el-button type="primary" @click="goCreate">
        <el-icon><EditPen /></el-icon>&nbsp;写文章
      </el-button>
    </div>

    <!-- 筛选栏 -->
    <div class="card filter-bar">
      <el-input
        v-model="query.keyword"
        placeholder="搜索标题…"
        clearable
        style="width: 240px"
        @keyup.enter="reload"
        @clear="reload"
      />
      <el-select v-model="query.status" placeholder="全部状态" clearable style="width: 140px" @change="reload">
        <el-option label="已发布" :value="1" />
        <el-option label="草稿" :value="0" />
      </el-select>
      <el-button type="primary" plain @click="reload">查询</el-button>
    </div>

    <!-- 表格 -->
    <div class="card table-card" v-loading="loading">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="title" label="标题" min-width="260" show-overflow-tooltip />
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success" effect="light">已发布</el-tag>
            <el-tag v-else type="warning" effect="light">草稿</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="置顶" width="80">
          <template #default="{ row }">
            <el-tag v-if="row.isTop === 1" type="danger" effect="plain" size="small">置顶</el-tag>
            <span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column prop="readCount" label="阅读" width="90" />
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="goEdit(row.id)">编辑</el-button>
            <el-popconfirm title="确定删除这篇文章吗？" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!loading && list.length === 0" description="暂无文章" />

      <div class="pager">
        <el-pagination
          v-model:current-page="query.pageNum"
          :page-size="query.pageSize"
          :total="total"
          layout="prev, pager, next, total"
          background
          @current-change="load"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminGetArticles, adminDeleteArticle } from '@/api/article'
import { ElMessage } from 'element-plus'
import { EditPen } from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  keyword: '',
  status: null
})

function formatTime(t) {
  if (!t) return '—'
  return t.replace('T', ' ').slice(0, 16)
}

function goCreate() {
  router.push('/admin/articles/create')
}
function goEdit(id) {
  router.push(`/admin/articles/edit/${id}`)
}

function reload() {
  query.pageNum = 1
  load()
}

async function load() {
  loading.value = true
  try {
    const res = await adminGetArticles({
      pageNum: query.pageNum,
      pageSize: query.pageSize,
      keyword: query.keyword || undefined,
      status: query.status ?? undefined
    })
    list.value = res.records || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  await adminDeleteArticle(id)
  ElMessage.success('删除成功')
  // 删除后当前页可能空了，回退处理
  if (list.value.length === 1 && query.pageNum > 1) {
    query.pageNum--
  }
  load()
}

onMounted(load)
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
.filter-bar {
  display: flex;
  gap: var(--space-md);
  align-items: center;
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
}
.table-card {
  padding: var(--space-lg);
}
.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-lg);
}
</style>
