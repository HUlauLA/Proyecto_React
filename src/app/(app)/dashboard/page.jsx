"use client";

import { useEffect, useState, useMemo } from "react";

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("process.env.NEXT_PUBLIC_API_URL/projects").then(res => res.json()),
      fetch("process.env.NEXT_PUBLIC_API_URL/tasks").then(res => res.json())
    ]).then(([projectsData, tasksData]) => {
      setProjects(projectsData);
      setTasks(tasksData);
    });
  }, []);

  // Mapear proyectos con stats
  const projectsWithStats = useMemo(() => {
    return projects.map(p => {
      const projectTasks = tasks.filter(t => String(t.projectId) === String(p.id));


      const pending = projectTasks.filter(t => t.status === "pendiente").length;
      const doing = projectTasks.filter(t => t.status === "en progreso").length;
      const done = projectTasks.filter(t => t.status === "finalizado").length;

      const total = projectTasks.length;
      const progress = total > 0 ? Math.round((done / total) * 100) : 0;

      let status = "sin iniciar";
      if (progress === 0) status = "sin iniciar";
      else if (progress > 0 && progress < 100) status = "en progreso";
      else if (progress === 100) status = "completado";

      return {
        ...p,
        progress,
        tasks: { pending, doing, done },
        status
      };
    });
  }, [projects, tasks]);

  // Últimas tareas completadas
  const latestDoneTasks = useMemo(() => {
    return tasks
      .filter(t => t.status === "finalizado")
      .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
      .slice(0, 5)
      .map(t => ({
        id: t.id,
        title: t.title,
        project: projects.find(p => String(p.id) === String(t.projectId))?.name || "Proyecto desconocido"
      }));
  }, [tasks, projects]);
  

  const stats = useMemo(() => {
    const notStarted = projectsWithStats.filter(p => p.status === "sin iniciar").length;
    const inProgress = projectsWithStats.filter(p => p.status === "en progreso").length;
    const completed = projectsWithStats.filter(p => p.status === "completado").length;

    return { notStarted, inProgress, completed };
  }, [projectsWithStats]);


  return (
    <>
      <h2 className="mb-4">Dashboard</h2>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4">
          <StatCard title="Proyectos sin iniciar" value={stats.notStarted} />
        </div>
        <div className="col-6 col-md-4">
          <StatCard title="Proyectos en progreso" value={stats.inProgress} />
        </div>
        <div className="col-6 col-md-4">
          <StatCard title="Proyectos completados" value={stats.completed} />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card p-3">
            <h5 className="mb-3">Proyectos</h5>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Nombre del proyecto</th>
                    <th style={{ minWidth: 140 }}>Progreso</th>
                    <th>Pendientes</th>
                    <th>En curso</th>
                    <th>Finalizadas</th>
                  </tr>
                </thead>
                <tbody>
                  {projectsWithStats.map(p => (
                    <tr key={p.id}>
                      <td className="fw-medium">{p.name}</td>
                      <td style={{ minWidth: 140 }}>
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress flex-grow-1" style={{ height: 8 }}>
                            <div
                              className={`progress-bar ${p.progress === 100 ? "bg-success" : "bg-primary"}`}
                              role="progressbar"
                              style={{ width: `${p.progress}%` }}
                            />
                          </div>
                          <small className="text-body-secondary">{p.progress}%</small>
                        </div>
                      </td>
                      <td>{p.tasks.pending}</td>
                      <td>{p.tasks.doing}</td>
                      <td>{p.tasks.done}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card p-3 h-100">
            <h5 className="mb-3">Últimas tareas finalizadas</h5>
            <ul className="list-group list-group-flush">
              {latestDoneTasks.map(t => (
                <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-medium">{t.title}</div>
                    <small className="text-body-secondary">{t.project}</small>
                  </div>
                  <i className="bi bi-check2-circle text-success"></i>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="card p-3">
      <div className="text-body-secondary small">{title}</div>
      <div className="fs-3 fw-bold mt-1">{value}</div>
    </div>
  );
}
