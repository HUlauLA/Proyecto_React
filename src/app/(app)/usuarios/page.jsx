"use client";
import { useState } from "react";
import { useUsers } from "@/context/UserContext";

export default function UsersPage() {
  const { users, loading, addUser, updateUser, removeUser } = useUsers();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "usuario" });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateUser(editingId, form);
    } else {
      await addUser(form);
    }
    setForm({ name: "", email: "", password: "", role: "usuario" });
    setEditingId(null);
    setShowModal(false);
  };

  if (loading) return <p className="p-4">Cargando usuarios...</p>;

  return (
    <div className="p-4">
      <h2 className="mb-4">Usuarios</h2>

      <button className="btn btn-dark mb-3" onClick={() => setShowModal(true)}>
        + Nuevo usuario
      </button>

      <div className="table-responsive">
        <table className="table table-hover table-sm align-middle">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge px-3 py-2 rounded-pill ${u.role === "gerente" ? "bg-primary" : "bg-secondary"
                    }`}>
                    {u.role}
                  </span>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline-dark me-2"
                    onClick={() => {
                      setForm({ ...u, password: "" });
                      setEditingId(u.id);
                      setShowModal(true);
                    }}
                  >
                    <i className="bi bi-pencil-square"></i> Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => removeUser(String(u.id))}
                  >
                    <i className="bi bi-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <>
          {/* Backdrop */}
          <div className="modal-backdrop fade show"></div>

          {/* Modal */}
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <form onSubmit={onSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editingId ? "Editar usuario" : "Nuevo usuario"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    />
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label text-muted">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-muted">Correo electrónico</label>
                      <input
                        type="email"
                        className="form-control"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-muted">Contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-muted">Rol</label>
                      <select
                        className="form-control"
                        value={form.role}
                        onChange={(e) =>
                          setForm({ ...form, role: e.target.value })
                        }
                      >
                        <option value="usuario">Usuario</option>
                        <option value="gerente">Gerente</option>
                      </select>
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
                    <button type="submit" className="btn btn-primary">
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
