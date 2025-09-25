"use client";

import { useState } from "react";

export default function TaskDetailModal({
  show,
  onClose,
  task,
  assignedUser,
  onUpdateTask,
  onDeleteTask,
  userRole,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  if (!show || !task) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedTask),
        }
      );
      if (!response.ok) throw new Error("No se pudo actualizar la tarea.");
      const updatedTask = await response.json();
      onUpdateTask(updatedTask);
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error("Error actualizando tarea:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("No se pudo eliminar la tarea.");
      onDeleteTask(task.id);
      onClose();
    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">
              {isEditing ? "Editar Tarea" : "Detalle de Tarea"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {isEditing ? (
              <>
                <div className="mb-3">
                  <label className="form-label">Título</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={editedTask.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    value={editedTask.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </>
            ) : (
              <>
                <p>
                  <strong>Título:</strong> {task.title}
                </p>
                <p>
                  <strong>Descripción:</strong>{" "}
                  {task.description || "Sin descripción"}
                </p>
                <p>
                  <strong>Asignado a:</strong>{" "}
                  {assignedUser?.name || "No asignado"}
                </p>
                <p>
                  <strong>Fecha de entrega:</strong>{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Estado:</strong> {task.status}
                </p>
                <p>
                  <strong>Prioridad:</strong> {task.priority}
                </p>
              </>
            )}
          </div>

          <div className="modal-footer border-0">
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>

            {userRole === "gerente" && (
              <>
                {isEditing ? (
                  <>
                    <button className="btn btn-primary" onClick={handleSave}>
                      Guardar
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar edición
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      Editar
                    </button>
                    <button className="btn btn-danger" onClick={handleDelete}>
                      Eliminar
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

