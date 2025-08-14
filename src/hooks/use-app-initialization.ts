import { useEffect, useRef } from 'react';
import { debounce } from 'lodash-es';
import { useClipboardStore, useSettingsStore } from '../store';

export const useAppInitialization = () => {

  const { loadFromGist } = useClipboardStore();
  const lastClipboardContent = useRef<string>('');

  // 使用 useCallback 和 debounce 来避免重复触发
  const throttledHandleFocus = debounce(async () => {
    const isHidden = document.hidden
    const hasFocus = document.hasFocus()
    if (isHidden || !hasFocus) {
      return
    }
    // 页面重新获得焦点时，从gist拉取最新数据
    loadFromGist();

    // 检测剪贴板内容变化
    if (navigator.clipboard && navigator.clipboard.readText) {
      try {
        const content = await navigator.clipboard.readText()
        console.log(content, 'content detecting')
        if (content && content !== lastClipboardContent.current) {
          lastClipboardContent.current = content;
        }
      } catch (err) {
        console.warn('无法读取剪贴板内容:', err);
      }
    }
  }, 300)

  useEffect(() => {
    const initializeApp = async () => {
      await Promise.all([
        useSettingsStore.persist.rehydrate(),
        useClipboardStore.persist.rehydrate(),
      ]);
      loadFromGist();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        throttledHandleFocus();
      }
    };

    // 初始化应用
    initializeApp();

    // 监听文档可见性变化（切换标签页时）
    document.addEventListener('visibilitychange', handleVisibilityChange);

    throttledHandleFocus();

    // 清理事件监听器
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // 清理 throttle 函数
      throttledHandleFocus.cancel();
    };
  }, []);

  return {
    lastClipboardContent: lastClipboardContent.current
  };
}; 