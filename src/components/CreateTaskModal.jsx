'use client';

import { useEffect } from 'react';
import TaskForm from './TaskForm';

export default function CreateTaskModal({ show, onClose, users = [], projectId, onTaskCreated }) {
  // Cierra el modal si se presiona la tecla Escape
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

  // Evita que el clic dentro del modal lo cierre
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const handleSave = () => {
    onClose();
    if (onTaskCreated) {
      onTaskCreated();
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
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
            <TaskForm 
              projectId={projectId}
              users={users}
              onSave={handleSave}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
