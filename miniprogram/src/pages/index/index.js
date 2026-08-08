import { useState, useEffect, useCallback, useRef } from 'react'
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { getArticleList } from '../../services/article'
import { formatDate, coverClass } from '../../utils/format'
import './index.scss'

const PAGE_SIZE = 10

export default function Index() {
  const [articles, setArticles] = useState([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)

  // 加载文章（append=true 时追加）
  const load = useCallback(async (targetPage, append) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    try {
      const data = await getArticleList({ pageNum: targetPage, pageSize: PAGE_SIZE })
      const records = (data && data.records) || []
      // === 诊断：把拿到的条数写进导航栏标题（定位后删除）===
      Taro.setNavigationBarTitle({ title: `博客 [收到${records.length}条]` })
      setTotal((data && data.total) || 0)
      setArticles((prev) => (append ? [...prev, ...records] : records))
      setPageNum(targetPage)
    } catch (e) {
      Taro.setNavigationBarTitle({ title: '博客 [请求失败]' })
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(1, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 下拉刷新
  usePullDownRefresh(async () => {
    await load(1, false)
    Taro.stopPullDownRefresh()
  })

  // 触底加载更多
  useReachBottom(() => {
    if (articles.length < total && !loadingRef.current) {
      load(pageNum + 1, true)
    }
  })

  const goDetail = (id) => {
    Taro.navigateTo({ url: `/pages/article/detail/index?id=${id}` })
  }

  // 置顶大卡：取第一篇 isTop（兼容数字 1 / 布尔 true）
  const featured = articles.find((a) => Number(a.isTop) === 1 || a.isTop === true) || null
  const normalArticles = featured ? articles.filter((a) => a.id !== featured.id) : articles

  return (
    <View className='index-page'>
      {/* Hero */}
      <View className='hero'>
        <Text className='hero-title'>送君千万里 终有一别</Text>
        <Text className='hero-sub'>一个软件工程学生的技术笔记与生活随笔</Text>
      </View>

      <View className='content'>
        {/* 置顶大卡 */}
        {featured && (
          <View className='card featured' onClick={() => goDetail(featured.id)}>
            <View className={`cover ${coverClass(featured)}`}>
              <Text className='pin'>📌 置顶</Text>
            </View>
            <View className='body'>
              {featured.categoryName && <Text className='tag'>{featured.categoryName}</Text>}
              <Text className='f-title'>{featured.title}</Text>
              {featured.summary ? <Text className='excerpt'>{featured.summary}</Text> : null}
              <View className='meta'>
                <Text className='meta-item'>📅 {formatDate(featured.createTime)}</Text>
                <Text className='meta-item'>👁 {featured.readCount}</Text>
                <Text className='meta-item'>♡ {featured.likeCount}</Text>
              </View>
            </View>
          </View>
        )}

        {/* 普通文章列表 */}
        {normalArticles.map((a) => (
          <View key={a.id} className='card art-card' onClick={() => goDetail(a.id)}>
            <View className={`cover ${coverClass(a)}`} />
            <View className='body'>
              <Text className='a-title'>{a.title}</Text>
              {a.summary ? <Text className='excerpt'>{a.summary}</Text> : null}
              <View className='meta'>
                {a.categoryName && <Text className='tag'>{a.categoryName}</Text>}
                <Text className='meta-item'>📅 {formatDate(a.createTime)}</Text>
                <Text className='meta-item'>👁 {a.readCount}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* 空状态 / 加载提示 */}
        {!loading && articles.length === 0 && (
          <View className='empty'>还没有文章</View>
        )}
        {loading && <View className='loading-tip'>加载中…</View>}
      </View>
    </View>
  )
}
