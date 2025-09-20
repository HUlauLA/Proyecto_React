'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CreateProjectModal from '@/components/CreateProjectModal';

const getRemainingDays = (endDate) => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  if (diffTime < 0) return 0;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const ProjectCard = ({ project, tasks = [] }) => {
  const remainingDays = getRemainingDays(project.endDate);
  const relevantDate = new Date(project.endDate).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
  });

  // Calcular progreso basado en tareas completadas
  const projectTasks = tasks.filter(task => task.projectId === project.id);
  const completedTasks = projectTasks.filter(task => task.status === 'finalizado');
  const progressPercentage = projectTasks.length > 0 
    ? Math.round((completedTasks.length / projectTasks.length) * 100)
    : 0;

  return (
    <div className="col">
      <Link
        href={`/proyectos/${project.id}`}
        className="text-decoration-none text-dark"
      >
        <div className="card h-100">
          <Image
            src={project.imageUrl}
            alt={`Imagen de ${project.name}`}
            width={400}
            height={250}
            className="card-img-top"
            style={{ objectFit: 'contain' }}
          />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{project.name}</h5>
            <p className="card-text small text-muted">
              Progreso ({completedTasks.length}/{projectTasks.length} tareas)
            </p>
            <div className="progress mb-3" style={{ height: '8px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progressPercentage}%` }}
                aria-valuenow={progressPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <div className="d-flex justify-content-between border-top pt-2 mt-auto small">
              <div>
                <span className="fw-bold">{remainingDays}</span> Días restantes
              </div>
              <div>
                Fecha de finalización:{' '}
                <span className="fw-bold">{relevantDate}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

const CreateProjectCard = ({ onClick }) => (
  <div className="col">
    <div
      className="card h-100 d-flex align-items-center justify-content-center bg-light"
      style={{ minHeight: '250px', cursor: 'pointer' }}
      onClick={onClick}
    >
      <span style={{ fontSize: '4rem', color: '#adb5bd', fontWeight: '300' }}>
        +
      </span>
    </div>
  </div>
);

export default function ProyectosPage() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  
  const handleProjectCreated = () => {
    // Refrescar la lista de proyectos y tareas
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          fetch('http://localhost:3001/projects'),
          fetch('http://localhost:3001/tasks')
        ]);
        
        if (!projectsRes.ok || !tasksRes.ok) {
          throw new Error('No se pudieron obtener los datos');
        }
        
        const projectsData = await projectsRes.json();
        const tasksData = await tasksRes.json();
        
        setProjects(projectsData);
        setTasks(tasksData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          fetch('http://localhost:3001/projects'),
          fetch('http://localhost:3001/tasks')
        ]);
        
        if (!projectsRes.ok || !tasksRes.ok) {
          throw new Error('No se pudieron obtener los datos');
        }
        
        const projectsData = await projectsRes.json();
        const tasksData = await tasksRes.json();
        
        setProjects(projectsData);
        setTasks(tasksData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Proyectos</h2>
        <h5 className="text-muted mb-0">Crear proyecto</h5>
      </div>

      {loading && <p>Cargando proyectos...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} tasks={tasks} />
          ))}
          <CreateProjectCard onClick={handleOpenModal} />
        </div>
      )}
      <CreateProjectModal 
        show={showModal} 
        onClose={handleCloseModal} 
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}
