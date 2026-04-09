import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import Nav from "../../components/Nav";

export default function MyAppointments({ currentPath, onNavigate }) {
  const { user } = useAuth();
  const { appointments, patients } = useData();

  const patient = patients.find(p => p.name === user?.name) || patients[0];
  const myAppts = appointments.filter(a => a.patientId === patient?.id);
  const upcoming  = myAppts.filter(a => a.status === "Upcoming");
  const completed = myAppts.filter(a => a.status === "Completed");

  return (
    <div className="page">
      <Nav currentPath={currentPath} onNavigate={onNavigate} />
      <div className="main container animate-in">
        <div className="page-title">My Appointments</div>
        <div className="page-subtitle">{myAppts.length} total · {upcoming.length} upcoming</div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: 24 }}>
          <div className="stat-card blue">
            <div className="stat-label">Upcoming</div>
            <div className="stat-value">{upcoming.length}</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{completed.length}</div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="section-header">
            <div className="section-title">📅 Upcoming</div>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate("/patient/book")}>+ Book New</button>
          </div>
          {upcoming.length === 0
            ? <div className="empty"><div className="empty-icon">📅</div>No upcoming appointments</div>
            : upcoming.map(a => (
                <div key={a.id} className="appt-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, background: "var(--blue-bg)", border: "1px solid var(--blue)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>📅</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{a.doctor}</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{a.date} · {a.time}</div>
                    </div>
                  </div>
                  <span className="badge badge-blue">{a.status}</span>
                </div>
              ))
          }
        </div>

        {/* Completed */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>✓ Past Visits</div>
          {completed.length === 0
            ? <div className="empty"><div className="empty-icon">✓</div>No completed visits yet</div>
            : completed.map(a => (
                <div key={a.id} className="appt-card" style={{ opacity: 0.7 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, background: "var(--green-bg)", border: "1px solid var(--green)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>✓</div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{a.doctor}</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{a.date} · {a.time}</div>
                    </div>
                  </div>
                  <span className="badge badge-green">{a.status}</span>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}
