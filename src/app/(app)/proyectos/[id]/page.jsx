'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import CreateTaskModal from '@/components/CreateTaskModal';
import { useAuth } from '@/context/AuthContext'; // 1. Importar useAuth

const TaskCard = ({ task, assignedUser, onUpdateTask }) => {
  const getPriorityDetails = (priority) => {
    switch (priority) {
      case 'alta':
        return {
          icon: 'bi-exclamation-lg',
          bg: 'bg-danger',
          text: 'text-white',
        };
      case 'media':
        return { icon: 'bi-flag-fill', bg: 'bg-warning', text: 'text-dark' };
      default:
        return { icon: 'bi-info-lg', bg: 'bg-success', text: 'text-white' };
    }
  };

  const { icon, bg, text } = getPriorityDetails(task.priority);

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('No se pudo actualizar la tarea.');
      const updatedTask = await response.json();
      onUpdateTask(updatedTask);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  return (
    <div className="card mb-3">
      <div className={`card-header ${bg} ${text} small fw-bold`}>
        Prioridad {task.priority}
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <h6 className="card-title mb-1 fw-bold">{task.title}</h6>
            <small className="text-muted">
              {assignedUser?.name || 'No asignado'}
            </small>
          </div>
          <div
            className={`d-flex align-items-center justify-content-center rounded-circle ${bg}`}
            style={{ width: '42px', height: '42px' }}
          >
            <i
              className={`bi ${icon} text-white`}
              style={{ fontSize: '1.25rem' }}
            ></i>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-3">
          <div>
            Fecha de finalización:
            <small className="text-muted ms-1">
              {new Date(task.dueDate).toLocaleDateString()}
            </small>
          </div>
          <div className="d-flex gap-1">
            {task.status === 'en progreso' && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => handleStatusChange('pendiente')}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
            )}
            {task.status === 'finalizado' && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => handleStatusChange('en progreso')}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
            )}

            {task.status === 'pendiente' && (
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handleStatusChange('en progreso')}
              >
                <i className="bi bi-arrow-right"></i>
              </button>
            )}
            {task.status === 'en progreso' && (
              <button
                className="btn btn-sm btn-outline-success"
                onClick={() => handleStatusChange('finalizado')}
              >
                <i className="bi bi-arrow-right"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Modificar TaskColumn para recibir el rol del usuario
const TaskColumn = ({
  title,
  tasks,
  users,
  onUpdateTask,
  onAddTask,
  userRole,
}) => (
  <div className="col-md-4">
    <div className="bg-light p-3 rounded h-100">
      <h5 className="mb-3 text-black">{title}</h5>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          assignedUser={users.find((u) => u.id === task.userId)}
          onUpdateTask={onUpdateTask}
        />
      ))}
      {/* 3. Mostrar el botón solo si el rol es 'gerente' */}
      {title === 'Tareas pendientes' && userRole === 'gerente' && (
        <button className="btn btn-secondary w-100" onClick={onAddTask}>
          +
        </button>
      )}
    </div>
  </div>
);

export default function ProjectDetailPage() {
  const { user } = useAuth(); // 2. Obtener el usuario del contexto
  const params = useParams();
  const { id } = params;

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [projectRes, tasksRes, usersRes] = await Promise.all([
          fetch(`http://localhost:3001/projects?id=${id}`),
          fetch(`http://localhost:3001/tasks?projectId=${id}`),
          fetch(`http://localhost:3001/users`),
        ]);

        if (!projectRes.ok || !tasksRes.ok || !usersRes.ok) {
          throw new Error('Error al obtener los datos del proyecto.');
        }

        const projectDataArray = await projectRes.json();
        const tasksData = await tasksRes.json();
        const usersData = await usersRes.json();

        if (projectDataArray.length === 0) {
          throw new Error('Proyecto no encontrado.');
        }

        setProject(projectDataArray[0]);
        setTasks(tasksData);
        setUsers(usersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdateTask = (updatedTask) => {
    setTasks((currentTasks) =>
      currentTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    );
  };

  const handleTaskCreated = (newTask) => {
    setTasks((currentTasks) => [...currentTasks, newTask]);
  };

  if (loading) return <p>Cargando proyecto...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!project) return <p>Proyecto no encontrado.</p>;

  const pendingTasks = tasks.filter((t) => t.status === 'pendiente');
  const inProgressTasks = tasks.filter((t) => t.status === 'en progreso');
  const completedTasks = tasks.filter((t) => t.status === 'finalizado');

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2>{project.name}</h2>
          <p className="text-white">{project.description}</p>
        </div>
        <div className="bg-light p-3 rounded-circle">
          <Image src="/file.svg" alt="Icono" width={24} height={24} />
        </div>
      </div>

      <div className="row g-4">
        <TaskColumn
          title="Tareas pendientes"
          tasks={pendingTasks}
          users={users}
          onUpdateTask={handleUpdateTask}
          onAddTask={() => setShowTaskModal(true)}
          userRole={user?.role} // 4. Pasar el rol a la columna
        />
        <TaskColumn
          title="Tareas en progreso"
          tasks={inProgressTasks}
          users={users}
          onUpdateTask={handleUpdateTask}
          userRole={user?.role}
        />
        <TaskColumn
          title="Tareas finalizadas"
          tasks={completedTasks}
          users={users}
          onUpdateTask={handleUpdateTask}
          userRole={user?.role}
        />
      </div>

      <CreateTaskModal
        show={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        users={users}
        projectId={id}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}
