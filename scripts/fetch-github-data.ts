#!/usr/bin/env bun

import { isValidGitHubApiUrl, isValidGitHubUsername, isValidGitHubRepoName, sanitizeInput } from '../src/lib/security';

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

interface ShipDailyStats {
  todayStatus: boolean;
  streakCount: number;
  monthlyCount: number;
  monthlyTotal: number;
  totalCount: number;
  recentDays: boolean[];
  lastUpdated: string;
  dataSource: 'real' | 'fallback';
}

const USERNAME = 'wangrunlin';
const REPO = 'shipdaily-personal';
const API_BASE = 'https://api.github.com';

// 验证配置安全性
if (!isValidGitHubUsername(USERNAME)) {
  throw new Error('Invalid GitHub username');
}

if (!isValidGitHubRepoName(REPO)) {
  throw new Error('Invalid GitHub repository name');
}

async function fetchCommits(since?: string): Promise<GitHubCommit[]> {
  const url = `${API_BASE}/repos/${USERNAME}/${REPO}/commits${
    since ? `?since=${since}` : ''
  }`;
  
  // 验证 URL 安全性
  if (!isValidGitHubApiUrl(url)) {
    throw new Error('Invalid GitHub API URL');
  }
  
  const headers: Record<string, string> = {
    'User-Agent': 'shipdaily.dev-fetcher/1.0'
  };
  
  // 安全处理 GitHub Token
  if (process.env.GITHUB_TOKEN) {
    const token = sanitizeInput(process.env.GITHUB_TOKEN.trim());
    if (token && token.length > 0) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  try {
    const response = await fetch(url, { 
      headers,
      signal: AbortSignal.timeout(10000) // 10秒超时
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Repository not found or not accessible (this is expected for private repos)');
        return [];
      }
      if (response.status === 403) {
        console.log('API rate limit exceeded or access denied');
        return [];
      }
      console.log(`GitHub API returned status: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    
    // 验证返回的数据结构
    if (!Array.isArray(data)) {
      console.log('Invalid response format from GitHub API');
      return [];
    }
    
    return data.filter((commit: any) => 
      commit && 
      typeof commit === 'object' &&
      commit.sha && 
      commit.commit &&
      commit.commit.author &&
      commit.commit.author.date
    );
    
  } catch (error) {
    console.log('Failed to fetch GitHub commits (network error or timeout)');
    return [];
  }
}

async function getTodayCommits(): Promise<GitHubCommit[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();
  
  return fetchCommits(todayISO);
}

async function getRecentCommits(days: number = 30): Promise<GitHubCommit[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceISO = since.toISOString();
  
  return fetchCommits(sinceISO);
}

function calculateStreak(commitsByDate: Map<string, GitHubCommit[]>): number {
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateKey = checkDate.toISOString().split('T')[0];
    
    if (commitsByDate.has(dateKey)) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

async function generateStats(): Promise<ShipDailyStats> {
  console.log('Fetching GitHub data...');
  
  const recentCommits = await getRecentCommits(30);
  const todayCommits = await getTodayCommits();
  
  // 如果没有获取到数据，使用降级数据
  if (recentCommits.length === 0 && todayCommits.length === 0) {
    console.log('No data available, using fallback stats');
    
    return {
      todayStatus: false,
      streakCount: 0,
      monthlyCount: 0,
      monthlyTotal: new Date().getDate(),
      totalCount: 0,
      recentDays: new Array(7).fill(false),
      lastUpdated: new Date().toISOString(),
      dataSource: 'fallback'
    };
  }
  
  // Group commits by date
  const commitsByDate = new Map<string, GitHubCommit[]>();
  
  recentCommits.forEach(commit => {
    const date = new Date(commit.commit.author.date);
    date.setHours(0, 0, 0, 0);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!commitsByDate.has(dateKey)) {
      commitsByDate.set(dateKey, []);
    }
    commitsByDate.get(dateKey)!.push(commit);
  });

  // Calculate statistics
  const todayStatus = todayCommits.length > 0;
  const streakCount = calculateStreak(commitsByDate);
  
  // Calculate monthly progress
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  let monthlyCount = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dateKey = date.toISOString().split('T')[0];
    if (commitsByDate.has(dateKey)) {
      monthlyCount++;
    }
  }

  // Calculate recent 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const recentDays: boolean[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    recentDays.push(commitsByDate.has(dateKey));
  }

  // Calculate total (estimated based on available data)
  const totalCount = Math.max(streakCount, commitsByDate.size);

  return {
    todayStatus,
    streakCount,
    monthlyCount,
    monthlyTotal: daysInMonth,
    totalCount,
    recentDays,
    lastUpdated: new Date().toISOString(),
    dataSource: 'real'
  };
}

async function main() {
  try {
    console.log('🔄 Starting GitHub data fetch...');
    const stats = await generateStats();
    
    // 验证输出路径安全性
    const outputPath = 'data/github-stats.json';
    if (!outputPath.match(/^[a-zA-Z0-9/.-]+\.json$/)) {
      throw new Error('Invalid output path');
    }
    
    // 确保输出目录存在
    const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
    await Bun.write(`${dir}/.gitkeep`, ''); // 创建目录
    
    // 写入数据文件
    const jsonData = JSON.stringify(stats, null, 2);
    await Bun.write(outputPath, jsonData);
    
    console.log('✅ GitHub stats updated successfully');
    console.log(`📊 Today: ${stats.todayStatus ? '✅' : '❌'}`);
    console.log(`🔥 Streak: ${stats.streakCount} days`);
    console.log(`📅 Monthly: ${stats.monthlyCount}/${stats.monthlyTotal}`);
    console.log(`📈 Total: ${stats.totalCount} days`);
    console.log(`🔄 Data source: ${stats.dataSource}`);
    console.log(`📝 Output: ${outputPath} (${jsonData.length} bytes)`);
    
  } catch (error) {
    // 不暴露敏感错误信息
    if (error instanceof Error) {
      console.error('❌ Failed to update GitHub stats:', error.message);
    } else {
      console.error('❌ Failed to update GitHub stats: Unknown error');
    }
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}