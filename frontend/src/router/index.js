import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/FrontLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/front/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'article/:id',
        name: 'ArticleDetail',
        component: () => import('@/views/front/ArticleDetail.vue'),
        meta: { title: '文章详情' }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/front/Category.vue'),
        meta: { title: '分类' }
      },
      {
        path: 'archive',
        name: 'Archive',
        component: () => import('@/views/front/Archive.vue'),
        meta: { title: '归档' }
      },
      {
        path: 'message',
        name: 'Message',
        component: () => import('@/views/front/Message.vue'),
        meta: { title: '留言' }
      }
    ]
  },
  // ==================== 后台管理 ====================
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/admin/Login.vue'),
    meta: { title: '后台登录' }
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: '仪表盘', requiresAuth: true }
      },
      {
        path: 'articles',
        name: 'AdminArticleList',
        component: () => import('@/views/admin/ArticleList.vue'),
        meta: { title: '文章管理', requiresAuth: true }
      },
      {
        path: 'articles/create',
        name: 'AdminArticleCreate',
        component: () => import('@/views/admin/ArticleEdit.vue'),
        meta: { title: '写文章', requiresAuth: true }
      },
      {
        path: 'articles/edit/:id',
        name: 'AdminArticleEdit',
        component: () => import('@/views/admin/ArticleEdit.vue'),
        meta: { title: '编辑文章', requiresAuth: true }
      },
      {
        path: 'comments',
        name: 'AdminCommentList',
        component: () => import('@/views/admin/CommentList.vue'),
        meta: { title: '评论管理', requiresAuth: true }
      },
      {
        path: 'messages',
        name: 'AdminMessageList',
        component: () => import('@/views/admin/MessageList.vue'),
        meta: { title: '留言管理', requiresAuth: true }
      },
      {
        path: 'tags',
        name: 'AdminTagList',
        component: () => import('@/views/admin/TagList.vue'),
        meta: { title: '分类标签', requiresAuth: true }
      }
    ]
  },
  // 兜底路由：匹配不到的网址（如输错地址）统一跳回首页
  // 注意：必须放在路由表最末尾，否则会抢先匹配掉正常路由
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 路由守卫：后台鉴权
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  // 需要登录但无 token → 去登录页
  if (to.meta.requiresAuth && !token) {
    return { path: '/admin/login', query: { redirect: to.fullPath } }
  }
  // 已登录再访问登录页 → 去仪表盘
  if (to.path === '/admin/login' && token) {
    return { path: '/admin/dashboard' }
  }
  return true
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · 我的个人博客` : '我的个人博客'
})

export default router
