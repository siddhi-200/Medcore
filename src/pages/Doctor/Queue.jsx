import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import Nav from "../../components/Nav";

export default function DoctorQueue({ currentPath, onNavigate }) {
  const { user } = useAuth();
  const { patients, emergencyQueue, doctors, updatePatient } = useData();
  const doctor = doctors.find(d => d.name === user?.name) || doctors[0];

  const myEmergency = emergencyQueue.filter(p => p.doctor === doctor?.id);
  const myOpd = patients.filter(p => p.type === "OPD" && p.doctor === doctor?.id && p.status !== "Completed");

  return (
    <div className="page">
      <Nav currentPath={currentPath} onNavigate={onNavigate} />
      <div className="main container animate-in">
        <div className="page-title">Patient Queue</div>
        <div className="page-subtitle">Your assigned patients · {myEmergency.length + myOpd.length} waiting</div>

        {/* Emergency section */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="section-header">
            <div>
              <div className="section-title">🚑 Emergency Patients</div>
              <div className="section-sub">Priority-sorted</div>
            </div>
            <span className="badge badge-red">{myEmergency.length}</span>
          </div>
          {myEmergency.length === 0
            ? <div className="empty"><div className="empty-icon">✓</div>No emergency cases</div>
            : myEmergency.map((p, i) => (
                <div key={p.id} className={`queue-card ${p.severity}`} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--muted)", minWidth: 16 }}>#{i+1}</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>Age {p.age} · #{p.id} · Arrived {p.time}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className={`priority-${p.severity}`}>{p.severity}</span>
                    <span className={`badge ${p.status === "In Treatment" ? "badge-blue" : "badge-amber"}`}>{p.status}</span>
                    {p.status === "Waiting" && (
                      <button className="btn btn-primary btn-sm" onClick={() => updatePatient(p.id, { status: "In Treatment" })}>
                        Start
                      </button>
                    )}
                  </div>
                </div>
              ))
          }
        </div>

        {/* OPD section */}
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">📋 OPD Queue</div>
              <div className="section-sub">Regular appointments</div>
            </div>
            <span className="badge badge-blue">{myOpd.length}</span>
          </div>
          {myOpd.length === 0
            ? <div className="empty"><div className="empty-icon">📋</div>No OPD patients waiting</div>
            : myOpd.map((p, i) => (
                <div key={p.id} className="queue-card" style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--muted)", minWidth: 16 }}>#{i+1}</span>
                    <div>
                      <div style={{ fontWeight: 500 }}>{p.name}</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>Age {p.age} · {p.time}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span className={`badge ${p.status === "In Treatment" ? "badge-blue" : "badge-amber"}`}>{p.status}</span>
                    <button className="btn btn-green btn-sm" onClick={() => onNavigate("/doctor/treat")}>Treat →</button>
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}
