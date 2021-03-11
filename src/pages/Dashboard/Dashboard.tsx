import React, { useCallback, useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiChevronRight,
  FiEdit2,
  FiPlus,
  FiTrash,
  FiX,
} from 'react-icons/fi';
import Loader from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { AddModal } from '../../components/AddModal/AddModal';
import { Button } from '../../components/Button/Button';
import { Header } from '../../components/Header/Header';
import { Select } from '../../components/Select/Select';
import { StatusModal } from '../../components/StatusModal/StatusModal';
import { UserModal } from '../../components/UserModal/UserModal';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Activity } from '../../models/activity';
import { User } from '../../models/auth';
import {
  addActivity,
  deleteActivity,
  editActivityStatus,
  editActivityUser,
  getActivities,
  getUsers,
} from '../../services/firebase';
import styles from './styles.module.scss';

const currentStatus: { [key: string]: string } = {
  pending: 'Pendente',
  running: 'Em andamento',
  finished: 'Finalizado',
  cancelled: 'Cancelado',
};

export const Dashboard: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState<Activity | null>(null);
  const [showUserModal, setShowUserModal] = useState<Activity | null>(null);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<{ [key: string]: string }>({});

  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  const { user } = useAuth();
  const { addToast } = useToast();

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowStatusModal(null);
    setShowUserModal(null);
  };

  useEffect(() => {
    setActivities([]);
    setUsers({});

    setLoading(true);

    Promise.all([getActivities(filter), getUsers()]).then(res => {
      res[0].forEach(doc => {
        setActivities(state => [
          ...state,
          { ...(doc.data() as Activity), id: doc.id },
        ]);
      });

      res[1].forEach(doc => {
        const docUser = doc.data() as User;
        setUsers(state => ({ ...state, [docUser.uid]: docUser.displayName }));
      });

      setLoading(false);
    });
  }, [user, filter]);

  const fetchActivities = useCallback(() => {
    setActivities([]);
    setLoading(true);

    getActivities().then(res => {
      res.forEach(doc => {
        setActivities(state => [
          ...state,
          { ...(doc.data() as Activity), id: doc.id },
        ]);
      });

      setLoading(false);
    });
  }, []);

  const handleSaveActivity = useCallback(
    async (activity: Activity) => {
      setShowAddModal(false);

      await addActivity(activity, user.uid);

      fetchActivities();

      addToast({
        title: 'Atividade criada',
        description: 'Atividade criada com sucesso',
        type: 'success',
      });
    },
    [user, addToast, fetchActivities],
  );

  const handleSaveStatus = useCallback(
    async (activity: Activity) => {
      setShowStatusModal(null);

      await editActivityStatus(activity, user.uid);

      fetchActivities();

      addToast({
        title: 'Atualização concluída',
        description: 'Status da atividade atualizado com sucesso',
        type: 'success',
      });
    },
    [user, addToast, fetchActivities],
  );

  const handleSaveUser = useCallback(
    async (activity: Activity) => {
      setShowUserModal(null);

      await editActivityUser(activity, user.uid);

      fetchActivities();

      addToast({
        title: 'Atualização concluída',
        description:
          'Usuário responsável pela atividade atualizado com sucesso',
        type: 'success',
      });
    },
    [user, addToast, fetchActivities],
  );

  const handleDeleteActivity = useCallback(
    async (activityId: string) => {
      await deleteActivity(activityId);

      fetchActivities();

      addToast({
        title: 'Remoção concluída',
        description: 'Atividade removida com sucesso',
        type: 'success',
      });
    },
    [addToast, fetchActivities],
  );

  return (
    <>
      <Header />

      <div className={styles.container}>
        <div className={styles.container_header}>
          <h1>Atividades</h1>

          <Button onClick={() => setShowAddModal(true)} icon={FiPlus}>
            Adicionar
          </Button>
        </div>

        <div className={styles.container_filter}>
          <Select
            name="status"
            placeholder="Filtrar por Status"
            value={filter}
            onChange={event => setFilter(event.target.value)}
            options={[
              { name: 'Pendente', value: 'pending' },
              { name: 'Em andamento', value: 'running' },
              { name: 'Finalizada', value: 'finished' },
              { name: 'Cancelada', value: 'cancelled' },
            ]}
          />

          {filter && (
            <Button color="error" icon={FiX} onClick={() => setFilter('')}>
              Limpar Filtro
            </Button>
          )}
        </div>

        {loading ? (
          <div className={styles.container_loader}>
            <Loader type="Oval" color="#f2f6fe" height={100} width={100} />
          </div>
        ) : (
          <div className={styles.container_table}>
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
                    <td colSpan={1}>
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
                      <td>
                        <Link to={`activity/${activity.id}`}>
                          <div>
                            {activity.title}

                            <FiChevronRight size={20} />
                          </div>
                        </Link>
                      </td>

                      <td>{currentStatus[activity.status]}</td>

                      <td>{users[activity.user]}</td>

                      <td>
                        <div>
                          <FiEdit2
                            size={20}
                            color="#75e46d"
                            onClick={() => setShowUserModal(activity)}
                          />
                          <FiCheckCircle
                            size={20}
                            color="#ffe74c"
                            onClick={() => setShowStatusModal(activity)}
                          />
                          <FiTrash
                            size={20}
                            color="#ff4848"
                            onClick={() => handleDeleteActivity(activity.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        )}
      </div>

      <AddModal
        onClose={handleCloseModal}
        onSave={handleSaveActivity}
        visible={showAddModal}
      />

      {showStatusModal && (
        <StatusModal
          onClose={handleCloseModal}
          onSave={handleSaveStatus}
          visible={Boolean(showStatusModal)}
          activity={showStatusModal}
        />
      )}

      {showUserModal && (
        <UserModal
          onClose={handleCloseModal}
          onSave={handleSaveUser}
          visible={Boolean(showUserModal)}
          activity={showUserModal}
        />
      )}
    </>
  );
};
