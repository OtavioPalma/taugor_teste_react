import React, { useCallback, useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiCodesandbox,
  FiEdit2,
  FiPlus,
  FiTrash,
  FiX,
} from 'react-icons/fi';
import Loader from 'react-loader-spinner';
import { AddModal } from '../../components/AddModal/AddModal';
import { Button } from '../../components/Button/Button';
import { Select } from '../../components/Select/Select';
import { StatusModal } from '../../components/StatusModal/StatusModal';
import { UserModal } from '../../components/UserModal/UserModal';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Activity } from '../../models/activity';
import {
  addActivity,
  deleteActivity,
  editActivityStatus,
  editActivityUser,
  getActivities,
} from '../../services/firebase';
import styles from './styles.module.scss';

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState<Activity | null>(null);
  const [showUserModal, setShowUserModal] = useState<Activity | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState('');

  const { user, signOut } = useAuth();
  const { addToast } = useToast();

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowStatusModal(null);
    setShowUserModal(null);
  };

  useEffect(() => {
    setActivities([]);

    setLoading(true);

    getActivities(user.uid, filter).then(res => {
      res.forEach(doc => {
        setActivities(state => [
          ...state,
          { ...(doc.data() as Activity), id: doc.id },
        ]);
      });

      setLoading(false);
    });
  }, [user, filter]);

  const handleSaveActivity = useCallback(
    async (activity: Activity) => {
      setShowAddModal(false);

      const newActivity = await addActivity(activity, user.uid);

      setActivities(state => [...state, { ...activity, id: newActivity.id }]);
    },
    [user],
  );

  const handleSaveStatus = useCallback(
    async (activity: Activity) => {
      setShowStatusModal(null);

      setActivities(state => {
        const stateCopy = state;
        const index = state.findIndex(el => el.id === activity.id);

        stateCopy[index] = activity;

        return stateCopy;
      });

      await editActivityStatus(activity);

      addToast({
        title: 'Atualização concluída',
        description: 'Status da atividade atualizado com sucesso',
        type: 'success',
      });
    },
    [addToast],
  );

  const handleSaveUser = useCallback(
    async (activity: Activity) => {
      setShowUserModal(null);

      setActivities(state => {
        const stateCopy = state;
        const index = state.findIndex(el => el.id === activity.id);

        stateCopy[index] = activity;

        return stateCopy;
      });

      await editActivityUser(activity);

      addToast({
        title: 'Atualização concluída',
        description:
          'Usuário responsável pela atividade atualizado com sucesso',
        type: 'success',
      });
    },
    [addToast],
  );

  const handleDeleteActivity = useCallback(
    async (activityId: string) => {
      await deleteActivity(activityId);

      setActivities(state => [...state.filter(el => el.id !== activityId)]);

      addToast({
        title: 'Remoção concluída',
        description: 'Atividade removida com sucesso',
        type: 'success',
      });
    },
    [addToast],
  );

  return (
    <>
      <header>
        <div>
          <FiCodesandbox size={40} />

          <span>Bem vindo, {user.email}</span>

          <Button onClick={signOut}>Sair</Button>
        </div>
      </header>

      <div className={styles.container}>
        <div>
          <h1>Atividades</h1>

          <Button onClick={() => setShowAddModal(true)} icon={FiPlus}>
            Adicionar
          </Button>
        </div>

        <div>
          <Select
            name="status"
            placeholder="Filtrar por Status"
            value={filter}
            onChange={event => setFilter(event.target.value)}
            options={['Pendente', 'Em andamento', 'Finalizada', 'Cancelada']}
          />

          {filter && (
            <Button color="error" icon={FiX} onClick={() => setFilter('')}>
              Limpar Filtro
            </Button>
          )}
        </div>

        {loading ? (
          <section>
            <Loader type="Oval" color="#f2f6fe" height={100} width={100} />
          </section>
        ) : (
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
