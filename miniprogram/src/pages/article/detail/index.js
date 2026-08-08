import { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text, RichText } from '@tarojs/components'
import { getArticleDetail, likeArticle, unlikeArticle } from '../../../services/article'
import { getComments } from '../../../services/comment'
import { formatDate, coverBg } from '../../../utils/format'
import { isLiked, setLiked } from '../../../utils/storage'
import './index.scss'

export default function Detail() {
  const router = useRouter()
  const id = router.params.id

  const [article, setArticle] = useState(null)
  const [comments, setComments] = useState([])
  const [liked, setLikedState] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    if (!id) return
    getArticleDetail(id).then((data) => {
      setArticle(data || null)
      setLikeCount((data && data.likeCount) || 0)
    }).catch(() => {})
    getComments(id).then((d) => setComments(d || [])).catch(() => {})
    setLikedState(isLiked(id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const toggleLike = async () => {
    try {
      if (liked) {
        const n = await unlikeArticle(id)
        setLikeCount(n)
        setLikedState(false)
        setLiked(id, false)
      } else {
        const n = await likeArticle(id)
        setLikeCount(n)
        setLikedState(true)
        setLiked(id, true)
        Taro.showToast({ title: '感谢点赞 ♥', icon: 'none' })
      }
    } catch (e) {
      // request.js 已 Toast
    }
  }

  if (!article) {
    return <View className='detail-page'><View className='loading-tip'>加载中…</View></View>
  }

  return (
    <View className='detail-page'>
      <View
        className='cover'
        style={article.cover ? { backgroundImage: `url(${article.cover})`, backgroundSize: 'cover' } : { background: coverBg(article) }}
      />

      <View className='body'>
        <Text className='title'>{article.title}</Text>
        <View className='meta'>
          <Text className='meta-item'>📅 {formatDate(article.createTime)}</Text>
          <Text className='meta-item'>👁 {article.readCount} 阅读</Text>
          <Text className='meta-item'>♡ {likeCount}</Text>
        </View>

        {/* 正文：后端已返回 contentHtml，用 rich-text 渲染 */}
        <View className='article-content'>
          <RichText nodes={article.contentHtml || ''} />
        </View>
      </View>

      {/* 评论 */}
      <View className='comments'>
        <Text className='c-title'>评论 · {comments.length}</Text>
        {comments.map((c) => (
          <View key={c.id} className='comment-item'>
            <Text className='who'>{c.nickname}</Text>
            <Text className='txt'>{c.content}</Text>
          </View>
        ))}
        {comments.length === 0 && <Text className='empty'>还没有评论</Text>}
      </View>

      {/* 底部悬浮点赞条 */}
      <View className='like-bar'>
        <View className={`btn-like ${liked ? 'liked' : ''}`} onClick={toggleLike}>
          {liked ? `♥ 已赞 ${likeCount}` : `♡ 点赞 ${likeCount}`}
        </View>
      </View>
    </View>
  )
}
