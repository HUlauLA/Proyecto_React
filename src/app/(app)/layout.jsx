import Sidebar from "@/components/Sidebar";
import Protected from "@/components/Protected";

export const metadata = { title: "Gestor de Proyectos" };

export default function AppLayout({ children }) {
  return (
    <Protected>
      <div className="container-fluid">
        <div className="row">
          <aside className="col-12 col-md-3 col-lg-2 border-end p-0">
            <Sidebar />
          </aside>
          <section className="col-12 col-md-9 col-lg-10 p-3">
            {children}
          </section>
        </div>
      </div>
    </Protected>
  );
}