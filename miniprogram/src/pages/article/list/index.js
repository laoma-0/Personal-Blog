import { useState, useEffect, useCallback, useRef } from 'react'
import Taro, { useRouter, useReachBottom, usePullDownRefresh } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { getArticleList } from '../../../services/article'
import { formatDate, coverBg } from '../../../utils/format'
import './index.scss'

const PAGE_SIZE = 10

export default function ArticleList() {
  const router = useRouter()
  const categoryId = router.params.categoryId
  const name = router.params.name ? decodeURIComponent(router.params.name) : ''

  const [articles, setArticles] = useState([])
  const [total, setTotal] = useState(0)
  const [pageNum, setPageNum] = useState(1)
  const [loading, setLoading] = useState(false)
  const loadingRef = useRef(false)

  useEffect(() => {
    if (name) Taro.setNavigationBarTitle({ title: name })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const load = useCallback(async (targetPage, append) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    try {
      const data = await getArticleList({ pageNum: targetPage, pageSize: PAGE_SIZE, categoryId })
      const records = (data && data.records) || []
      setTotal((data && data.total) || 0)
      setArticles((prev) => (append ? [...prev, ...records] : records))
      setPageNum(targetPage)
    } catch (e) {
      // ignore
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [categoryId])

  useEffect(() => {
    load(1, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  usePullDownRefresh(async () => {
    await load(1, false)
    Taro.stopPullDownRefresh()
  })

  useReachBottom(() => {
    if (articles.length < total && !loadingRef.current) load(pageNum + 1, true)
  })

  const goDetail = (id) => Taro.navigateTo({ url: `/pages/article/detail/index?id=${id}` })

  return (
    <View className='list-page'>
      <View className='content'>
        {articles.map((a) => (
          <View key={a.id} className='card art-card fade-up' onClick={() => goDetail(a.id)}>
            <View
              className='cover'
              style={a.cover ? { backgroundImage: `url(${a.cover})`, backgroundSize: 'cover' } : { background: coverBg(a) }}
            />
            <View className='body'>
              <Text className='a-title'>{a.title}</Text>
              <Text className='excerpt'>{a.summary}</Text>
              <View className='meta'>
                <Text className='meta-item'>📅 {formatDate(a.createTime)}</Text>
                <Text className='meta-item'>👁 {a.readCount}</Text>
              </View>
            </View>
          </View>
        ))}
        {!loading && articles.length === 0 && <View className='empty'>该分类下暂无文章</View>}
        {loading && <View className='loading-tip'>加载中…</View>}
      </View>
    </View>
  )
}
