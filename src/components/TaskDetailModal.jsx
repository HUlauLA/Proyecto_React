// Renombrar el archivo a TaskDetailModal.jsx
'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext'; // 1. Importar useAuth

export default function TaskDetailModal({
  show,
  onClose,
  users = [],
  projectId,
  onTaskCreated,
  task, // 2. Recibir la tarea a visualizar/editar
  mode: initialMode = 'create', // 3. Recibir el modo inicial ('create', 'view')
  onTaskUpdated,
  onTaskDeleted,
}) {
  const { user } = useAuth(); // Obtener el usuario del contexto
  const isManager = user?.role === 'gerente';

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState(initialMode); // 'create', 'view', 'edit', 'confirm_delete'

  // Efecto para resetear el estado y popular el formulario cuando el modal se abre o cambia la tarea/modo
  useEffect(() => {
    setMode(initialMode);
    if (show) {
      if (initialMode === 'create' || !task) {
        setFormData({
          title: '',
          description: '',
          startDate: '',
          dueDate: '',
          priority: 'baja',
          userId: '',
        });
      } else {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          startDate: task.startDate?.split('T')[0] || '',
          dueDate: task.dueDate?.split('T')[0] || '',
          priority: task.priority || 'baja',
          userId: task.userId || '',
        });
      }
    } else {
      setErrors({});
      setIsProcessing(false);
    }
  }, [show, initialMode, task]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
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
    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria.';
    if (!formData.startDate) newErrors.startDate = 'La fecha de inicio es obligatoria.';
    if (mode === 'create' && formData.startDate < today) newErrors.startDate = 'La fecha de inicio no puede ser en el pasado.';
    if (!formData.dueDate) newErrors.dueDate = 'La fecha de entrega es obligatoria.';
    if (formData.dueDate <= formData.startDate) newErrors.dueDate = 'La fecha de entrega debe ser posterior a la de inicio.';
    if (!formData.userId) newErrors.userId = 'Debe asignar la tarea a un usuario.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      if (mode === 'create') {
        // Lógica de Creación
        const newTask = { id: uuidv4(), ...formData, projectId, status: 'pendiente' };
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask),
        });
        if (!response.ok) throw new Error('Error al crear la tarea.');
        onTaskCreated(await response.json());
      } else if (mode === 'edit') {
        // Lógica de Actualización
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Error al actualizar la tarea.');
        onTaskUpdated(await response.json());
      }
      onClose();
    } catch (error) {
      console.error('Error:', error);
      setErrors({ form: error.message || 'Ocurrió un error inesperado.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar la tarea.');
      onTaskDeleted(task); // Notificar al padre que la tarea fue eliminada
      onClose();
    } catch (error) {
      console.error('Error:', error);
      setErrors({ form: error.message || 'Ocurrió un error inesperado.' });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const isViewMode = mode === 'view';
  const getModalTitle = () => {
    if (mode === 'create') return 'Crear Tarea';
    if (mode === 'edit') return 'Editar Tarea';
    if (mode === 'confirm_delete') return 'Confirmar Eliminación';
    return 'Detalles de la Tarea';
  };

  // Renderizado del contenido y botones según el modo
  const renderContent = () => {
    if (mode === 'confirm_delete') {
      return (
        <div className="text-center">
          <p>¿Estás seguro de que deseas eliminar la tarea?</p>
          <p><strong>{task.title}</strong></p>
        </div>
      );
    }
    const disabled = isViewMode || isProcessing;
    return (
      <form>
        {/* Título */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label small text-muted">Título</label>
          <input type="text" className={`form-control ${errors.title ? 'is-invalid' : ''}`} id="title" value={formData.title} onChange={handleInputChange} disabled={disabled} />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </div>
        {/* Descripción */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label small text-muted">Descripción</label>
          <textarea className={`form-control ${errors.description ? 'is-invalid' : ''}`} id="description" rows="4" value={formData.description} onChange={handleInputChange} disabled={disabled}></textarea>
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>
        {/* Fechas */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="startDate" className="form-label small text-muted">Fecha de inicio</label>
            <input type="date" className={`form-control ${errors.startDate ? 'is-invalid' : ''}`} id="startDate" value={formData.startDate} onChange={handleInputChange} disabled={disabled} />
            {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="dueDate" className="form-label small text-muted">Fecha de entrega</label>
            <input type="date" className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`} id="dueDate" value={formData.dueDate} onChange={handleInputChange} disabled={disabled} />
            {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
          </div>
        </div>
        {/* Asignación y Prioridad */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="userId" className="form-label small text-muted">Asignar a</label>
            <select className={`form-select ${errors.userId ? 'is-invalid' : ''}`} id="userId" value={formData.userId} onChange={handleInputChange} disabled={disabled}>
              <option value="">Seleccionar usuario...</option>
              {users.map((user) => (<option key={user.id} value={user.id}>{user.name}</option>))}
            </select>
            {errors.userId && <div className="invalid-feedback">{errors.userId}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="priority" className="form-label small text-muted">Nivel de importancia</label>
            <select className="form-select" id="priority" value={formData.priority} onChange={handleInputChange} disabled={disabled}>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
        </div>
      </form>
    );
  };
  
  const renderFooter = () => {
    if (mode === 'view') {
      return (
        <>
          {isManager && (
            <>
              <button type="button" className="btn btn-outline-danger me-auto" onClick={() => setMode('confirm_delete')} disabled={isProcessing}>Eliminar</button>
              <button type="button" className="btn btn-secondary" onClick={() => setMode('edit')} disabled={isProcessing}>Editar</button>
            </>
          )}
          <button type="button" className="btn btn-dark" onClick={onClose}>Cerrar</button>
        </>
      );
    }
    if (mode === 'confirm_delete') {
      return (
        <>
          <button type="button" className="btn btn-light" onClick={() => setMode('view')} disabled={isProcessing}>Cancelar</button>
          <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={isProcessing}>
            {isProcessing ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </>
      );
    }
    // Modo 'create' o 'edit'
    return (
      <>
        <button type="button" className="btn btn-light" onClick={onClose} disabled={isProcessing}>Cancelar</button>
        <button type="button" className="btn btn-dark" onClick={handleSubmit} disabled={isProcessing}>
          {isProcessing ? 'Guardando...' : 'Guardar'}
        </button>
      </>
    );
  };

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">{getModalTitle()}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {errors.form && <div className="alert alert-danger">{errors.form}</div>}
            {renderContent()}
          </div>
          <div className="modal-footer border-0 justify-content-end">{renderFooter()}</div>
        </div>
      </div>
    </div>
  );
}
