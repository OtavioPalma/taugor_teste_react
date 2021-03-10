import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useToast } from '../../hooks/useToast';
import { ToastMessage } from '../../models/toast';
import styles from './styles.module.scss';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const icons = {
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

export const Toast: React.FC<ToastContainerProps> = ({ messages }) => {
  const { removeToast } = useToast();

  return (
    <div className={styles.container}>
      {messages.map(({ id, type, title, description }) => (
        <div
          key={id}
          className={type === 'error' ? styles.error : styles.success}
        >
          {icons[type || 'success']}

          <div>
            <strong>{title}</strong>

            {description && <p>{description}</p>}
          </div>

          <button type="button" onClick={() => removeToast(id)}>
            <FiXCircle size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};
