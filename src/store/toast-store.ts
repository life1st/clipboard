import { create } from 'zustand';
import { ToastType } from '../components/toast';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastState {
  toasts: ToastMessage[];
  showToast: (type: ToastType, message: string, duration?: number) => string;
  showSuccess: (message: string, duration?: number) => string;
  showError: (message: string, duration?: number) => string;
  showWarning: (message: string, duration?: number) => string;
  showInfo: (message: string, duration?: number) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  showToast: (type: ToastType, message: string, duration: number = 3000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: ToastMessage = { id, type, message, duration };
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }));
    
    return id;
  },

  showSuccess: (message: string, duration?: number) => {
    return get().showToast('success', message, duration);
  },

  showError: (message: string, duration?: number) => {
    return get().showToast('error', message, duration);
  },

  showWarning: (message: string, duration?: number) => {
    return get().showToast('warning', message, duration);
  },

  showInfo: (message: string, duration?: number) => {
    return get().showToast('info', message, duration);
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }));
  },

  clearAllToasts: () => {
    set({ toasts: [] });
  }
})); 