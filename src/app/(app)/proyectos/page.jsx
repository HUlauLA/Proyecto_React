"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const getRemainingDays = (endDate) => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  if (diffTime < 0) return 0;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const ProjectCard = ({ project }) => {
  const remainingDays = getRemainingDays(project.endDate);
  const relevantDate = new Date(project.endDate).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  });

  return (
    <div className="col">
      <div className="card h-100">
        <Image
          src={project.imageUrl}
          alt={`Imagen de ${project.name}`}
          width={400}
          height={250}
          className="card-img-top"
          style={{ objectFit: "contain" }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{project.name}</h5>
          <p className="card-text small text-muted">Progreso</p>
          <div className="progress mb-3" style={{ height: "8px" }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: "40%" }}
              aria-valuenow="40"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div className="d-flex justify-content-between border-top pt-2 mt-auto small">
            <div>
              <span className="fw-bold">{remainingDays}</span> Días restantes
            </div>
            <div>
              Fecha de finalización: <span className="fw-bold">{relevantDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateProjectCard = () => (
  <div className="col">
    <Link href="/proyectos/crear" className="text-decoration-none">
      <div className="card h-100 d-flex align-items-center justify-content-center bg-light" style={{minHeight: '250px'}}>
        <span style={{ fontSize: "4rem", color: "#adb5bd", fontWeight: "300" }}>+</span>
      </div>
    </Link>
  </div>
);


export default function ProyectosPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:3001/projects");
        if (!response.ok) {
          throw new Error("No se pudieron obtener los proyectos");
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
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
            <ProjectCard key={project.id} project={project} />
          ))}
          <CreateProjectCard />
        </div>
      )}
    </div>
  );
}