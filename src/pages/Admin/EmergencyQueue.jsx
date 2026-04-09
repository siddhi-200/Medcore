import { useData } from "../../context/DataContext";
import Nav from "../../components/Nav";

const BADGE = { critical: "badge-red", serious: "badge-amber", stable: "badge-green" };
const RANK  = { critical: 1, serious: 2, stable: 3 };

export default function EmergencyQueue({ currentPath, onNavigate }) {
  const { emergencyQueue, updatePatient, doctors } = useData();

  const getDoctorName = (id) => doctors.find(d => d.id === id)?.name || "Unassigned";

  return (
    <div className="page">
      <Nav currentPath={currentPath} onNavigate={onNavigate} />
      <div className="main container animate-in">
        <div className="page-title">Emergency Queue</div>
        <div className="page-subtitle">
          {emergencyQueue.length} active patients · Sorted by priority
        </div>

        {/* Priority summary bar */}
        <div className="stats-grid" style={{ marginBottom: 28 }}>
          {["critical","serious","stable"].map(sev => {
            const count = emergencyQueue.filter(p => p.severity === sev).length;
            const cls   = sev === "critical" ? "red" : sev === "serious" ? "amber" : "green";
            return (
              <div key={sev} className={`stat-card ${cls}`}>
                <div className="stat-label">{sev}</div>
                <div className="stat-value">{count}</div>
                <div className="stat-sub">patients in queue</div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <div className="section-header">
            <div className="section-title">Active Emergency Patients</div>
            <button className="btn btn-danger btn-sm" onClick={() => onNavigate("/admin/triage")}>+ Add Patient</button>
          </div>

          {emergencyQueue.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🏥</div>
              <div>No active emergency patients</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>ID</th>
                    <th>Severity</th>
                    <th>Assigned Doctor</th>
                    <th>Arrived</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {emergencyQueue.map((p, i) => (
                    <tr key={p.id}>
                      <td style={{ fontFamily: "var(--mono)", color: "var(--muted)", fontSize: "0.8rem" }}>{i + 1}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{p.name}</div>
                        <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>Age {p.age}</div>
                      </td>
                      <td><span style={{ fontFamily: "var(--mono)", fontSize: "0.8rem", color: "var(--muted)" }}>{p.id}</span></td>
                      <td><span className={`priority-${p.severity}`}>{p.severity}</span></td>
                      <td style={{ fontSize: "0.875rem" }}>{getDoctorName(p.doctor)}</td>
                      <td style={{ color: "var(--muted)", fontSize: "0.82rem" }}>{p.time}</td>
                      <td>
                        <span className={`badge ${p.status === "In Treatment" ? "badge-blue" : "badge-amber"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          {p.status === "Waiting" && (
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => updatePatient(p.id, { status: "In Treatment" })}
                            >
                              Start
                            </button>
                          )}
                          <button
                            className="btn btn-green btn-sm"
                            onClick={() => updatePatient(p.id, { status: "Completed" })}
                          >
                            Discharge
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
