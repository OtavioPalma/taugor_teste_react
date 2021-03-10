export interface ToastMessage {
  id: string;
  type?: 'success' | 'error';
  title: string;
  description?: string;
  duration?: number;
}

export interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}
