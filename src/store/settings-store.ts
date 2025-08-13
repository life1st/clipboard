import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsState {
  // 核心配置
  githubToken: string;
  gistId: string;
  
  // 应用设置
  autoSync: boolean;
  syncInterval: number; // 同步间隔（分钟）
  
  // Actions
  setToken: (token: string) => void;
  setGistId: (id: string) => void;
  removeToken: () => void;
  setAutoSync: (enabled: boolean) => void;
  setSyncInterval: (minutes: number) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // 初始状态
      githubToken: '',
      gistId: '',
      autoSync: false,
      syncInterval: 5,

      // Actions
      setToken: (token: string) => {
        set({ githubToken: token.trim() });
      },

      setGistId: (id: string) => {
        set({ gistId: id.trim() });
      },

      removeToken: () => {
        set({ githubToken: '' });
      },

      setAutoSync: (enabled: boolean) => {
        set({ autoSync: enabled });
      },

      setSyncInterval: (minutes: number) => {
        set({ syncInterval: Math.max(1, Math.min(60, minutes)) });
      },

      resetSettings: () => {
        set({
          githubToken: '',
          gistId: '',
          autoSync: false,
          syncInterval: 5
        });
      }
    }),
    {
      name: 'settings-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);