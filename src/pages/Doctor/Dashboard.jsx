import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import Nav from "../../components/Nav";

export default function DoctorDashboard({ currentPath, onNavigate }) {
  const { user } = useAuth();
  const { patients, emergencyQueue, doctors } = useData();

  const doctor = doctors.find(d => d.name === user?.name) || doctors[0];
  const myPatients = patients.filter(p => p.doctor === doctor?.id);
  const myEmergency = emergencyQueue.filter(p => p.doctor === doctor?.id);
  const todayOpd = myPatients.filter(p => p.type === "OPD");

  return (
    <div className="page">
      <Nav currentPath={currentPath} onNavigate={onNavigate} />
      <div className="main container animate-in">
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--teal-bg)", border: "2px solid var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
            👨‍⚕️
          </div>
          <div>
            <div className="page-title" style={{ marginBottom: 2 }}>{user?.name || "Doctor"}</div>
            <div style={{ color: "var(--muted)", fontSize: "0.875rem" }}>{doctor?.speciality} · {new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long" })}</div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card red">
            <div className="stat-label">Emergency Assigned</div>
            <div className="stat-value">{myEmergency.length}</div>
            <div className="stat-sub">active cases</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-label">OPD Patients</div>
            <div className="stat-value">{todayOpd.length}</div>
            <div className="stat-sub">today's schedule</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{myPatients.filter(p => p.status === "Completed").length}</div>
            <div className="stat-sub">treated today</div>
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="section-header">
              <div className="section-title">🚑 Emergency Cases</div>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("/doctor/queue")}>View Queue</button>
            </div>
            {myEmergency.length === 0
              ? <div className="empty"><div className="empty-icon">✓</div>No emergency cases assigned</div>
              : myEmergency.map(p => (
                  <div key={p.id} className={`queue-card ${p.severity}`}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{p.name}</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>Age {p.age} · {p.time}</div>
                    </div>
                    <span className={`priority-${p.severity}`}>{p.severity}</span>
                  </div>
                ))
            }
          </div>

          <div className="card">
            <div className="section-header">
              <div className="section-title">📋 Today's OPD</div>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("/doctor/treat")}>Treat Patients</button>
            </div>
            {todayOpd.length === 0
              ? <div className="empty"><div className="empty-icon">📋</div>No OPD patients today</div>
              : todayOpd.map(p => (
                  <div key={p.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: "0.875rem" }}>{p.name}</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{p.time}</div>
                    </div>
                    <span className={`badge ${p.status === "Completed" ? "badge-green" : "badge-amber"}`}>{p.status}</span>
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
