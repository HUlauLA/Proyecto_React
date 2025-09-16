"use client";

import { useMemo } from "react";

export default function DashboardPage() {

  const projects = [
    { id: 1, name: "Proyecto 1", progress: 80, tasks: { pending: 2, doing: 3, done: 10 }, status: "progreso" },
    { id: 2, name: "Proyecto 2", progress: 100, tasks: { pending: 0, doing: 0, done: 8  }, status: "completado" },
    { id: 3, name: "Proyecto 3", progress: 20, tasks: { pending: 6, doing: 1, done: 1  }, status: "atrasado" },
    { id: 4, name: "Proyecto 4", progress: 0,  tasks: { pending: 5, doing: 0, done: 0  }, status: "cancelado" },
  ];

  const latestDoneTasks = [
    { id: 101, title: "Última acción realizada 1", project: "Proyecto 1" },
    { id: 102, title: "Última acción realizada 2", project: "Proyecto 2" },
    { id: 103, title: "Última acción realizada 3", project: "Proyecto 3" },
    { id: 104, title: "Última acción realizada 4", project: "Proyecto 4" },
  ];

  const stats = useMemo(() => {
    const completed  = projects.filter(p => p.status === "completado").length;
    const inProgress = projects.filter(p => p.status === "progreso").length;
    const delayed    = projects.filter(p => p.status === "atrasado").length;
    const canceled   = projects.filter(p => p.status === "cancelado").length;
    return { completed, inProgress, delayed, canceled };
  }, [projects]);

  return (
    <>
      <h2 className="mb-4">Dashboard</h2>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <StatCard title="Proyectos completados" value={stats.completed} />
        </div>
        <div className="col-6 col-md-3">
          <StatCard title="Proyectos en progreso" value={stats.inProgress} />
        </div>
        <div className="col-6 col-md-3">
          <StatCard title="Proyectos atrasados" value={stats.delayed} />
        </div>
        <div className="col-6 col-md-3">
          <StatCard title="Proyectos cancelados" value={stats.canceled} />
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
                    <th style={{minWidth: 140}}>Progreso</th>
                    <th>Tareas faltantes</th>
                    <th>Tareas en curso</th>
                    <th>Tareas finalizadas</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p.id}>
                      <td className="fw-medium">{p.name}</td>
                      <td style={{minWidth: 140}}>
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress flex-grow-1" style={{height: 8}}>
                            <div
                              className={`progress-bar ${p.progress === 100 ? "bg-success" : "bg-primary"}`}
                              role="progressbar"
                              style={{width: `${p.progress}%`}}
                              aria-valuenow={p.progress}
                              aria-valuemin="0"
                              aria-valuemax="100"
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
                  <i className="bi bi-check2-circle"></i>
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