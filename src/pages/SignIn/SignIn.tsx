import React, { useCallback, useState } from 'react';
import { FiLock, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { RecoveryModal } from '../../components/RecoveryModal/RecoveryModal';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { FirebaseError, firebaseErrors } from '../../models/firebase';
import styles from './styles.module.scss';

export const SignIn: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({
    email: undefined,
    password: undefined,
  });

  const { signIn, recovery } = useAuth();
  const { addToast } = useToast();

  const handleFormChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setForm({ ...form, [name]: value });
    },
    [form],
  );

  const handleCloseModal = () => {
    setShowRecoveryModal(false);
  };

  const handleSendRecovery = useCallback(
    async (email: string) => {
      try {
        setShowRecoveryModal(false);

        await recovery(email);

        addToast({
          type: 'success',
          title: 'E-mail enviado',
          description:
            'Acesse seu e-mail para instruções de recuperação de senha',
          duration: 5000,
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro',
          description: firebaseErrors[(err as FirebaseError).code],
        });

        setLoading(false);
      }
    },
    [addToast, recovery],
  );

  const handleFormSubmit = useCallback(async () => {
    try {
      setLoading(true);

      setFormErrors({ email: undefined, password: undefined });

      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail é obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().required('Senha é obrigatória'),
      });

      await schema.validate(form, { abortEarly: false });

      await signIn(form.email, form.password);
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
        description: firebaseErrors[(err as FirebaseError).code],
      });

      setLoading(false);
    }
  }, [form, signIn, addToast]);

  return (
    <div className={styles.container}>
      <div className={styles.container_card}>
        <h1>Acesso</h1>
        <p>Entre com suas credenciais para acessar o sistema.</p>

        <span>E-mail</span>
        <Input
          name="email"
          value={form.email}
          onChange={handleFormChange}
          placeholder="Digite seu e-mail"
          icon={FiUser}
          error={formErrors.email}
        />

        <div className={styles.container_forgot}>
          <span>Senha</span>

          <button type="button" onClick={() => setShowRecoveryModal(true)}>
            Esqueceu sua senha?
          </button>
        </div>
        <Input
          name="password"
          value={form.password}
          onChange={handleFormChange}
          placeholder="Digite sua senha"
          icon={FiLock}
          error={formErrors.password}
        />

        <div className={styles.container_submit}>
          <Button onClick={handleFormSubmit} loading={loading}>
            Entrar
          </Button>
        </div>

        <div className={styles.container_signup}>
          <span>Não possui uma conta?</span>
          <Link to="signup">Cadastre-se</Link>
        </div>
      </div>

      <RecoveryModal
        visible={showRecoveryModal}
        onClose={handleCloseModal}
        onSave={handleSendRecovery}
      />
    </div>
  );
};
