import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import Loader from 'react-loader-spinner';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Header } from '../../components/Header/Header';
import { Activity as ActivityInterface } from '../../models/activity';
import { User } from '../../models/auth';
import { getActivity, getUsers } from '../../services/firebase';
import styles from './styles.module.scss';

interface ParamTypes {
  id: string;
}

const currentStatus: { [key: string]: string } = {
  pending: 'Pendente',
  running: 'Em andamento',
  finished: 'Finalizado',
  cancelled: 'Cancelado',
};

const eventTypes: { [key: string]: string } = {
  create: 'Criação da Atividade',
  'edit-status': 'Edição do Status',
  'edit-user': 'Edição do Usuário Responsável',
};

export const Activity: React.FC = () => {
  const { id } = useParams<ParamTypes>();

  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<{ [key: string]: string }>({});
  const [activity, setActivity] = useState<ActivityInterface>();

  useEffect(() => {
    setLoading(true);

    Promise.all([getActivity(id), getUsers()]).then(res => {
      if (res[0].exists) {
        setActivity({ ...(res[0].data() as ActivityInterface), id: res[0].id });
      }

      res[1].forEach(doc => {
        const docUser = doc.data() as User;
        setUsers(state => ({ ...state, [docUser.uid]: docUser.displayName }));
      });

      setLoading(false);
    });
  }, [id]);

  return (
    <>
      <Header />

      <div className={styles.container}>
        <div className={styles.container_header}>
          <Link to="/">
            <FiArrowLeft size={20} />
            Página Principal
          </Link>
        </div>

        {loading || !activity ? (
          <div className={styles.container_loader}>
            <Loader type="Oval" color="#f2f6fe" height={100} width={100} />
          </div>
        ) : (
          <div className={styles.container_card}>
            <h1>{activity.title}</h1>

            <div className={styles.container_card__info}>
              <p>Status: </p>

              <span>{currentStatus[activity.status]}</span>
            </div>

            <div className={styles.container_card__info}>
              <p>Usuário Responsável: </p>

              <span>{users[activity.user]}</span>
            </div>

            <div className={styles.container_card__info}>
              <p>Descrição da Atividade: </p>

              <span>{activity.description}</span>
            </div>

            <div className={styles.container_card__table}>
              <p>Registro de Eventos</p>

              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Data do Evento</th>
                      <th>Usuário</th>
                    </tr>
                  </thead>

                  {activity?.events.length === 0 ? (
                    <tbody>
                      <tr>
                        <td colSpan={4}>
                          <div>
                            <FiAlertCircle size={30} />
                            Nenhum evento registrado
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      {activity?.events.map(event => (
                        <tr key={uuid()}>
                          <td>{eventTypes[event.type]}</td>
                          <td>
                            {new Date(
                              event.created.seconds * 1000,
                            ).toLocaleString()}{' '}
                          </td>
                          <td>{users[event.user]}</td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
