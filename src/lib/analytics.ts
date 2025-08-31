// Plausible Analytics 辅助工具
export class Analytics {
  private static plausible = typeof window !== 'undefined' ? (window as any).plausible : null;
  
  // 检查 Plausible 是否可用
  static isAvailable(): boolean {
    return this.plausible && typeof this.plausible === 'function';
  }
  
  // 跟踪页面浏览（通常由 Plausible 自动处理）
  static trackPageView(path?: string) {
    if (!this.isAvailable()) return;
    
    try {
      this.plausible('pageview', path ? { u: path } : undefined);
    } catch (error) {
      console.warn('Analytics: Failed to track page view:', error);
    }
  }
  
  // 跟踪自定义事件
  static trackEvent(eventName: string, props?: Record<string, string | number>) {
    if (!this.isAvailable()) return;
    
    try {
      this.plausible(eventName, { props });
    } catch (error) {
      console.warn('Analytics: Failed to track event:', error);
    }
  }
  
  // 跟踪出站链接点击
  static trackOutboundLink(url: string, text?: string) {
    this.trackEvent('Outbound Link: Click', {
      url,
      text: text || 'Unknown'
    });
  }
  
  // 跟踪文件下载
  static trackFileDownload(filename: string, url?: string) {
    this.trackEvent('File Download', {
      filename,
      url: url || 'Unknown'
    });
  }
  
  // 跟踪社交媒体互动
  static trackSocialShare(platform: string, url?: string) {
    this.trackEvent('Social Share', {
      platform,
      url: url || window.location.href
    });
  }
  
  // 跟踪用户参与度
  static trackEngagement(action: string, section: string, value?: string) {
    this.trackEvent('User Engagement', {
      action,
      section,
      value: value || 'N/A'
    });
  }
  
  // 跟踪 ShipDaily 相关事件
  static trackShipDaily = {
    // 查看统计数据
    viewStats: (dataSource: string) => {
      Analytics.trackEvent('ShipDaily: View Stats', {
        dataSource,
        timestamp: new Date().toISOString()
      });
    },
    
    // 点击进度卡片
    clickProgressCard: (cardType: string) => {
      Analytics.trackEvent('ShipDaily: Click Progress Card', {
        cardType
      });
    },
    
    // 查看日历
    viewCalendar: (period: string = 'week') => {
      Analytics.trackEvent('ShipDaily: View Calendar', {
        period
      });
    },
    
    // 社区互动
    communityInteraction: (action: string, content?: string) => {
      Analytics.trackEvent('ShipDaily: Community Interaction', {
        action,
        content: content || 'N/A'
      });
    },
    
    // 联系表单互动
    contactInteraction: (method: string) => {
      Analytics.trackEvent('ShipDaily: Contact Interaction', {
        method
      });
    }
  };
  
  // 跟踪性能指标
  static trackPerformance(metric: string, value: number, unit: string = 'ms') {
    this.trackEvent('Performance Metric', {
      metric,
      value: value.toString(),
      unit
    });
  }
  
  // 跟踪错误
  static trackError(error: string, context?: string) {
    this.trackEvent('Error', {
      error: error.substring(0, 100), // 限制长度
      context: context || 'Unknown'
    });
  }
  
  // 批量初始化事件监听
  static initEventTracking() {
    if (typeof window === 'undefined') return;
    
    // 自动跟踪外部链接点击
    document.addEventListener('click', (e) => {
      const link = (e.target as Element).closest('a');
      if (link && link.href && this.isExternalLink(link.href)) {
        this.trackOutboundLink(link.href, link.textContent?.trim());
      }
    });
    
    // 自动跟踪文件下载
    document.addEventListener('click', (e) => {
      const link = (e.target as Element).closest('a');
      if (link && link.href && this.isDownloadLink(link.href)) {
        const filename = this.getFilenameFromUrl(link.href);
        this.trackFileDownload(filename, link.href);
      }
    });
    
    // 跟踪页面停留时间
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      this.trackEvent('Time on Page', {
        seconds: timeSpent.toString(),
        page: window.location.pathname
      });
    });
  }
  
  // 辅助方法：检查是否为外部链接
  private static isExternalLink(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname !== window.location.hostname;
    } catch {
      return false;
    }
  }
  
  // 辅助方法：检查是否为下载链接
  private static isDownloadLink(url: string): boolean {
    const downloadExtensions = [
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
      '.zip', '.rar', '.tar', '.gz', '.7z',
      '.mp3', '.wav', '.mp4', '.avi', '.mov',
      '.jpg', '.jpeg', '.png', '.gif', '.svg',
      '.json', '.xml', '.csv'
    ];
    
    return downloadExtensions.some(ext => url.toLowerCase().includes(ext));
  }
  
  // 辅助方法：从 URL 提取文件名
  private static getFilenameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.split('/').pop() || 'unknown-file';
    } catch {
      return 'unknown-file';
    }
  }
  
  // 初始化分析
  static init() {
    if (typeof window === 'undefined') return;
    
    // 等待 Plausible 脚本加载
    const checkPlausible = () => {
      if (this.isAvailable()) {
        this.initEventTracking();
        console.log('Analytics: Plausible tracking initialized');
      } else {
        // 最多等待 5 秒
        setTimeout(checkPlausible, 100);
      }
    };
    
    // 延迟初始化，确保 DOM 和脚本都已加载
    setTimeout(checkPlausible, 500);
  }
}