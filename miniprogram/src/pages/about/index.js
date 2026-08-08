import { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { getSiteStats } from '../../services/site'
import { formatViews } from '../../utils/format'
import './index.scss'

export default function About() {
  const [site, setSite] = useState({})

  useEffect(() => {
    getSiteStats().then((data) => setSite(data || {})).catch(() => {})
  }, [])

  return (
    <View className='about-page'>
      <View className='card author fade-up'>
        <View className='avatar' />
        <Text className='name'>{site.author || '博主'}</Text>
        <Text className='intro'>{site.intro || '一个软件工程学生的技术笔记与生活随笔'}</Text>

        <View className='stats'>
          <View className='stat'>
            <Text className='n'>{site.articleCount ?? 0}</Text>
            <Text className='l'>文章</Text>
          </View>
          <View className='stat'>
            <Text className='n'>{site.tagCount ?? 0}</Text>
            <Text className='l'>标签</Text>
          </View>
          <View className='stat'>
            <Text className='n'>{formatViews(site.viewCount)}</Text>
            <Text className='l'>访问</Text>
          </View>
        </View>
      </View>

      <Text className='word'>送君千万里 · 终有一别</Text>
    </View>
  )
}
