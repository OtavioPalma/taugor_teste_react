import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiBarChart2, FiXCircle } from 'react-icons/fi';
import { Activity } from '../../models/activity';
import { Button } from '../Button/Button';
import { Select } from '../Select/Select';
import styles from './styles.module.scss';

interface ModalProps {
  activity: Activity;
  visible: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => void;
}

export const StatusModal: React.FC<ModalProps> = ({
  activity,
  visible,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState({ status: activity.status });

  const overlayRef = useRef(null);
  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (overlayRef.current === event.target) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);

  const handleFormChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target;
      setForm({ ...form, [name]: value });
    },
    [form],
  );

  const handleFormSubmit = useCallback(async () => {
    onSave({ ...activity, ...form } as Activity);
  }, [form, activity, onSave]);

  return (
    <>
      {visible && (
        <div className={styles.overlay} ref={overlayRef}>
          <div className={styles.container}>
            <div className={styles.container_header}>
              <h1>Editar Status de Atividade</h1>

              <FiXCircle onClick={onClose} size={30} />
            </div>

            <Select
              icon={FiBarChart2}
              name="status"
              placeholder="Escolha um Status"
              value={form.status}
              onChange={handleFormChange}
              options={[
                { name: 'Pendente', value: 'pending' },
                { name: 'Em andamento', value: 'running' },
                { name: 'Finalizada', value: 'finished' },
                { name: 'Cancelada', value: 'cancelled' },
              ]}
            />

            <div className={styles.container_submit}>
              <Button onClick={handleFormSubmit}>Salvar</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
