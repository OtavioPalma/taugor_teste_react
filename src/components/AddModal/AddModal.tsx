import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FiBarChart2,
  FiCheckCircle,
  FiFileText,
  FiUser,
  FiXCircle,
} from 'react-icons/fi';
import * as Yup from 'yup';
import { useToast } from '../../hooks/useToast';
import { Activity } from '../../models/activity';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import styles from './styles.module.scss';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => void;
}

export const AddModal: React.FC<ModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState({
    title: '',
    status: '',
    description: '',
    user: '',
  });
  const [formErrors, setFormErrors] = useState({
    title: undefined,
    status: undefined,
    description: undefined,
    user: undefined,
  });

  const { addToast } = useToast();

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

  const resetForm = () =>
    setForm({
      title: '',
      status: '',
      description: '',
      user: '',
    });

  const resetFormErrors = () =>
    setFormErrors({
      title: undefined,
      status: undefined,
      description: undefined,
      user: undefined,
    });

  const handleFormSubmit = useCallback(async () => {
    try {
      resetFormErrors();

      const schema = Yup.object().shape({
        title: Yup.string().required('Título é obrigatório'),
        status: Yup.string().required('Status é obrigatório'),
        description: Yup.string().required('Descrição é obrigatória'),
        user: Yup.string().required('Usuário Responsável é obrigatório'),
      });

      await schema.validate(form, { abortEarly: false });

      onSave(form as Activity);

      resetForm();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach(error => {
          setFormErrors(state => ({
            ...state,
            [error.path as string]: error.message,
          }));
        });

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro',
        description: 'Descrição',
      });
    }
  }, [form, addToast, onSave]);

  return (
    <>
      {visible && (
        <div className={styles.overlay} ref={overlayRef}>
          <div className={styles.container}>
            <div className={styles.container_header}>
              <h1>Adicionar Atividade</h1>

              <FiXCircle onClick={onClose} size={30} />
            </div>

            <Input
              icon={FiCheckCircle}
              name="title"
              placeholder="Título"
              value={form.title}
              error={formErrors.title}
              onChange={handleFormChange}
            />

            <Select
              icon={FiBarChart2}
              name="status"
              placeholder="Escolha um Status"
              value={form.status}
              error={formErrors.status}
              onChange={handleFormChange}
              options={['Pendente', 'Em andamento', 'Finalizada', 'Cancelada']}
            />

            <Input
              icon={FiFileText}
              name="description"
              placeholder="Descrição"
              value={form.description}
              error={formErrors.description}
              onChange={handleFormChange}
            />

            <Input
              icon={FiUser}
              name="user"
              placeholder="Usuário Responsável"
              value={form.user}
              error={formErrors.user}
              onChange={handleFormChange}
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
