// 可访问性辅助工具库
export class AccessibilityHelper {
  // 焦点管理
  static manageFocus() {
    // 为跳过链接添加焦点样式
    const skipLinks = document.querySelectorAll('.sr-only');
    skipLinks.forEach(link => {
      link.addEventListener('focus', (e) => {
        (e.target as HTMLElement).classList.add('focus:not-sr-only');
      });
      
      link.addEventListener('blur', (e) => {
        (e.target as HTMLElement).classList.remove('focus:not-sr-only');
      });
    });
  }

  // 键盘导航支持
  static enableKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Escape 键关闭模态框
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach(modal => {
          if (!modal.classList.contains('hidden')) {
            this.closeModal(modal as HTMLElement);
          }
        });
      }
      
      // Tab 键焦点管理
      if (e.key === 'Tab') {
        this.handleTabKey(e);
      }
    });
  }

  // 关闭模态框
  private static closeModal(modal: HTMLElement) {
    modal.classList.add('hidden');
    
    // 恢复焦点到触发元素
    const trigger = document.querySelector(`[aria-controls="${modal.id}"]`) as HTMLElement;
    if (trigger) {
      trigger.focus();
    }
    
    // 更新 ARIA 属性
    const triggers = document.querySelectorAll(`[aria-controls="${modal.id}"]`);
    triggers.forEach(trigger => {
      trigger.setAttribute('aria-expanded', 'false');
    });
  }

  // Tab 键焦点循环
  private static handleTabKey(e: KeyboardEvent) {
    const focusableElements = this.getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  // 获取可焦点元素
  private static getFocusableElements(): HTMLElement[] {
    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    return Array.from(document.querySelectorAll(focusableSelector)) as HTMLElement[];
  }

  // 屏幕阅读器公告
  static announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    
    document.body.appendChild(announcer);
    
    // 使用 setTimeout 确保屏幕阅读器能捕获到变化
    setTimeout(() => {
      announcer.textContent = message;
      
      // 3秒后移除公告元素
      setTimeout(() => {
        document.body.removeChild(announcer);
      }, 3000);
    }, 100);
  }

  // 色彩对比度检查（简化版）
  static checkColorContrast() {
    if (process.env.NODE_ENV === 'development') {
      // 在开发环境中检查对比度
      const elements = document.querySelectorAll('*');
      elements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const backgroundColor = styles.backgroundColor;
        const color = styles.color;
        
        // 这里可以实现对比度计算逻辑
        // 目前只是一个占位符
        if (backgroundColor !== 'rgba(0, 0, 0, 0)' && color !== 'rgba(0, 0, 0, 0)') {
          // console.log(`Element contrast check:`, { backgroundColor, color });
        }
      });
    }
  }

  // 初始化所有可访问性功能
  static init() {
    if (typeof window === 'undefined') return;
    
    this.manageFocus();
    this.enableKeyboardNavigation();
    
    // 页面加载完成后的检查
    window.addEventListener('load', () => {
      this.checkColorContrast();
    });
    
    // 宣布页面加载完成
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        this.announce('页面加载完成');
      }, 1000);
    });
  }
}