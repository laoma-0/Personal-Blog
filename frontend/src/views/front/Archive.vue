<template>
  <div class="container page">
    <header class="page-head fade-up">
      <h1>文章归档</h1>
      <p>共 {{ totalCount }} 篇文章</p>
    </header>

    <div v-loading="loading" class="timeline">
      <section v-for="group in archive" :key="group.year" class="year-group fade-up">
        <div class="year">{{ group.year }}</div>
        <ul class="items">
          <li v-for="item in group.articles" :key="item.id" @click="goDetail(item.id)">
            <span class="dot"></span>
            <span class="date">{{ item.date }}</span>
            <span class="title">{{ item.title }}</span>
          </li>
        </ul>
      </section>

      <el-empty v-if="!loading && archive.length === 0" description="暂无文章" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArchive } from '@/api/archive'

const router = useRouter()
const archive = ref([])
const loading = ref(false)

const totalCount = computed(() =>
  archive.value.reduce((sum, g) => sum + g.articles.length, 0)
)

function goDetail(id) {
  router.push(`/article/${id}`)
}

async function load() {
  loading.value = true
  try {
    archive.value = await getArchive()
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

.timeline {
  padding-bottom: var(--space-3xl);
}
.year-group {
  margin-bottom: var(--space-xl);
}
.year {
  font-size: var(--font-h2);
  font-weight: 500;
  color: var(--color-primary);
  margin-bottom: var(--space-md);
  padding-left: var(--space-md);
}
.items {
  list-style: none;
  border-left: 2px solid var(--color-border);
  margin-left: var(--space-md);
}
.items li {
  position: relative;
  padding: var(--space-sm) 0 var(--space-sm) var(--space-lg);
  cursor: pointer;
  transition: color var(--dur-normal) var(--ease-soft);
}
.items li:hover { color: var(--color-primary); }
.items li:hover .title { color: var(--color-primary); }
.dot {
  position: absolute;
  left: -7px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-bg);
  border: 2px solid var(--color-primary);
  transition: background var(--dur-slow) var(--ease-soft);
}
.items li:hover .dot { background: var(--color-primary); }
.date {
  color: var(--color-text-secondary);
  font-size: var(--font-caption);
  margin-right: var(--space-md);
}
.title {
  color: var(--color-text-regular);
  transition: color var(--dur-normal) var(--ease-soft);
}
</style>
