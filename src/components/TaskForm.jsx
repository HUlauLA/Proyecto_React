'use client';

import { useState, useEffect } from 'react';

export default function TaskForm({ 
  projectId,
  users = [], 
  onSave, 
  onCancel 
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
    priority: 'media',
    userId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('El título de la tarea es requerido');
      return false;
    }
    if (!formData.description.trim()) {
      setError('La descripción de la tarea es requerida');
      return false;
    }
    if (!formData.startDate) {
      setError('La fecha de inicio es requerida');
      return false;
    }
    if (!formData.dueDate) {
      setError('La fecha de entrega es requerida');
      return false;
    }
    if (new Date(formData.startDate) >= new Date(formData.dueDate)) {
      setError('La fecha de inicio debe ser anterior a la fecha de entrega');
      return false;
    }
    if (!formData.userId) {
      setError('Debes asignar la tarea a un usuario');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        ...formData,
        projectId: projectId,
        status: 'pendiente' // Todas las nuevas tareas empiezan como pendientes
      };

      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Error al crear la tarea');
      }

      onSave();
    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="title" className="form-label small text-muted">
          Título de la tarea *
        </label>
        <input
          type="text"
          className="form-control"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Ingresa el título de la tarea"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label small text-muted">
          Descripción de la tarea *
        </label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe los detalles de la tarea"
          required
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="startDate" className="form-label small text-muted">
            Fecha de inicio *
          </label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="dueDate" className="form-label small text-muted">
            Fecha de entrega *
          </label>
          <input
            type="date"
            className="form-control"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="userId" className="form-label small text-muted">
            Asignar a *
          </label>
          <select 
            className="form-select" 
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccionar usuario...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="priority" className="form-label small text-muted">
            Nivel de prioridad *
          </label>
          <select 
            className="form-select" 
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            required
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-light"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-dark"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Creando...
            </>
          ) : (
            'Crear tarea'
          )}
        </button>
      </div>
    </form>
  );
}
