'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ProjectForm({ 
  project = null, 
  onSave, 
  onCancel, 
  isEditing = false 
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos del proyecto si estamos editando
  useEffect(() => {
    if (isEditing && project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        imageUrl: project.imageUrl || ''
      });
    }
  }, [isEditing, project]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('El nombre del proyecto es requerido');
      return false;
    }
    if (!formData.description.trim()) {
      setError('La descripción del proyecto es requerida');
      return false;
    }
    if (!formData.startDate) {
      setError('La fecha de inicio es requerida');
      return false;
    }
    if (!formData.endDate) {
      setError('La fecha de finalización es requerida');
      return false;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('La fecha de inicio debe ser anterior a la fecha de finalización');
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
      const projectData = {
        ...formData,
        managerId: user?.id || 1 // Usar el ID del usuario actual como gerente
      };

      if (isEditing && project) {
        // Actualizar proyecto existente
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${project.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el proyecto');
        }
      } else {
        // Crear nuevo proyecto
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        });

        if (!response.ok) {
          throw new Error('Error al crear el proyecto');
        }
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
        <label htmlFor="name" className="form-label small text-muted">
          Nombre del proyecto *
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Ingresa el nombre del proyecto"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label small text-muted">
          Descripción del proyecto *
        </label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe los objetivos y alcance del proyecto"
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
          <label htmlFor="endDate" className="form-label small text-muted">
            Fecha de finalización *
          </label>
          <input
            type="date"
            className="form-control"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="imageUrl" className="form-label small text-muted">
          URL de imagen del proyecto
        </label>
        <input
          type="url"
          className="form-control"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleInputChange}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
        <div className="form-text">
          Puedes usar una URL de imagen externa o una imagen local
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
              {isEditing ? 'Actualizando...' : 'Creando...'}
            </>
          ) : (
            isEditing ? 'Actualizar proyecto' : 'Crear proyecto'
          )}
        </button>
      </div>
    </form>
  );
}
