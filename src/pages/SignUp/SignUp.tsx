import React, { useCallback, useState } from 'react';
import { FiArrowLeft, FiLock, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { FirebaseError, firebaseErrors } from '../../models/firebase';
import styles from './styles.module.scss';

export const SignUp: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({
    email: undefined,
    password: undefined,
  });

  const { signUp } = useAuth();
  const { addToast } = useToast();

  const handleFormChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setForm({ ...form, [name]: value });
    },
    [form],
  );

  const handleFormSubmit = useCallback(async () => {
    try {
      setLoading(true);

      setFormErrors({ email: undefined, password: undefined });

      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail é obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().min(
          6,
          'Senha deve conter ao menos 6 caracteres',
        ),
      });

      await schema.validate(form, { abortEarly: false });

      await signUp(form.email, form.password);

      addToast({
        type: 'success',
        title: 'Conta criada',
      });
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
  }, [form, signUp, addToast]);

  return (
    <div className={styles.container}>
      <div className={styles.container_card}>
        <h1>Cadastro</h1>
        <p>Crie sua conta para acessar o sistema.</p>

        <span>E-mail</span>
        <Input
          name="email"
          value={form.email}
          onChange={handleFormChange}
          placeholder="Digite um e-mail"
          icon={FiUser}
          error={formErrors.email}
        />

        <span>Senha</span>
        <Input
          name="password"
          value={form.password}
          onChange={handleFormChange}
          placeholder="Digite uma senha"
          icon={FiLock}
          error={formErrors.password}
        />

        <div className={styles.container_submit}>
          <Button onClick={handleFormSubmit} loading={loading}>
            Cadastrar
          </Button>
        </div>

        <div className={styles.container_signin}>
          <Link to="/">
            <FiArrowLeft size={20} />
            Voltar para o Acesso
          </Link>
        </div>
      </div>
    </div>
  );
};
