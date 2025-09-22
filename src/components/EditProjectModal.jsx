"use client";

import { useEffect } from "react";
import ProjectForm from "./ProjectForm";

export default function EditProjectModal({ show, onClose, project, onProjectUpdated }) {
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

  const handleSave = () => {
    onClose();
    if (onProjectUpdated) {
      onProjectUpdated();
    }
  };

  return (
    <div 
      className="modal fade show" 
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }} 
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" onClick={handleModalContentClick}>
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">Editar proyecto</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <ProjectForm 
              project={project}
              onSave={handleSave}
              onCancel={onClose}
              isEditing={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
