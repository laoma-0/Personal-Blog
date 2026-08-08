import Taro from '@tarojs/taro'

/** 本设备是否已点赞该文章 */
export function isLiked(id) {
  try {
    return !!Taro.getStorageSync(`liked_${id}`)
  } catch (e) {
    return false
  }
}

export function setLiked(id, liked) {
  try {
    if (liked) Taro.setStorageSync(`liked_${id}`, 1)
    else Taro.removeStorageSync(`liked_${id}`)
  } catch (e) {
    // ignore
  }
}
