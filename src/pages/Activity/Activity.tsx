import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import Loader from 'react-loader-spinner';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Header } from '../../components/Header/Header';
import { Activity as ActivityInterface } from '../../models/activity';
import { getActivity } from '../../services/firebase';
import styles from './styles.module.scss';

interface ParamTypes {
  id: string;
}

const eventTypes: { [key: string]: string } = {
  create: 'Criação da Atividade',
  'edit-status': 'Edição do Status',
  'edit-user': 'Edição do Usuário Responsável',
};

export const Activity: React.FC = () => {
  const { id } = useParams<ParamTypes>();

  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState<ActivityInterface>();

  useEffect(() => {
    setLoading(true);

    getActivity(id).then(res => {
      if (res.exists) {
        setActivity({ ...(res.data() as ActivityInterface), id: res.id });
      }

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

        {loading ? (
          <div className={styles.container_loader}>
            <Loader type="Oval" color="#f2f6fe" height={100} width={100} />
          </div>
        ) : (
          <div className={styles.container_card}>
            <h1>{activity?.title}</h1>

            <div className={styles.container_card__info}>
              <p>Status: </p>

              <span>{activity?.status}</span>
            </div>

            <div className={styles.container_card__info}>
              <p>Usuário Responsável: </p>

              <span>{activity?.user}</span>
            </div>

            <div className={styles.container_card__info}>
              <p>Descrição da Atividade: </p>

              <span>{activity?.description}</span>
            </div>

            <div className={styles.container_card__table}>
              <p>Registro de Eventos</p>

              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Data do Evento</th>
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
