<template>
  <div>
    <div class="page-head">
      <h1 class="page-title">分类标签</h1>
    </div>

    <!-- ========== 分类管理 ========== -->
    <div class="card block" v-loading="catLoading">
      <div class="block-title">分类</div>

      <!-- 新增分类：输入框 + 按钮 -->
      <div class="add-bar">
        <el-input
          v-model="newCategory"
          placeholder="输入分类名称，回车或点新增"
          style="width: 240px"
          @keyup.enter="handleAddCategory"
        />
        <el-button type="primary" @click="handleAddCategory">新增分类</el-button>
      </div>

      <!-- 分类列表（表格：名称 + 文章数 + 删除） -->
      <el-table :data="categories" style="width: 100%">
        <el-table-column prop="name" label="名称" min-width="160" />
        <el-table-column prop="articleCount" label="文章数" width="120" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-popconfirm title="确定删除该分类吗？" @confirm="handleDeleteCategory(row.id)">
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!catLoading && categories.length === 0" description="暂无分类" />
    </div>

    <!-- ========== 标签管理 ========== -->
    <div class="card block" v-loading="tagLoading">
      <div class="block-title">标签</div>

      <!-- 新增标签 -->
      <div class="add-bar">
        <el-input
          v-model="newTag"
          placeholder="输入标签名称，回车或点新增"
          style="width: 240px"
          @keyup.enter="handleAddTag"
        />
        <el-button type="primary" @click="handleAddTag">新增标签</el-button>
      </div>

      <!-- 标签墙：每个标签一个可关闭的 el-tag -->
      <div class="tag-wall">
        <el-tag
          v-for="t in tags"
          :key="t.id"
          closable
          :color="t.color"
          effect="light"
          class="tag-item"
          @close="handleDeleteTag(t.id)"
        >
          {{ t.name }}
        </el-tag>
        <el-empty v-if="!tagLoading && tags.length === 0" description="暂无标签" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { adminGetCategories, adminAddCategory, adminDeleteCategory } from '@/api/category'
import { adminGetTags, adminAddTag, adminDeleteTag } from '@/api/tag'

// ===== 分类 =====
const categories = ref([])
const catLoading = ref(false)
const newCategory = ref('')

async function loadCategories() {
  catLoading.value = true
  try {
    categories.value = await adminGetCategories()
  } finally {
    catLoading.value = false
  }
}

async function handleAddCategory() {
  const name = newCategory.value.trim()
  if (!name) {
    ElMessage.warning('请输入分类名称')
    return
  }
  await adminAddCategory({ name })
  ElMessage.success('新增成功')
  newCategory.value = ''
  loadCategories()
}

async function handleDeleteCategory(id) {
  await adminDeleteCategory(id)
  ElMessage.success('删除成功')
  loadCategories()
}

// ===== 标签 =====
const tags = ref([])
const tagLoading = ref(false)
const newTag = ref('')

async function loadTags() {
  tagLoading.value = true
  try {
    tags.value = await adminGetTags()
  } finally {
    tagLoading.value = false
  }
}

async function handleAddTag() {
  const name = newTag.value.trim()
  if (!name) {
    ElMessage.warning('请输入标签名称')
    return
  }
  await adminAddTag({ name })
  ElMessage.success('新增成功')
  newTag.value = ''
  loadTags()
}

async function handleDeleteTag(id) {
  await adminDeleteTag(id)
  ElMessage.success('删除成功')
  loadTags()
}

// 页面加载时同时拉两份数据
onMounted(() => {
  loadCategories()
  loadTags()
})
</script>

<style scoped>
.page-head {
  margin-bottom: var(--space-lg);
}
.page-title {
  font-size: var(--font-h2);
  font-weight: 500;
}
.block {
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
}
.block-title {
  font-size: var(--font-h3, 18px);
  font-weight: 500;
  margin-bottom: var(--space-md);
  color: var(--color-text-primary);
}
.add-bar {
  display: flex;
  gap: var(--space-md);
  align-items: center;
  margin-bottom: var(--space-lg);
}
.tag-wall {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}
.tag-item {
  font-size: 14px;
}
</style>
