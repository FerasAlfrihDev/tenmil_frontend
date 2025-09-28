import { useState, useCallback } from 'react';
import type { ToastData, ToastType } from '../components/ui/Toast/Toast';

interface UseToastReturn {
  toasts: ToastData[];
  showToast: (type: ToastType, title: string, message?: string, options?: Partial<ToastData>) => string;
  showSuccess: (title: string, message?: string, options?: Partial<ToastData>) => string;
  showError: (title: string, message?: string, options?: Partial<ToastData>) => string;
  showWarning: (title: string, message?: string, options?: Partial<ToastData>) => string;
  showInfo: (title: string, message?: string, options?: Partial<ToastData>) => string;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
}

let toastIdCounter = 0;

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const generateId = useCallback(() => {
    return `toast-${++toastIdCounter}-${Date.now()}`;
  }, []);

  const showToast = useCallback((
    type: ToastType,
    title: string,
    message: string = '',
    options: Partial<ToastData> = {}
  ): string => {
    const id = generateId();
    const toast: ToastData = {
      id,
      type,
      title,
      message,
      duration: 5000,
      persistent: false,
      ...options,
    };

    setToasts(prev => [...prev, toast]);
    return id;
  }, [generateId]);

  const showSuccess = useCallback((
    title: string,
    message: string = '',
    options: Partial<ToastData> = {}
  ): string => {
    return showToast('success', title, message, options);
  }, [showToast]);

  const showError = useCallback((
    title: string,
    message: string = '',
    options: Partial<ToastData> = {}
  ): string => {
    return showToast('error', title, message, { duration: 7000, ...options });
  }, [showToast]);

  const showWarning = useCallback((
    title: string,
    message: string = '',
    options: Partial<ToastData> = {}
  ): string => {
    return showToast('warning', title, message, options);
  }, [showToast]);

  const showInfo = useCallback((
    title: string,
    message: string = '',
    options: Partial<ToastData> = {}
  ): string => {
    return showToast('info', title, message, options);
  }, [showToast]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissToast,
    dismissAll,
  };
};
