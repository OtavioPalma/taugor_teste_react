import React, { useCallback, useState } from 'react';
import { FiArrowLeft, FiAtSign, FiLock, FiUser } from 'react-icons/fi';
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
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [formErrors, setFormErrors] = useState({
    name: undefined,
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

      setFormErrors({ name: undefined, email: undefined, password: undefined });

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        email: Yup.string()
          .required('E-mail é obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().min(
          6,
          'Senha deve conter ao menos 6 caracteres',
        ),
      });

      await schema.validate(form, { abortEarly: false });

      await signUp(form.email, form.password, form.name);

      addToast({
        type: 'success',
        title: 'Conta criada',
      });
    } catch (err) {
      setLoading(false);

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
    }
  }, [form, signUp, addToast]);

  return (
    <div className={styles.container}>
      <div className={styles.container_card}>
        <h1>Cadastro</h1>
        <p>Crie sua conta para acessar o sistema.</p>

        <span>Nome</span>
        <Input
          name="name"
          value={form.name}
          onChange={handleFormChange}
          placeholder="Digite seu nome"
          icon={FiUser}
          error={formErrors.name}
        />

        <span>E-mail</span>
        <Input
          name="email"
          value={form.email}
          onChange={handleFormChange}
          placeholder="Digite um e-mail"
          icon={FiAtSign}
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
