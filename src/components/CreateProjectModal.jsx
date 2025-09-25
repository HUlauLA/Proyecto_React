'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function CreateProjectModal({
  show,
  onClose,
  onProjectCreated,
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    imageFile: null,
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!show) {
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        imageFile: null,
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

  if (!show) {
    return null;
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split('T')[0];

    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!formData.description.trim())
      newErrors.description = 'La descripción es obligatoria.';
    if (!formData.startDate)
      newErrors.startDate = 'La fecha de inicio es obligatoria.';
    if (formData.startDate < today)
      newErrors.startDate = 'La fecha de inicio no puede ser en el pasado.';
    if (!formData.endDate)
      newErrors.endDate = 'La fecha de finalización es obligatoria.';
    if (formData.endDate <= formData.startDate)
      newErrors.endDate =
        'La fecha de finalización debe ser posterior a la de inicio.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    let imageUrl = '/images/default.png';

    try {
      if (formData.imageFile) {
        const imageFormData = new FormData();
        const uniqueId = uuidv4();
        const fileExtension = formData.imageFile.name.split('.').pop();
        const newFileName = `${uniqueId}-${formData.name.replace(/\s+/g, '-')}.${fileExtension}`;

        imageFormData.append('file', formData.imageFile, newFileName);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        });

        if (!uploadResponse.ok) throw new Error('Error al subir la imagen.');

        const { filePath } = await uploadResponse.json();
        imageUrl = filePath;
      }

      const newProject = {
        id: uuidv4(),
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        imageUrl,
        managerId: 1,
      };

      const projectResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + '/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      if (!projectResponse.ok) throw new Error('Error al guardar el proyecto.');

      onProjectCreated();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      setErrors({ form: error.message || 'Ocurrió un error inesperado.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!show) return null;

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
            <h5 className="modal-title">Crear proyecto</h5>
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
                <label
                  htmlFor="projectName"
                  className="form-label small text-muted"
                >
                  Nombre del proyecto
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>
              <div className="mb-3">
                <label
                  htmlFor="projectDescription"
                  className="form-label small text-muted"
                >
                  Descripción del proyecto
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
                    htmlFor="endDate"
                    className="form-label small text-muted"
                  >
                    Fecha de finalización
                  </label>
                  <input
                    type="date"
                    className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                  {errors.endDate && (
                    <div className="invalid-feedback">{errors.endDate}</div>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="imageUrl"
                  className="form-label small text-muted"
                >
                  Imagen del proyecto
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="imageFile"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
            </form>
          </div>
          <div className="modal-footer border-0 justify-content-end">
            <button type="button" className="btn btn-light" onClick={onClose}>
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
