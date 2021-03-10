import React, { useCallback, useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiCodesandbox,
  FiEdit2,
  FiPlus,
  FiTrash,
} from 'react-icons/fi';
import Loader from 'react-loader-spinner';
import { AddModal } from '../../components/AddModal/AddModal';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Activity } from '../../models/activity';
import {
  addActivity,
  deleteActivity,
  getActivities,
} from '../../services/firebase';
import styles from './styles.module.scss';

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  const { user, signOut } = useAuth();
  const { addToast } = useToast();

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    setActivities([]);

    setLoading(true);

    getActivities(user.uid).then(res => {
      res.forEach(doc => {
        setActivities(state => [
          ...state,
          { ...(doc.data() as Activity), id: doc.id },
        ]);
      });

      setLoading(false);
    });
  }, [user]);

  const handleSaveActivity = useCallback(
    async (activity: Activity) => {
      setShowModal(false);

      const newActivity = await addActivity(activity, user.uid);

      setActivities(state => [...state, { ...activity, id: newActivity.id }]);
    },
    [user],
  );

  const handleDeleteActivity = useCallback(async (activityId: string) => {
    await deleteActivity(activityId);

    setActivities(state => [...state.filter(el => el.id !== activityId)]);

    addToast({
      title: 'Remoção concluída',
      description: 'Atividade removida com sucesso',
      type: 'success',
    });
  }, []);

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

          <Button onClick={handleOpenModal} icon={FiPlus}>
            Adicionar
          </Button>
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
                        <FiEdit2 size={20} color="#75e46d" />
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
        visible={showModal}
      />
    </>
  );
};
