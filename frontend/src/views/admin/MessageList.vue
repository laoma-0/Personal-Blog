<template>
  <div>
    <h1 class="page-title">留言管理</h1>

    <div class="card filter-bar">
      <el-select v-model="query.status" placeholder="全部状态" clearable style="width: 160px" @change="reload">
        <el-option label="待审核" :value="0" />
        <el-option label="已通过" :value="1" />
        <el-option label="已拒绝" :value="2" />
      </el-select>
    </div>

    <div class="card table-card" v-loading="loading">
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="nickname" label="昵称" width="140" />
        <el-table-column prop="email" label="邮箱" width="200" show-overflow-tooltip />
        <el-table-column prop="content" label="内容" min-width="260" show-overflow-tooltip />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success" effect="light">已通过</el-tag>
            <el-tag v-else-if="row.status === 2" type="danger" effect="light">已拒绝</el-tag>
            <el-tag v-else type="warning" effect="light">待审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="时间" width="180">
          <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status !== 1" link type="success" @click="setStatus(row.id, 1)">通过</el-button>
            <el-button v-if="row.status !== 2" link type="warning" @click="setStatus(row.id, 2)">拒绝</el-button>
            <el-popconfirm title="确定删除这条留言吗？" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!loading && list.length === 0" description="暂无留言" />

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
import { adminGetMessages, adminUpdateMessageStatus, adminDeleteMessage } from '@/api/message'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  status: null
})

function formatTime(t) {
  if (!t) return '—'
  return t.replace('T', ' ').slice(0, 16)
}

function reload() {
  query.pageNum = 1
  load()
}

async function load() {
  loading.value = true
  try {
    const res = await adminGetMessages({
      pageNum: query.pageNum,
      pageSize: query.pageSize,
      status: query.status ?? undefined
    })
    list.value = res.records || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

async function setStatus(id, status) {
  await adminUpdateMessageStatus(id, status)
  ElMessage.success(status === 1 ? '已通过' : '已拒绝')
  load()
}

async function handleDelete(id) {
  await adminDeleteMessage(id)
  ElMessage.success('删除成功')
  if (list.value.length === 1 && query.pageNum > 1) query.pageNum--
  load()
}

onMounted(load)
</script>

<style scoped>
.page-title {
  font-size: var(--font-h2);
  font-weight: 500;
  margin-bottom: var(--space-lg);
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
