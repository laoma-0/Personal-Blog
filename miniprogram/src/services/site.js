import { get } from './request'

/** 站点统计 GET /api/site/stats */
export const getSiteStats = () => get('/site/stats')
