import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PasteModalState {
  // 状态
  isOpen: boolean;
  content: string;
  lastClipboardContent: string; // 上次检测到的剪贴板内容
  
  // Actions
  openModal: (content?: string) => void;
  closeModal: () => void;
  setContent: (content: string) => void;
  setLastClipboardContent: (content: string) => void;
  reset: () => void;
}

export const usePasteModalStore = create<PasteModalState>()(
  persist(
    (set) => ({
      // 初始状态
      isOpen: false,
      content: '',
      lastClipboardContent: '',
      
      // Actions
      openModal: (content = '') => {
        set({
          isOpen: true,
          content
        });
      },
      
      closeModal: () => {
        set({
          isOpen: false,
          content: ''
        });
      },
      
      setContent: (content: string) => {
        set({ content });
      },
      
      setLastClipboardContent: (content: string) => {
        set({ lastClipboardContent: content });
      },
      
      reset: () => {
        set({
          isOpen: false,
          content: '',
          lastClipboardContent: ''
        });
      }
    }),
    {
      name: 'paste-modal-storage',
      version: 1,
      partialize: state => {
        // 只持久化 lastClipboardContent，不持久化 isOpen 和 content
        const { isOpen, content, ...rest } = state;
        return rest;
      }
    }
  )
); 