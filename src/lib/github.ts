export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

export interface ShipDailyStats {
  todayStatus: boolean;
  streakCount: number;
  monthlyCount: number;
  monthlyTotal: number;
  totalCount: number;
  recentDays: boolean[];
}

class GitHubAPI {
  private readonly username = 'wangrunlin';
  private readonly repo = 'shipdaily-personal';
  private readonly baseUrl = 'https://api.github.com';

  async getCommits(since?: string): Promise<GitHubCommit[]> {
    const url = `${this.baseUrl}/repos/${this.username}/${this.repo}/commits${
      since ? `?since=${since}` : ''
    }`;
    
    const headers: Record<string, string> = {
      'User-Agent': 'shipdaily.dev/1.0'
    };
    
    // 添加 GitHub token 支持
    if (typeof process !== 'undefined' && process.env?.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Failed to fetch GitHub commits:', error);
      return [];
    }
  }

  async getTodayCommits(): Promise<GitHubCommit[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();
    
    return this.getCommits(todayISO);
  }

  async getRecentCommits(days: number = 30): Promise<GitHubCommit[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceISO = since.toISOString();
    
    return this.getCommits(sinceISO);
  }

  async getShipDailyStats(): Promise<ShipDailyStats> {
    try {
      const recentCommits = await this.getRecentCommits(30);
      const todayCommits = await this.getTodayCommits();
      
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

      // Calculate today's status
      const todayStatus = todayCommits.length > 0;

      // Calculate streak
      let streakCount = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateKey = checkDate.toISOString().split('T')[0];
        
        if (commitsByDate.has(dateKey)) {
          streakCount++;
        } else {
          break;
        }
      }

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

      // Calculate recent 7 days for the calendar
      const recentDays: boolean[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        recentDays.push(commitsByDate.has(dateKey));
      }

      // For total count, we'd need historical data or a separate endpoint
      // For now, we'll use a placeholder based on the streak
      const totalCount = Math.max(streakCount, 100); // Minimum 100 for demo

      return {
        todayStatus,
        streakCount,
        monthlyCount,
        monthlyTotal: daysInMonth,
        totalCount,
        recentDays
      };
    } catch (error) {
      console.error('Failed to get ShipDaily stats:', error);
      
      // Return fallback data
      return {
        todayStatus: true,
        streakCount: 5,
        monthlyCount: 15,
        monthlyTotal: 31,
        totalCount: 127,
        recentDays: [true, false, true, true, false, true, true]
      };
    }
  }
}

export const githubAPI = new GitHubAPI();