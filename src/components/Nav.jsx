import { useAuth } from "../context/AuthContext";

const navLinks = {
  admin: [
    { label: "Dashboard",  path: "/admin" },
    { label: "Triage",     path: "/admin/triage" },
    { label: "Queue",      path: "/admin/queue" },
    { label: "Doctors",    path: "/admin/doctors" },
    { label: "Patients",   path: "/admin/patients" },
    { label: "Undo",       path: "/admin/undo" },
  ],
  doctor: [
    { label: "Dashboard",  path: "/doctor" },
    { label: "Queue",      path: "/doctor/queue" },
    { label: "Treat",      path: "/doctor/treat" },
  ],
  patient: [
    { label: "Dashboard",    path: "/patient" },
    { label: "Book",         path: "/patient/book" },
    { label: "Appointments", path: "/patient/appointments" },
  ],
};

export default function Nav({ currentPath, onNavigate }) {
  const { user, logout } = useAuth();
  const links = navLinks[user?.role] || [];

  return (
    <nav className="nav">
      <div className="nav-brand">MediFlow HMS</div>
      <div className="nav-links">
        {links.map(l => (
          <a
            key={l.path}
            className={`nav-link${currentPath === l.path ? " active" : ""}`}
            href="#"
            onClick={e => { e.preventDefault(); onNavigate(l.path); }}
          >
            {l.label}
          </a>
        ))}
      </div>
      <div className="nav-user">
        <span>{user?.name}</span>
        <button className="btn btn-ghost btn-sm" onClick={logout}>Sign out</button>
      </div>
    </nav>
  );
}
