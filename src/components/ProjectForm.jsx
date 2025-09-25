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
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
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

  const uploadFile = async () => {
    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append('file', selectedFile);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Error al subir el archivo');

    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Error en la subida');

    return data.filePath;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      let imageUrl = formData.imageUrl;

      if (selectedFile) {
        imageUrl = await uploadFile();
      }

      const projectData = {
        ...formData,
        imageUrl,
        managerId: user?.id || 1
      };

      if (isEditing && project) {
        if (!selectedFile) {
          projectData.imageUrl = project.imageUrl;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${project.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el proyecto');
        }
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
        <div className="alert alert-danger">{error}</div>
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
        <label htmlFor="imageFile" className="form-label small text-muted">
          Imagen del proyecto {isEditing && '(opcional si no deseas cambiarla)'}
        </label>
        <input
          type="file"
          className="form-control"
          id="imageFile"
          accept="image/*"
          onChange={handleFileChange}
        />
        {isEditing && project?.imageUrl && (
          <div className="form-text">
            Imagen actual:{" "}
            <a href={project.imageUrl} target="_blank" rel="noreferrer">
              Ver imagen
            </a>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-light" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-dark" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
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

