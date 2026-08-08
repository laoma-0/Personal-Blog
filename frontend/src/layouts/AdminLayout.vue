<template>
  <el-container class="admin-layout">
    <!-- 侧边菜单 -->
    <el-aside width="240px" class="admin-side">
      <div class="brand">◍ 博客后台</div>
      <el-menu
        :default-active="activeMenu"
        class="admin-menu"
        router
        background-color="transparent"
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><DataLine /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/admin/articles">
          <el-icon><Document /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/comments">
          <el-icon><ChatDotRound /></el-icon>
          <span>评论管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/messages">
          <el-icon><Message /></el-icon>
          <span>留言管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/tags" >
          <el-icon><Collection /></el-icon>
          <span>分类标签</span>
        </el-menu-item>
        <!-- 占位（后续阶段） -->
        <el-menu-item index="__img" disabled>
          <el-icon><Picture /></el-icon>
          <span>图床管理</span>
        </el-menu-item>
        <el-menu-item index="__set" disabled>
          <el-icon><Setting /></el-icon>
          <span>站点设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主区 -->
    <el-container>
      <el-header class="admin-top">
        <span class="crumb">首页 / {{ currentTitle }}</span>
        <div class="user">
          <span class="name">{{ nickname }}</span>
          <div class="avatar"></div>
          <el-button text size="small" @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>
      <el-main class="admin-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import {
  DataLine, Document, ChatDotRound, Message,
  Collection, Picture, Setting
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 高亮菜单：编辑/新建文章时仍高亮「文章管理」
const activeMenu = computed(() => {
  if (route.path.startsWith('/admin/articles')) return '/admin/articles'
  return route.path
})

const currentTitle = computed(() => route.meta.title || '仪表盘')

const nickname = computed(() => userStore.userInfo?.nickname || '博主')

function handleLogout() {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: var(--color-bg-page);
}

/* 侧边 */
.admin-side {
  background: var(--gradient-header);
  border-right: 1px solid var(--color-border-light);
  padding: var(--space-lg) 0;
}
.brand {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.05em;
  padding: 0 var(--space-lg) var(--space-lg);
  color: var(--color-text-primary);
}
.admin-menu {
  border-right: none;
}
.admin-menu .el-menu-item {
  color: var(--color-text-regular);
  transition: all var(--dur-normal) var(--ease-soft);
}
.admin-menu .el-menu-item:hover {
  background: rgba(255, 255, 255, 0.5) !important;
}
.admin-menu .el-menu-item.is-active {
  background: var(--color-primary-light) !important;
  color: var(--color-primary-active);
  border-left: 3px solid var(--color-primary);
}

/* 顶栏 */
.admin-top {
  height: 64px;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.admin-top .crumb {
  color: var(--color-text-secondary);
  font-size: var(--font-caption);
}
.admin-top .user {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
.admin-top .user .name {
  color: var(--color-text-regular);
}
.admin-top .user .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gradient-primary);
}

/* 内容区 */
.admin-content {
  padding: var(--space-xl);
}
</style>
