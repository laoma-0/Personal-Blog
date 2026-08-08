<template>
  <div class="container page">
    <header class="page-head fade-up">
      <h1>文章分类</h1>
      <p>按主题浏览文章</p>
    </header>

    <div v-loading="loading" class="category-grid">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="card category-card fade-up"
        @click="goCategory(cat.id)"
      >
        <div class="cat-icon" :style="{ background: gradientOf(cat.id) }">
          {{ cat.name.charAt(0) }}
        </div>
        <div class="cat-name">{{ cat.name }}</div>
        <div class="cat-desc">{{ cat.description }}</div>
        <div class="cat-count">{{ cat.articleCount }} 篇文章</div>
      </div>

      <el-empty v-if="!loading && categories.length === 0" description="暂无分类" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCategories } from '@/api/category'

const router = useRouter()
const categories = ref([])
const loading = ref(false)

const gradients = [
  'linear-gradient(135deg,#9DB8B6,#8AA6B8)',
  'linear-gradient(135deg,#C9AEB0,#B0A6C0)',
  'linear-gradient(135deg,#A9B8A0,#9DB8B6)',
  'linear-gradient(135deg,#D2B49C,#C9AEB0)'
]
function gradientOf(id) {
  return gradients[id % gradients.length]
}

function goCategory(id) {
  router.push({ path: '/', query: { categoryId: id } })
}

async function load() {
  loading.value = true
  try {
    categories.value = await getCategories()
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
}
.page-head {
  text-align: center;
  margin-bottom: var(--space-2xl);
}
.page-head h1 {
  font-size: var(--font-h1);
  font-weight: 500;
  margin-bottom: var(--space-sm);
}
.page-head p {
  color: var(--color-text-secondary);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-xl);
  padding-bottom: var(--space-2xl);
}
.category-card {
  padding: var(--space-xl);
  text-align: center;
  cursor: pointer;
}
.cat-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-md);
  margin: 0 auto var(--space-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-h2);
  color: #fff;
  filter: saturate(0.9);
}
.cat-name {
  font-size: var(--font-body-lg);
  font-weight: 500;
  margin-bottom: var(--space-xs);
}
.cat-desc {
  color: var(--color-text-secondary);
  font-size: var(--font-caption);
  margin-bottom: var(--space-md);
  min-height: 2.6em;
}
.cat-count {
  display: inline-block;
  font-size: var(--font-caption);
  color: var(--color-primary-active);
  background: var(--color-primary-light);
  padding: 2px 12px;
  border-radius: var(--radius-sm);
}
</style>
