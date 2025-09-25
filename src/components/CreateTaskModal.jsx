'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function CreateTaskModal({
  show,
  onClose,
  users = [],
  projectId,
  onTaskCreated,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
    priority: 'baja',
    userId: '',
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!show) {
      setFormData({
        title: '',
        description: '',
        startDate: '',
        dueDate: '',
        priority: 'baja',
        userId: '',
      });
      setErrors({});
      setIsSaving(false);
    }
  }, [show]);

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

  if (!show) return null;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split('T')[0];

    if (!formData.title.trim()) newErrors.title = 'El título es obligatorio.';

    if (!formData.description.trim())
      newErrors.description = 'La descripción es obligatoria.';

    if (!formData.startDate)
      newErrors.startDate = 'La fecha de inicio es obligatoria.';

    if (formData.startDate < today)
      newErrors.startDate = 'La fecha de inicio no puede ser en el pasado.';

    if (!formData.dueDate)
      newErrors.dueDate = 'La fecha de entrega es obligatoria.';

    if (formData.dueDate <= formData.startDate)
      newErrors.dueDate =
        'La fecha de entrega debe ser posterior a la de inicio.';

    if (!formData.userId)
      newErrors.userId = 'Debe asignar la tarea a un usuario.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const newTask = {
        id: uuidv4(),
        ...formData,
        projectId,
        status: 'pendiente',
      };

      const response = await fetch('process.env.NEXT_PUBLIC_API_URL/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error('Error al guardar la tarea.');

      if (onTaskCreated) {
        onTaskCreated(await response.json());
      }
      onClose();
    } catch (error) {
      console.error('Error:', error);
      setErrors({ form: error.message || 'Ocurrió un error inesperado.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
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
            {errors.form && (
              <div className="alert alert-danger">{errors.form}</div>
            )}
            <form>
              <div className="mb-3">
                <label htmlFor="title" className="form-label small text-muted">
                  Título de la tarea
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
                {errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
              </div>

              <div className="mb-3">
                <label
                  htmlFor="description"
                  className="form-label small text-muted"
                >
                  Descripción de la tarea
                </label>
                <textarea
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  id="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
                {errors.description && (
                  <div className="invalid-feedback">{errors.description}</div>
                )}
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="startDate"
                    className="form-label small text-muted"
                  >
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                  {errors.startDate && (
                    <div className="invalid-feedback">{errors.startDate}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="dueDate"
                    className="form-label small text-muted"
                  >
                    Fecha de entrega
                  </label>
                  <input
                    type="date"
                    className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
                    id="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                  />
                  {errors.dueDate && (
                    <div className="invalid-feedback">{errors.dueDate}</div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="userId"
                    className="form-label small text-muted"
                  >
                    Asignar a
                  </label>
                  <select
                    className={`form-select ${errors.userId ? 'is-invalid' : ''}`}
                    id="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccionar usuario...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {errors.userId && (
                    <div className="invalid-feedback">{errors.userId}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="priority"
                    className="form-label small text-muted"
                  >
                    Nivel de importancia
                  </label>
                  <select
                    className="form-select"
                    id="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer border-0 justify-content-end">
            <button
              type="button"
              className="btn btn-light"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-dark"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
