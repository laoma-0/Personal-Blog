import { get } from './request'

/** 分类列表（含文章数） GET /api/categories */
export const getCategories = () => get('/categories')
