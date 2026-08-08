<template>
  <div class="front-layout">
    <!-- 顶部导航 -->
    <header class="site-header">
      <div class="container header-inner">
        <router-link to="/" class="logo">◍ 假小光的博客</router-link>
        <nav class="nav">
          <router-link to="/">首页</router-link>
          <router-link to="/category">分类</router-link>
          <router-link to="/archive">归档</router-link>
          <router-link to="/message">留言</router-link>
          <a href="javascript:void(0)" class="nav-about">关于</a>
        </nav>
        <input
          class="search-box"
          placeholder="搜索文章…"
          v-model="keyword"
          @keyup.enter="doSearch"
        />
      </div>
    </header>

    <!-- 页面主体 -->
    <main class="site-main">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="site-footer">
      <div class="container">
        © 2026 我的个人博客 · Powered by Spring Boot + Vue3
      </div>
    </footer>

    <!-- AI 助手（前台全局悬浮） -->
    <AiChat />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AiChat from '@/components/AiChat.vue'

const router = useRouter()
const route = useRoute()

// 搜索关键词，初始与地址栏 ?keyword= 同步
const keyword = ref(route.query.keyword || '')

// 地址栏 keyword 变化时（如清除搜索、后退）同步输入框
watch(
  () => route.query.keyword,
  (val) => {
    keyword.value = val || ''
  }
)

function doSearch() {
  const kw = keyword.value.trim()
  // 跳到首页并带上关键词；为空则回到普通首页
  router.push(kw ? { path: '/', query: { keyword: kw } } : { path: '/' })
}
</script>

<style scoped>
.front-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-header {
  background: var(--gradient-header);
  border-bottom: 1px solid var(--color-border-light);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
}
.logo {
  font-size: var(--font-h3);
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--color-primary-active);
}
.nav {
  display: flex;
  gap: var(--space-xl);
}
.nav a {
  font-size: var(--font-body);
  color: var(--color-text-regular);
  position: relative;
  padding: 4px 0;
}
.nav a.router-link-active {
  color: var(--color-primary-active);
}
.nav .nav-about { color: var(--color-text-regular); }

.search-box {
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.6);
  border-radius: var(--radius-sm);
  padding: 6px 14px;
  font-size: var(--font-caption);
  color: var(--color-text-secondary);
  transition: border-color var(--dur-base) ease, box-shadow var(--dur-base) ease;
  outline: none;
}
.search-box:hover,
.search-box:focus { border-color: var(--color-primary); }

@media (max-width: 768px) {
  .search-box { display: none; }
  .nav { gap: var(--space-md); }
}

.site-main {
  flex: 1;
}

.site-footer {
  margin-top: var(--space-3xl);
  padding: var(--space-xl) 0;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-caption);
  background: var(--gradient-soft);
}
</style>
