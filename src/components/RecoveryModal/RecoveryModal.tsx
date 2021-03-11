import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiUser, FiXCircle } from 'react-icons/fi';
import * as Yup from 'yup';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import styles from './styles.module.scss';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (email: string) => void;
}

export const RecoveryModal: React.FC<ModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState({ email: '' });
  const [formErrors, setFormErrors] = useState({ email: undefined });

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
    try {
      setFormErrors({ email: undefined });

      const schema = Yup.object().shape({
        email: Yup.string().email().required('Email é obrigatório'),
      });

      await schema.validate(form, { abortEarly: false });

      onSave(form.email);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach(error => {
          setFormErrors(state => ({
            ...state,
            [error.path as string]: error.message,
          }));
        });
      }
    }
  }, [form, onSave]);

  return (
    <>
      {visible && (
        <div className={styles.overlay} ref={overlayRef}>
          <div className={styles.container}>
            <div className={styles.container_header}>
              <h1>Recuperar senha de Acesso</h1>

              <FiXCircle onClick={onClose} size={30} />
            </div>

            <Input
              icon={FiUser}
              name="email"
              placeholder="E-mail cadastrado"
              value={form.email}
              error={formErrors.email}
              onChange={handleFormChange}
            />

            <div className={styles.container_submit}>
              <Button onClick={handleFormSubmit}>Enviar E-mail</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
