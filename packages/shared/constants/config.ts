/**
 * 配置相关常量
 */

// 分页默认值
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// 上传限制
export const UPLOAD = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_VIDEO_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_IMAGES_COUNT: 9,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/quicktime'],
} as const;

// 短信验证码
export const SMS = {
  CODE_LENGTH: 6,
  CODE_EXPIRE_SECONDS: 300, // 5分钟
  RESEND_INTERVAL_SECONDS: 60, // 60秒后可重发
  DAILY_LIMIT: 10, // 每日发送上限
  MAX_VERIFY_ATTEMPTS: 5, // 最大验证失败次数
  LOCK_DURATION_MINUTES: 30, // 锁定时长
} as const;

// JWT 配置
export const JWT = {
  ACCESS_TOKEN_EXPIRE: '7d',
  REFRESH_TOKEN_EXPIRE: '30d',
  REFRESH_THRESHOLD_HOURS: 24, // token 剩余有效期少于此值时刷新
} as const;

// 积分配置
export const POINTS = {
  DEFAULT_CHECKIN_REWARD: 10,
  DEFAULT_SHARE_MIN: 1,
  DEFAULT_SHARE_MAX: 10,
  DEFAULT_SHARE_DAILY_LIMIT: 5,
  DEFAULT_INVITE_REWARD: 100,
} as const;

// 等级配置
export const LEVEL = {
  DEFAULT_LEVEL: 1,
  MAX_LEVEL: 10,
} as const;

// 内容长度限制
export const CONTENT_LIMIT = {
  NICKNAME_MAX: 20,
  CHECKIN_CONTENT_MAX: 500,
  FEEDBACK_CONTENT_MIN: 10,
  FEEDBACK_CONTENT_MAX: 500,
  REPLY_CONTENT_MAX: 500,
} as const;

// 邀请码配置
export const INVITE_CODE = {
  LENGTH: 8,
  CHARS: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', // 排除易混淆字符
} as const;

// API 响应码
export const API_CODE = {
  SUCCESS: 0,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

// 缓存时间 (秒)
export const CACHE_TTL = {
  LEVEL_CONFIG: 3600, // 1小时
  BRAND_CONTENT: 1800, // 30分钟
  TODAY_MEAL: 3600, // 1小时
} as const;
