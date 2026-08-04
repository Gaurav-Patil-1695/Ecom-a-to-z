import { useCallback } from 'react';
import { useContext } from 'react';
import { ToastContext } from '@/context/ToastContext';

const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast } = context;

  const toast = useCallback(
    (message, options = {}) => {
      const { type = 'info', duration = 4000, ...rest } = options;
      addToast({ message, type, duration, ...rest });
    },
    [addToast]
  );

  const toastSuccess = useCallback(
    (message, options = {}) => {
      toast(message, { ...options, type: 'success' });
    },
    [toast]
  );

  const toastError = useCallback(
    (message, options = {}) => {
      toast(message, { ...options, type: 'error' });
    },
    [toast]
  );

  const toastWarning = useCallback(
    (message, options = {}) => {
      toast(message, { ...options, type: 'warning' });
    },
    [toast]
  );

  const toastInfo = useCallback(
    (message, options = {}) => {
      toast(message, { ...options, type: 'info' });
    },
    [toast]
  );

  return { toast, toastSuccess, toastError, toastWarning, toastInfo, removeToast };
};

export default useToast;
