"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function PerfilPage() {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [message, setMessage] = useState("");

    if (!user) return <p className="p-4">Debes iniciar sesión para ver tu perfil.</p>;

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage("");

        if (form.newPassword !== form.confirmPassword) {
            setMessage("La nueva contraseña y la confirmación no coinciden.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:3001/users/${user.id}`);
            const userData = await res.json();

            if (userData.password !== form.currentPassword) {
                setMessage("La contraseña actual es incorrecta.");
                return;
            }

            await fetch(`http://localhost:3001/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: form.newPassword }),
            });

            setMessage("Contraseña actualizada correctamente ✅");
            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setShowModal(false);
        } catch (error) {
            console.error(error);
            setMessage("Ocurrió un error al actualizar la contraseña.");
        }
    };

    return (
        <div className="p-4">
            <h2 className="mb-4">Mi perfil</h2>

            <div className="row g-3">
                {/* Card izquierda */}
                <div className="col-md-9">
                    <div className="card p-3 shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="text-center text-uppercase mb-4">Información personal</h5>
                            <table className="table table-sm table-bordered text-center">
                                <tbody>
                                    <tr>
                                        <th scope="row" style={{ width: "30%" }}>Nombre</th>
                                        <td>{user.name}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Correo</th>
                                        <td>{user.email}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Rol</th>
                                        <td>
                                            <span
                                                className={`badge ${user.role === "gerente" ? "bg-primary" : "bg-secondary"
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Card derecha */}
                <div className="col-md-3">
                    <div className="card p-3 shadow-sm h-100 text-center d-flex flex-column justify-content-center">
                        <div className="card-body">
                            <i className="bi bi-person-circle display-1 text-secondary"></i>
                           
                            <button
                                className="btn btn-outline-dark d-block mx-auto btn-sm mt-2"
                                onClick={() => setShowModal(true)}
                            >
                                Actualizar contraseña
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para cambio de contraseña */}
            {showModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <form onSubmit={handlePasswordChange}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Actualizar contraseña</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setShowModal(false)}
                                        />
                                    </div>
                                    <div className="modal-body">
                                        {message && <div className="alert alert-info">{message}</div>}
                                        <div className="mb-3">
                                            <label className="form-label">Contraseña actual</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={form.currentPassword}
                                                onChange={(e) =>
                                                    setForm({ ...form, currentPassword: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Nueva contraseña</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={form.newPassword}
                                                onChange={(e) =>
                                                    setForm({ ...form, newPassword: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Confirmar nueva contraseña</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={form.confirmPassword}
                                                onChange={(e) =>
                                                    setForm({ ...form, confirmPassword: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancelar
                                        </button>
                                        <button type="submit" className="btn btn-dark">
                                            Guardar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
