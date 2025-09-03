import type { APIRoute } from 'astro';
import { githubAPI } from '../../lib/github';
import { checkRateLimit, validateApiResponse, isValidGitHubApiUrl } from '../../lib/security';
import githubStats from '../../data/github-stats.json';

export const GET: APIRoute = async ({ request }) => {
  // 获取客户端 IP 进行频率限制
  const clientIP = request.headers.get('cf-connecting-ip') || 
                   request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';

  // 检查频率限制 (每15分钟100次请求)
  const rateLimitResult = checkRateLimit(`stats:${clientIP}`, 100, 15 * 60 * 1000);
  
  if (!rateLimitResult.allowed) {
    return new Response(JSON.stringify({ 
      error: 'Rate limit exceeded',
      resetTime: rateLimitResult.resetTime 
    }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime / 1000).toString(),
        'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
      }
    });
  }

  try {
    // 首先尝试读取静态数据文件
    try {
      // const staticDataPath = './src/data/github-stats.json';
      // const staticData = await import(staticDataPath);
      
      // 验证静态数据结构
      const expectedFields = ['todayStatus', 'streakCount', 'monthlyCount', 'totalCount', 'recentDays'];
      if (!validateApiResponse(githubStats, expectedFields)) {
        throw new Error('Invalid static data structure');
      }

      return new Response(JSON.stringify(githubStats), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://shipdaily.dev',
          'Access-Control-Allow-Methods': 'GET',
          'Cache-Control': 'public, max-age=300',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
        }
      });
    } catch (staticError) {
      console.log('Static data not found or invalid, falling back to API');
    }
    
    // 如果静态数据不可用，使用 API
    const stats = await githubAPI.getShipDailyStats();
    
    // 验证 API 响应数据结构
    const expectedFields = ['todayStatus', 'streakCount', 'monthlyCount', 'totalCount', 'recentDays'];
    if (!validateApiResponse(stats, expectedFields)) {
      throw new Error('Invalid API response structure');
    }
    
    // 标记为 fallback 数据
    const responseData = {
      ...stats,
      dataSource: 'fallback',
      lastUpdated: new Date().toISOString()
    };
    
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://shipdaily.dev',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=60',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
      }
    });
  } catch (error) {
    console.error('API error:', error);
    
    // 返回明确标识的 Mock 数据
    const mockData = {
      todayStatus: false,
      streakCount: 0,
      monthlyCount: 0,
      monthlyTotal: new Date().getDate(),
      totalCount: 0,
      recentDays: new Array(7).fill(false),
      lastUpdated: new Date().toISOString(),
      dataSource: 'mock',
      error: 'Unable to fetch real data'
    };
    
    return new Response(JSON.stringify(mockData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://shipdaily.dev',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
      }
    });
  }
};

// 处理 OPTIONS 请求 (CORS 预检)
export const OPTIONS: APIRoute = async ({ request }) => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://shipdaily.dev',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
};