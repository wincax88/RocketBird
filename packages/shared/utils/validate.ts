/**
 * 校验工具函数
 */

/**
 * 校验手机号
 */
export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}

/**
 * 校验邮箱
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * 校验验证码（6位数字）
 */
export function isValidSmsCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

/**
 * 校验邀请码
 */
export function isValidInviteCode(code: string): boolean {
  return /^[A-Z0-9]{8}$/.test(code);
}

/**
 * 校验密码强度
 * 至少8位，包含数字和字母
 */
export function isValidPassword(password: string): boolean {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(password);
}

/**
 * 校验用户名
 * 4-20位字母、数字、下划线
 */
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{4,20}$/.test(username);
}

/**
 * 校验昵称长度
 */
export function isValidNickname(nickname: string, maxLength = 20): boolean {
  return nickname.length > 0 && nickname.length <= maxLength;
}

/**
 * 校验图片类型
 */
export function isValidImageType(type: string): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(type);
}

/**
 * 校验视频类型
 */
export function isValidVideoType(type: string): boolean {
  const allowedTypes = ['video/mp4', 'video/quicktime'];
  return allowedTypes.includes(type);
}

/**
 * 校验文件大小
 */
export function isValidFileSize(size: number, maxSize: number): boolean {
  return size > 0 && size <= maxSize;
}

/**
 * 校验 URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 校验日期格式 YYYY-MM-DD
 */
export function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime());
}

/**
 * 校验是否为空
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
