import { create } from 'zustand';

interface PasteModalState {
  // 状态
  isOpen: boolean;
  content: string;
  
  // Actions
  openModal: (content?: string) => void;
  closeModal: () => void;
  setContent: (content: string) => void;
  reset: () => void;
}

export const usePasteModalStore = create<PasteModalState>((set) => ({
  // 初始状态
  isOpen: false,
  content: '',
  
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
  
  reset: () => {
    set({
      isOpen: false,
      content: ''
    });
  }
})); 