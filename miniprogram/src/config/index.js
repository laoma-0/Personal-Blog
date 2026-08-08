/**
 * 全局配置常量
 * ⚠️ 上线切换后端地址：只需修改这里一行
 *   - 远程调试（当前）：http://8.134.79.217（公网 IP，真机/模拟器都能连，微信工具/真机需勾选「不校验合法域名」）
 *   - 本地联调：http://电脑局域网IP:8080（真机须用局域网 IP，不能用 127.0.0.1；手机与电脑需同一 WiFi）
 *   - 正式发布：https://你的域名（备案完成 + HTTPS + 公众平台配置合法域名后）
 */
export const BASE_URL = 'http://8.134.79.217'

/** 接口统一前缀 */
export const API_PREFIX = '/api'

/** 请求超时（ms） */
export const REQUEST_TIMEOUT = 10000
