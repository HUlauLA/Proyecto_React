'use client';

import { useEffect } from 'react';

export default function CreateTaskModal({ show, onClose, users = [] }) {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
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
      style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={handleModalContentClick}
      >
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">Crear tarea</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label
                  htmlFor="taskTitle"
                  className="form-label small text-muted"
                >
                  Título de la tarea
                </label>
                <input type="text" className="form-control" id="taskTitle" />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="taskDescription"
                  className="form-label small text-muted"
                >
                  Descripción de la tarea
                </label>
                <textarea
                  className="form-control"
                  id="taskDescription"
                  rows="4"
                ></textarea>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="startDate"
                    className="form-label small text-muted"
                  >
                    Fecha de inicio
                  </label>
                  <input type="date" className="form-control" id="startDate" />
                </div>
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="dueDate"
                    className="form-label small text-muted"
                  >
                    Fecha de entrega
                  </label>
                  <input type="date" className="form-control" id="dueDate" />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="assignTo"
                    className="form-label small text-muted"
                  >
                    Asignar a
                  </label>
                  <select className="form-select" id="assignTo">
                    <option value="">Seleccionar usuario...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="priority"
                    className="form-label small text-muted"
                  >
                    Nivel de importancia
                  </label>
                  <select className="form-select" id="priority">
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer border-0 justify-content-end">
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-dark">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
