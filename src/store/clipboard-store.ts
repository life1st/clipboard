import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ClipboardItem } from './types';
import { 
  DISPLAY_LIMITS, 
  HISTORY_LIMITS, 
  APP_CONFIG,
  type SortBy,
  type SortOrder
} from '../constants';
import { getGist } from '../request'
import { useSettingsStore } from './settings-store';

interface ClipboardState {
  // 核心数据
  items: ClipboardItem[];
  
  // 应用状态
  loading: boolean;
  error: string;
  lastSync: string | null; // 最后同步时间
  
  // 显示设置
  maxItems: number; // 最大显示项目数
  sortBy: SortBy; // 排序方式
  sortOrder: SortOrder; // 排序顺序
  
  // 历史数据管理
  history: ClipboardItem[][]; // 历史版本数组
  maxHistorySize: number; // 最大历史版本数
  currentHistoryIndex: number; // 当前历史版本索引
  
  // Actions
  addItem: (content: string) => void;
  deleteItem: (id: string) => void;
  clearAll: () => void;
  loadFromGist: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
  setMaxItems: (max: number) => void;
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (order: SortOrder) => void;
  resetSettings: () => void;
  
  // 历史数据管理 Actions
  saveToHistory: () => void; // 保存当前状态到历史
  undo: () => void; // 撤销到上一个版本
  redo: () => void; // 重做到下一个版本
  clearHistory: () => void; // 清空历史记录
  restoreFromHistory: (index: number) => void; // 从指定历史版本恢复
  setMaxHistorySize: (size: number) => void; // 设置最大历史版本数
}

export const useClipboardStore = create<ClipboardState>()(
  persist(
    (set, get) => ({
      // 初始状态
      items: [],
      loading: false,
      error: '',
      lastSync: null,
      maxItems: APP_CONFIG.DEFAULT_MAX_ITEMS,
      sortBy: APP_CONFIG.DEFAULT_SORT_BY,
      sortOrder: APP_CONFIG.DEFAULT_SORT_ORDER,
      
      // 历史数据管理
      history: [],
      maxHistorySize: APP_CONFIG.DEFAULT_MAX_HISTORY,
      currentHistoryIndex: -1,
      
      // Actions
      addItem: (content: string) => {
        const newItem: ClipboardItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          content: content.trim(),
          timestamp: new Date().toISOString(),
        };
        
        set((state) => ({
          items: [newItem, ...state.items],
          error: ''
        }));
        
        // 自动保存到历史
        get().saveToHistory();
      },
      
      deleteItem: (id: string) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }));
        
        // 自动保存到历史
        get().saveToHistory();
      },
      
      clearAll: () => {
        set({ items: [] });
        
        // 自动保存到历史
        get().saveToHistory();
      },
      
      loadFromGist: async () => {
        // 保存当前状态到历史（如果有数据的话）
        if (get().items.length > 0) {
          get().saveToHistory();
        }
        const { setLoading, setError, loading } = get()
        const { gistId, githubToken } = useSettingsStore.getState()
        // items: ClipboardItem[]
        if (gistId && githubToken && !loading) {
          setLoading(true)
          setError('')
          
          try {
            const gist = await getGist(gistId)
            const items: any[] = []
            
            // 遍历 Gist 中的文件
            Object.entries(gist.files).forEach(([, file]: [string, any]) => {
              try {
                const fileContent = JSON.parse(file.content)
                if (fileContent.items && Array.isArray(fileContent.items)) {
                  // 如果是新的数据结构（包含 items 数组）
                  items.push(...fileContent.items)
                } else if (Array.isArray(fileContent)) {
                  // 如果是旧的数据结构（直接是数组）
                  items.push(...fileContent)
                }
              } catch (e) {
                // 如果文件内容不是 JSON 格式，跳过
              }
            })
            
            set({
              items,
              error: '',
              lastSync: new Date().toISOString()
            })
          } catch (err: any) {
            setError(`加载失败: ${err.message}`)
          }
          setLoading(false)
        }
      },
      
      setLoading: (loading: boolean) => {
        set({ loading });
      },
      
      setError: (error: string) => {
        set({ error });
      },
      
      clearError: () => {
        set({ error: '' });
      },
      
      setMaxItems: (max: number) => {
        set({ maxItems: Math.max(DISPLAY_LIMITS.MIN_ITEMS, Math.min(DISPLAY_LIMITS.MAX_ITEMS, max)) });
      },
      
      setSortBy: (sortBy: SortBy) => {
        set({ sortBy });
      },
      
      setSortOrder: (order: SortOrder) => {
        set({ sortOrder: order });
      },
      
      resetSettings: () => {
        set({
          maxItems: APP_CONFIG.DEFAULT_MAX_ITEMS,
          sortBy: APP_CONFIG.DEFAULT_SORT_BY,
          sortOrder: APP_CONFIG.DEFAULT_SORT_ORDER
        });
      },
      
      // 历史数据管理 Actions
      saveToHistory: () => {
        const { items, history, maxHistorySize, currentHistoryIndex } = get();
        
        // 如果当前状态与最新历史版本相同，不保存
        if (history.length > 0 && currentHistoryIndex >= 0) {
          const latestHistory = history[currentHistoryIndex];
          if (JSON.stringify(latestHistory) === JSON.stringify(items)) {
            return;
          }
        }
        
        // 创建新的历史版本
        const newHistory = [...history];
        
        // 如果当前不在最新版本，删除后面的版本
        if (currentHistoryIndex < history.length - 1) {
          newHistory.splice(currentHistoryIndex + 1);
        }
        
        // 添加新版本
        newHistory.push([...items]);
        
        // 限制历史版本数量
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
        }
        
        set({
          history: newHistory,
          currentHistoryIndex: newHistory.length - 1
        });
      },
      
      undo: () => {
        const { history, currentHistoryIndex } = get();
        if (currentHistoryIndex > 0) {
          const newIndex = currentHistoryIndex - 1;
          set({
            items: [...history[newIndex]],
            currentHistoryIndex: newIndex
          });
        }
      },
      
      redo: () => {
        const { history, currentHistoryIndex } = get();
        if (currentHistoryIndex < history.length - 1) {
          const newIndex = currentHistoryIndex + 1;
          set({
            items: [...history[newIndex]],
            currentHistoryIndex: newIndex
          });
        }
      },
      
      clearHistory: () => {
        set({
          history: [],
          currentHistoryIndex: -1
        });
      },
      
      restoreFromHistory: (index: number) => {
        const { history } = get();
        if (index >= 0 && index < history.length) {
          set({
            items: [...history[index]],
            currentHistoryIndex: index
          });
        }
      },
      
      setMaxHistorySize: (size: number) => {
        const { history } = get();
        const newSize = Math.max(HISTORY_LIMITS.MIN_SIZE, Math.min(HISTORY_LIMITS.MAX_SIZE, size));
        
        // 如果新的历史大小小于当前历史数量，需要截断
        let newHistory = [...history];
        if (newHistory.length > newSize) {
          newHistory = newHistory.slice(-newSize);
        }
        
        set({
          maxHistorySize: newSize,
          history: newHistory,
          currentHistoryIndex: Math.min(get().currentHistoryIndex, newHistory.length - 1)
        });
      }
    }),
    {
      name: 'clipboard-storage',
      version: 1,
      partialize: state => {
        const { loading, error, ...rest } = state
        return rest
      }
    }
  )
);
