import { useData } from "../../context/DataContext";
import Nav from "../../components/Nav";

export default function AdminDashboard({ currentPath, onNavigate }) {
  const { patients, doctors, emergencyQueue } = useData();

  const total      = patients.length;
  const emergency  = patients.filter(p => p.type === "Emergency").length;
  const inTreatment= patients.filter(p => p.status === "In Treatment").length;
  const waiting    = patients.filter(p => p.status === "Waiting").length;
  const available  = doctors.filter(d => d.available).length;
  const critical   = emergencyQueue.filter(p => p.severity === "critical").length;

  return (
    <div className="page">
      <Nav currentPath={currentPath} onNavigate={onNavigate} />
      <div className="main container animate-in">
        <div className="page-title">Overview</div>
        <div className="page-subtitle">Real-time hospital status</div>

        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-label">Total Patients</div>
            <div className="stat-value">{total}</div>
            <div className="stat-sub">{waiting} waiting · {inTreatment} in treatment</div>
          </div>
          <div className="stat-card red">
            <div className="stat-label">Emergency Cases</div>
            <div className="stat-value">{emergency}</div>
            <div className="stat-sub">{critical} critical right now</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Doctors Available</div>
            <div className="stat-value">{available}/{doctors.length}</div>
            <div className="stat-sub">{doctors.length - available} occupied</div>
          </div>
          <div className="stat-card amber">
            <div className="stat-label">Emergency Queue</div>
            <div className="stat-value">{emergencyQueue.length}</div>
            <div className="stat-sub">sorted by priority</div>
          </div>
        </div>

        <div className="grid-2">
          {/* Emergency Queue preview */}
          <div className="card">
            <div className="section-header">
              <div>
                <div className="section-title">🚑 Emergency Queue</div>
                <div className="section-sub">Highest priority first</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("/admin/queue")}>View all</button>
            </div>
            {emergencyQueue.slice(0, 4).map(p => (
              <div key={p.id} className={`queue-card ${p.severity}`}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>{p.name}</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>#{p.id} · Arrived {p.time}</div>
                </div>
                <span className={`priority-${p.severity}`}>{p.severity}</span>
              </div>
            ))}
            {emergencyQueue.length === 0 && <div className="empty"><div className="empty-icon">✓</div>No emergency patients</div>}
          </div>

          {/* Doctors status */}
          <div className="card">
            <div className="section-header">
              <div>
                <div className="section-title">👨‍⚕️ Doctors On Duty</div>
                <div className="section-sub">Availability status</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("/admin/doctors")}>Manage</button>
            </div>
            {doctors.map(d => (
              <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: "0.875rem" }}>{d.name}</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{d.speciality} · {d.patients} patients</div>
                </div>
                <span className={`badge ${d.available ? "badge-green" : "badge-red"}`}>
                  {d.available ? "Available" : "Occupied"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="card" style={{ marginTop: 20 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Quick Actions</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-danger" onClick={() => onNavigate("/admin/triage")}>🚑 Add Emergency Patient</button>
            <button className="btn btn-ghost"  onClick={() => onNavigate("/admin/doctors")}>➕ Add Doctor</button>
            <button className="btn btn-ghost"  onClick={() => onNavigate("/admin/patients")}>🔍 Search Patient</button>
            <button className="btn btn-amber"  onClick={() => onNavigate("/admin/undo")}>↩ Undo Operations</button>
          </div>
        </div>
      </div>
    </div>
  );
}
