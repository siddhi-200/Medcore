import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import Nav from "../../components/Nav";

export default function PatientDashboard({ currentPath, onNavigate }) {
  const { user } = useAuth();
  const { patients, appointments, doctors } = useData();

  // Find this patient's record (match by name for demo)
  const record = patients.find(p => p.name === user?.name) || patients[0];
  const myAppts = appointments.filter(a => a.patientId === record?.id);
  const upcoming = myAppts.filter(a => a.status === "Upcoming");
  const getDoctorName = (id) => doctors.find(d => d.id === id)?.name || "–";

  const statusColor = {
    Waiting:       "badge-amber",
    "In Treatment":"badge-blue",
    Completed:     "badge-green",
  };

  return (
    <div className="page">
      <Nav currentPath={currentPath} onNavigate={onNavigate} />
      <div className="main container animate-in">
        {/* Patient header */}
        <div className="card" style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--blue-bg)", border: "2px solid var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", flexShrink: 0 }}>
            🧑
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: "1.2rem", marginBottom: 4 }}>{user?.name}</div>
            <div style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: 10 }}>{user?.email} · Patient ID: {record?.id || "–"}</div>
            <div style={{ display: "flex", gap: 8 }}>
              {record?.status && <span className={`badge ${statusColor[record.status] || "badge-blue"}`}>{record.status}</span>}
              {record?.type && <span className={`badge ${record.type === "Emergency" ? "badge-red" : "badge-blue"}`}>{record.type}</span>}
              {record?.severity && <span className={`priority-${record.severity}`}>{record.severity}</span>}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "var(--muted)", fontSize: "0.78rem", marginBottom: 4 }}>Assigned Doctor</div>
            <div style={{ fontWeight: 500 }}>{record ? getDoctorName(record.doctor) : "–"}</div>
            <div style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: 4 }}>Arrived {record?.time || "–"}</div>
          </div>
        </div>

        <div className="stats-grid" style={{ marginBottom: 24 }}>
          <div className="stat-card blue">
            <div className="stat-label">My Appointments</div>
            <div className="stat-value">{myAppts.length}</div>
            <div className="stat-sub">{upcoming.length} upcoming</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Completed Visits</div>
            <div className="stat-value">{myAppts.filter(a => a.status === "Completed").length}</div>
            <div className="stat-sub">all time</div>
          </div>
          <div className="stat-card amber">
            <div className="stat-label">Current Status</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: 4 }}>{record?.status || "Not registered"}</div>
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <div className="section-title">Upcoming Appointments</div>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate("/patient/book")}>+ Book</button>
          </div>
          {upcoming.length === 0
            ? <div className="empty"><div className="empty-icon">📅</div>No upcoming appointments · <a href="#" style={{ color: "var(--accent)" }} onClick={e => { e.preventDefault(); onNavigate("/patient/book"); }}>Book one now</a></div>
            : upcoming.map(a => (
                <div key={a.id} className="appt-card">
                  <div>
                    <div style={{ fontWeight: 500 }}>{a.doctor}</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{a.date} · {a.time}</div>
                  </div>
                  <span className="badge badge-blue">{a.status}</span>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}
