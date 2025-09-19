"use client";

import { useEffect } from "react";

export default function CreateProjectModal({ show, onClose }) {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!show) {
    return null;
  }

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="modal fade show" 
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }} 
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered" onClick={handleModalContentClick}>
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">Crear proyecto</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="projectName" className="form-label small text-muted">
                  Nombre del proyecto</label>
                <input type="text" className="form-control" id="projectName" />
              </div>
              <div className="mb-3">
                <label htmlFor="projectDescription" className="form-label small text-muted">
                  Descripción del proyecto
                </label>
                <textarea className="form-control" id="projectDescription" rows="4"></textarea>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="startDate" className="form-label small text-muted">Fecha de inicio</label>
                  <input type="date" className="form-control" id="startDate" />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="endDate" className="form-label small text-muted">Fecha de finalización</label>
                  <input type="date" className="form-control" id="endDate" />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="imageUrl" className="form-label small text-muted">Imagen del proyecto</label>
                <input type="text" className="form-control" id="imageUrl" placeholder="Ej: /images/nombre-imagen.png" />
              </div>
            </form>
          </div>
          <div className="modal-footer border-0 justify-content-end">
            <button type="button" className="btn btn-light" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn btn-dark">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
