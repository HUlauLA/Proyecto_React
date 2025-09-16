"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function RegistroPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "usuario" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Error al registrar");
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 520 }}>
      <h2 className="mb-3">Crear cuenta</h2>
      <form onSubmit={onSubmit} className="row g-3">
        <div className="col-12">
          <input className="form-control" placeholder="Nombre"
                 value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        </div>
        <div className="col-12 col-md-8">
          <input className="form-control" type="email" placeholder="Correo"
                 value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        </div>
        <div className="col-12 col-md-4">
          <select className="form-select" value={form.role}
                  onChange={e=>setForm({...form, role:e.target.value})}>
            <option value="usuario">Usuario</option>
            <option value="gerente">Gerente</option>
          </select>
        </div>
        <div className="col-12">
          <input className="form-control" type="password" placeholder="Contraseña"
                 value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
        </div>
        {error && <div className="col-12"><div className="alert alert-danger py-2">{error}</div></div>}
        <div className="col-12 d-flex gap-2">
          <button className="btn btn-primary">Registrarme</button>
          <Link className="btn btn-outline-secondary" href="/auth/login">Ya tengo cuenta</Link>
        </div>
      </form>
    </div>
  );
}