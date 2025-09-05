// Web Vitals 性能监控
export interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

// 简化的 Web Vitals 实现
export class WebVitals {
  private static metrics: Map<string, number> = new Map();

  static init() {
    if (typeof window === 'undefined') return;

    // 监控 LCP (Largest Contentful Paint)
    this.observeLCP();
    
    // 监控 FID (First Input Delay)
    this.observeFID();
    
    // 监控 CLS (Cumulative Layout Shift)
    this.observeCLS();
  }

  private static observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.set('LCP', lastEntry.startTime);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Graceful fallback
    }
  }

  private static observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const firstInput = list.getEntries()[0] as PerformanceEntry & { processingStart?: number };
        if (firstInput && firstInput.processingStart) {
          const fid = firstInput.processingStart - firstInput.startTime;
          this.metrics.set('FID', fid);
        }
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // Graceful fallback
    }
  }

  private static observeCLS() {
    let clsValue = 0;
    
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.metrics.set('CLS', clsValue);
          }
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // Graceful fallback
    }
  }

  static getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  static reportMetrics() {
    const metrics = this.getMetrics();
    
    // 在开发环境中输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.table(metrics);
    }
    
    // 可以集成到分析工具
    // analytics.track('web-vitals', metrics);
  }
}