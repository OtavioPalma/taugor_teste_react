import React from 'react';
import { FiCodesandbox } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../Button/Button';
import styles from './styles.module.scss';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className={styles.header}>
      <div>
        <FiCodesandbox size={40} />

        <span>Bem vindo, {user.email}</span>

        <Button onClick={signOut}>Sair</Button>
      </div>
    </header>
  );
};
