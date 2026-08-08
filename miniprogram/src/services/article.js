import { get, post, del } from './request'

/** 文章分页列表 GET /api/articles */
export const getArticleList = (params = {}) => {
  const { pageNum = 1, pageSize = 10, categoryId, keyword } = params
  return get('/articles', { pageNum, pageSize, categoryId, keyword })
}

/** 文章详情 GET /api/articles/{id} */
export const getArticleDetail = (id) => get(`/articles/${id}`)

/** 点赞 POST /api/articles/{id}/like → 返回最新点赞数 */
export const likeArticle = (id) => post(`/articles/${id}/like`)

/** 取消点赞 DELETE /api/articles/{id}/like → 返回最新点赞数 */
export const unlikeArticle = (id) => del(`/articles/${id}/like`)
