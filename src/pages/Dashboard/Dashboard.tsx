import React, { useState } from 'react';
import {
  FiAlertCircle,
  FiCodesandbox,
  FiEdit2,
  FiPlus,
  FiTrash,
} from 'react-icons/fi';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import { Activity } from '../../models/activity';
import styles from './styles.module.scss';

export const Dashboard: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1wqdf213r',
      description: 'Desc',
      status: 'Ativa',
      title: 'Title',
      user: 'Jorge',
    },
  ]);

  const { user, signOut } = useAuth();

  return (
    <>
      <header>
        <FiCodesandbox size={40} />

        <span>Bem vindo, {user.email}</span>

        <Button onClick={signOut}>Sair</Button>
      </header>

      <div className={styles.container}>
        <div>
          <h1>Atividades</h1>

          <Button icon={FiPlus}>Adicionar</Button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Status</th>
              <th>Usuário Responsável</th>
              <th>Ações</th>
            </tr>
          </thead>

          {activities.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={4}>
                  <div>
                    <FiAlertCircle size={30} />
                    Nenhum dado cadastrado
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {activities.map(activity => (
                <tr key={activity.id}>
                  <td>{activity.title}</td>
                  <td>{activity.status}</td>
                  <td>{activity.user}</td>
                  <td>
                    <div>
                      <FiEdit2 size={20} color="#75e46d" />
                      <FiTrash size={20} color="#ff4848" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </>
  );
};
