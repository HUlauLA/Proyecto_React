/* 
   Datos ingresados para el inicio de sesión:
   Correo: laura09sofia@gmail.com
   Contraseña: 123abc 
   rol: Gerente
*/
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form);
      router.push("/dashboard"); 
    } catch (err) {
      setError(err.message || "Error al iniciar sesión"); 
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <h2 className="mb-3">Iniciar sesión</h2>
      <form onSubmit={onSubmit} className="vstack gap-3">
        <input className="form-control" type="email" placeholder="Correo"
               value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <input className="form-control" type="password" placeholder="Contraseña"
               value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <button className="btn btn-primary">Ingresar</button>
        <div className="small">
          ¿No tienes cuenta? <Link href="/auth/registro">Crear cuenta</Link>
        </div>
      </form>
    </div>
  );
}