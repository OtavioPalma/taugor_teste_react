import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';
import { ToastContextData } from '../models/toast';

export const useToast = (): ToastContextData => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
