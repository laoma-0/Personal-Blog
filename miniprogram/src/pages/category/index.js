import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { getCategories } from '../../services/category'
import { getTags } from '../../services/tag'
import { hexToSoft } from '../../utils/format'
import './index.scss'

export default function Category() {
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])

  useEffect(() => {
    getCategories().then((d) => setCategories(d || [])).catch(() => {})
    getTags().then((d) => setTags(d || [])).catch(() => {})
  }, [])

  const goList = (cat) => {
    Taro.navigateTo({ url: `/pages/article/list/index?categoryId=${cat.id}&name=${encodeURIComponent(cat.name)}` })
  }

  return (
    <View className='category-page'>
      <View className='hero'>
        <Text className='hero-title'>分类 · 标签</Text>
        <Text className='hero-sub'>按主题探索文章</Text>
      </View>

      <Text className='section-title'>文章分类</Text>
      <View className='cat-grid'>
        {categories.map((c) => (
          <View key={c.id} className='card cat-card fade-up' onClick={() => goList(c)}>
            <Text className='name'>{c.name}</Text>
            <Text className='count'>{c.articleCount ?? 0} 篇文章</Text>
          </View>
        ))}
        {categories.length === 0 && <Text className='empty'>暂无分类</Text>}
      </View>

      <Text className='section-title'>标签云</Text>
      <View className='tag-cloud'>
        {tags.map((t) => (
          <Text
            key={t.id}
            className='tag'
            style={t.color ? { background: hexToSoft(t.color), color: t.color } : {}}
          >
            {t.name}
          </Text>
        ))}
        {tags.length === 0 && <Text className='empty'>暂无标签</Text>}
      </View>
    </View>
  )
}
