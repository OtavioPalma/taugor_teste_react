import React, { createContext, useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Toast } from '../components/Toast/Toast';
import { ToastContextData, ToastMessage } from '../models/toast';

export const ToastContext = createContext<ToastContextData>(
  {} as ToastContextData,
);

export const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setMessages(state => state.filter(message => message.id !== id));
  }, []);

  const addToast = useCallback(
    ({
      type,
      title,
      description,
      duration = 3000,
    }: Omit<ToastMessage, 'id'>) => {
      const id = uuid();
      const toast = { id, type, title, description };

      setMessages(state => [...state, toast]);
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      <Toast messages={messages} />
    </ToastContext.Provider>
  );
};
