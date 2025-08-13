// 页面预加载工具
export class PagePreloader {
  private static preloadedPages = new Set<string>();
  private static preloadPromises = new Map<string, Promise<any>>();

  /**
   * 预加载页面
   * @param pagePath 页面路径
   */
  static preloadPage(pagePath: string): void {
    if (this.preloadedPages.has(pagePath)) {
      return; // 已经预加载过了
    }

    // 根据路径预加载对应的页面
    switch (pagePath) {

      case '/clipboard':
        this.preloadClipboard();
        break;

      case '/settings':
        this.preloadSettings();
        break;
    }
  }



  /**
   * 预加载剪贴板页面
   */
  private static preloadClipboard(): void {
    if (!this.preloadPromises.has('clipboard')) {
      const promise = import('../pages/clipboard-list');
      this.preloadPromises.set('clipboard', promise);
      promise.then(() => {
        this.preloadedPages.add('clipboard');
        this.preloadPromises.delete('clipboard');
      });
    }
  }



  /**
   * 预加载设置页面
   */
  private static preloadSettings(): void {
    if (!this.preloadPromises.has('settings')) {
      const promise = import('../pages/settings');
      this.preloadPromises.set('settings', promise);
      promise.then(() => {
        this.preloadedPages.add('settings');
        this.preloadPromises.delete('settings');
      });
    }
  }

  /**
   * 检查页面是否已预加载
   * @param pagePath 页面路径
   */
  static isPreloaded(pagePath: string): boolean {
    const pageName = this.getPageName(pagePath);
    return this.preloadedPages.has(pageName);
  }

  /**
   * 获取页面名称
   * @param pagePath 页面路径
   */
  private static getPageName(pagePath: string): string {
    switch (pagePath) {

      case '/clipboard': return 'clipboard';

      case '/settings': return 'settings';
      default: return '';
    }
  }

  /**
   * 清除预加载状态
   */
  static clear(): void {
    this.preloadedPages.clear();
    this.preloadPromises.clear();
  }
} 