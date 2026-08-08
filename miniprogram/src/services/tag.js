import { get } from './request'

/** 标签列表 GET /api/tags */
export const getTags = () => get('/tags')
