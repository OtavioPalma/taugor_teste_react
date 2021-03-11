import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiUser, FiXCircle } from 'react-icons/fi';
import * as Yup from 'yup';
import { Activity } from '../../models/activity';
import { User } from '../../models/auth';
import { getUsers } from '../../services/firebase';
import { Button } from '../Button/Button';
import { Select } from '../Select/Select';
import styles from './styles.module.scss';

interface ModalProps {
  activity: Activity;
  visible: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => void;
}

export const UserModal: React.FC<ModalProps> = ({
  activity,
  visible,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState({ user: activity.user });
  const [formErrors, setFormErrors] = useState({ user: undefined });

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

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
    setUsers([]);

    setLoading(true);

    getUsers().then(res => {
      res.forEach(doc => {
        setUsers(state => [...state, { ...(doc.data() as User) }]);
      });

      setLoading(false);
    });
  }, []);

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
      setFormErrors({ user: undefined });

      const schema = Yup.object().shape({
        user: Yup.string().required('Usuário Responsável é obrigatório'),
      });

      await schema.validate(form, { abortEarly: false });

      onSave({ ...activity, ...form } as Activity);
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
  }, [form, activity, onSave]);

  return (
    <>
      {visible &&
        (loading ? (
          <div>loading...</div>
        ) : (
          <div className={styles.overlay} ref={overlayRef}>
            <div className={styles.container}>
              <div className={styles.container_header}>
                <h1>Editar Usuário da Atividade</h1>

                <FiXCircle onClick={onClose} size={30} />
              </div>

              <Select
                icon={FiUser}
                name="user"
                placeholder="Escolha o Usuário Responsável"
                value={form.user}
                error={formErrors.user}
                onChange={handleFormChange}
                options={users.map(user => ({
                  name: user.displayName,
                  value: user.uid,
                }))}
              />

              <div className={styles.container_submit}>
                <Button onClick={handleFormSubmit}>Salvar</Button>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};
