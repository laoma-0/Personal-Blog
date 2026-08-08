export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/category/index',
    'pages/about/index',
    'pages/article/detail/index',
    'pages/article/list/index'
  ],
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#FDFCFA',
    navigationBarTitleText: '博客',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F6F4F1'
  },
  tabBar: {
    color: '#8C8E90',
    selectedColor: '#8AA6B8',
    backgroundColor: '#FDFCFA',
    borderStyle: 'white',
    list: [
      { pagePath: 'pages/index/index', text: '首页' },
      { pagePath: 'pages/category/index', text: '分类' },
      { pagePath: 'pages/about/index', text: '关于' }
    ]
  }
})
