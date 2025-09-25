'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login(form);
      if (response.role == 'gerente') {
        router.push('/dashboard');
      } else {
        router.push('/proyectos');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-sm" style={{ maxWidth: 400, width: '100%' }}>
        <div className="card-body p-4">
          {/* Icono */}
          <div className="text-center mb-3">
            <i className="bi bi-person-circle display-1 text-secondary"></i>
          </div>

          <h4 className="text-center mb-4">Iniciar sesión</h4>

          <form onSubmit={onSubmit} className="vstack gap-3">
            <div>
              <label className="form-label">Correo electrónico</label>
              <input
                className="form-control"
                type="email"
                placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label">Contraseña</label>
              <input
                className="form-control"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <button className="btn btn-dark w-100">Ingresar</button>

            <div className="text-center small mt-2">
              ¿No tienes cuenta?{' '}
              <Link href="/auth/registro" className="text-decoration-none">
                Crear cuenta
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
