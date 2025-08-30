/**
 * 安全工具库
 * 提供输入验证、数据清理和安全检查功能
 */

// HTML 转义工具
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// URL 验证
export function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

// GitHub API URL 验证
export function isValidGitHubApiUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === 'api.github.com' && 
           parsedUrl.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// 输入清理 - 移除潜在危险字符
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

// 验证 GitHub 用户名格式
export function isValidGitHubUsername(username: string): boolean {
  const pattern = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
  return pattern.test(username);
}

// 验证 GitHub 仓库名格式
export function isValidGitHubRepoName(repoName: string): boolean {
  const pattern = /^[a-zA-Z0-9._-]+$/;
  return pattern.test(repoName) && repoName.length <= 100;
}

// 检查是否为危险的文件扩展名
export function isDangerousFileExtension(filename: string): boolean {
  const dangerousExtensions = [
    '.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.jar', '.js', '.vbs', '.ps1'
  ];
  
  const ext = filename.toLowerCase().split('.').pop();
  return dangerousExtensions.includes(`.${ext}`);
}

// 生成安全的随机字符串
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);
    
    for (let i = 0; i < length; i++) {
      result += chars[randomBytes[i] % chars.length];
    }
  } else {
    // 降级到 Math.random (不推荐用于生产环境的加密用途)
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  
  return result;
}

// Rate limiting 存储 (简单内存实现)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// 简单的频率限制检查
export function checkRateLimit(
  key: string, 
  maxRequests: number = 100, 
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    // 创建新记录或重置过期记录
    const newRecord = { count: 1, resetTime: now + windowMs };
    rateLimitStore.set(key, newRecord);
    
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: newRecord.resetTime
    };
  }
  
  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime
    };
  }
  
  record.count++;
  rateLimitStore.set(key, record);
  
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime
  };
}

// 清理过期的限制记录
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// 验证 API 响应数据结构
export function validateApiResponse(data: any, expectedFields: string[]): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  return expectedFields.every(field => {
    const keys = field.split('.');
    let current = data;
    
    for (const key of keys) {
      if (!current || typeof current !== 'object' || !(key in current)) {
        return false;
      }
      current = current[key];
    }
    
    return true;
  });
}