"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Item = ({ href, label, active }) => (
  <Link href={href} className={`btn w-100 text-start ${active ? "btn-secondary" : "btn-light"}`}>
    {label}
  </Link>
);

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const onLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <div className="d-flex flex-column p-3" style={{ minHeight: "100vh" }}>
      <h5 className="mb-4">Nombre del proyecto</h5>

      <div className="d-grid gap-2">
        <Item href="/dashboard" label="Dashboard" active={pathname === "/dashboard"} />
        <Item href="/proyectos" label="Proyectos" active={pathname === "/proyectos"} />
        {/* Solo visible para coordinadores/gerentes */}
        {user?.role === "gerente" && (
          <Item href="/usuarios" label="Usuarios" active={pathname === "/usuarios"} />
        )}
      </div>

      <hr className="my-4" />

      <div className="small mb-2">
        {user ? `Sesión: ${user.name} (${user.role})` : "Sin sesión"}
      </div>
      <div className="d-grid gap-2 mt-auto">
        <Link href="/perfil" className="btn btn-light">Perfil</Link>
        <button className="btn btn-danger" type="button" onClick={onLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
}