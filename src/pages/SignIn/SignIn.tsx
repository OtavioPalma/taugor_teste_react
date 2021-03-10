import React from 'react';
import { FiLock, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import styles from './styles.module.scss';

export const SignIn: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.container_card}>
        <h1>Acesso</h1>
        <p>Entre com suas credenciais para acessar o sistema.</p>

        <span>E-mail</span>
        <Input name="email" placeholder="Digite seu e-mail" icon={FiUser} />

        <div className={styles.container_forgot}>
          <span>Senha</span>
          <Link to="forgot">Esqueceu sua senha?</Link>
        </div>
        <Input name="password" placeholder="Digite sua senha" icon={FiLock} />

        <div className={styles.container_submit}>
          <Button>Entrar</Button>
        </div>

        <div className={styles.container_signup}>
          <span>Não possui uma conta?</span>
          <Link to="signup">Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
};
