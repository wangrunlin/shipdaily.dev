// 移动端兼容性检测和优化工具
export class MobileCompatibility {
  private static userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  
  // 设备检测
  static detectDevice() {
    const isIOS = /iPad|iPhone|iPod/.test(this.userAgent);
    const isAndroid = /Android/.test(this.userAgent);
    const isSafari = /Safari/.test(this.userAgent) && !/Chrome/.test(this.userAgent);
    const isChrome = /Chrome/.test(this.userAgent);
    const isMobile = /Mobi|Android/i.test(this.userAgent);
    const isTablet = /Tablet|iPad/.test(this.userAgent);
    
    return {
      isIOS,
      isAndroid,
      isSafari,
      isChrome,
      isMobile,
      isTablet,
      isDesktop: !isMobile && !isTablet
    };
  }
  
  // 视窗高度修复 (iOS Safari)
  static fixViewportHeight() {
    if (typeof window === 'undefined') return;
    
    const device = this.detectDevice();
    
    if (device.isIOS && device.isSafari) {
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      
      setVH();
      window.addEventListener('resize', setVH);
      window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 500);
      });
    }
  }
  
  // 触摸事件优化
  static optimizeTouchEvents() {
    if (typeof document === 'undefined') return;
    
    // 为所有按钮和链接添加 active 状态
    const touchTargets = document.querySelectorAll('button, a, [role="button"]');
    
    touchTargets.forEach(element => {
      element.addEventListener('touchstart', function(this: Element) {
        this.classList.add('touch-active');
      }, { passive: true });
      
      element.addEventListener('touchend', function(this: Element) {
        setTimeout(() => {
          this.classList.remove('touch-active');
        }, 150);
      }, { passive: true });
      
      element.addEventListener('touchcancel', function(this: Element) {
        this.classList.remove('touch-active');
      }, { passive: true });
    });
  }
  
  // 滚动性能优化
  static optimizeScrolling() {
    if (typeof document === 'undefined') return;
    
    // 为可滚动元素添加硬件加速
    const scrollableElements = document.querySelectorAll('.overflow-auto, .overflow-y-auto, .overflow-x-auto');
    
    scrollableElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.transform = 'translateZ(0)';
      (htmlElement.style as any).webkitOverflowScrolling = 'touch';
    });
    
    // 优化滚动事件
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // 在这里处理滚动相关的操作
          ticking = false;
        });
        ticking = true;
      }
    };
    
    document.addEventListener('scroll', handleScroll, { passive: true });
  }
  
  // 字体大小适配
  static adaptFontSize() {
    if (typeof window === 'undefined') return;
    
    const device = this.detectDevice();
    
    if (device.isMobile && window.innerWidth < 375) {
      document.documentElement.classList.add('small-screen');
    }
  }
  
  // 网络状态检测和优化
  static handleNetworkConditions() {
    if (!('connection' in navigator)) return;
    
    const connection = (navigator as any).connection;
    
    if (connection) {
      const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                              connection.effectiveType === '2g' ||
                              connection.effectiveType === '3g';
      
      if (isSlowConnection) {
        // 慢网络优化
        document.documentElement.classList.add('slow-network');
        
        // 延迟加载非关键资源
        this.deferNonCriticalResources();
      }
      
      // 监听网络状态变化
      connection.addEventListener('change', () => {
        if (connection.effectiveType === '4g' || connection.effectiveType === '5g') {
          document.documentElement.classList.remove('slow-network');
        } else if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          document.documentElement.classList.add('slow-network');
        }
      });
    }
  }
  
  // 延迟加载非关键资源
  private static deferNonCriticalResources() {
    // 延迟加载图片
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  // 输入优化 (防止缩放)
  static optimizeInputs() {
    if (typeof document === 'undefined') return;
    
    const device = this.detectDevice();
    
    if (device.isIOS) {
      // 确保所有输入框字体大小至少 16px，防止 iOS 自动缩放
      const inputs = document.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        const computedStyle = window.getComputedStyle(input);
        const fontSize = parseFloat(computedStyle.fontSize);
        
        if (fontSize < 16) {
          (input as HTMLElement).style.fontSize = '16px';
        }
      });
    }
  }
  
  // PWA 支持检测
  static checkPWASupport() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    
    const supportsServiceWorker = 'serviceWorker' in navigator;
    const supportsWebManifest = 'onbeforeinstallprompt' in window;
    
    return {
      isStandalone,
      supportsServiceWorker,
      supportsWebManifest,
      canInstall: supportsServiceWorker && supportsWebManifest
    };
  }
  
  // 初始化所有移动端优化
  static init() {
    if (typeof window === 'undefined') return;
    
    this.fixViewportHeight();
    this.optimizeTouchEvents();
    this.optimizeScrolling();
    this.adaptFontSize();
    this.handleNetworkConditions();
    this.optimizeInputs();
    
    // 设备信息日志（开发环境）
    if (process.env.NODE_ENV === 'development') {
      const device = this.detectDevice();
      const pwa = this.checkPWASupport();
      
      console.log('Mobile Compatibility Info:', {
        device,
        pwa,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          pixelRatio: window.devicePixelRatio
        }
      });
    }
  }
}