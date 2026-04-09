import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import Nav from "../../components/Nav";

export default function TreatPatient({ currentPath, onNavigate }) {
  const { user } = useAuth();
  const { patients, doctors, markTreated, updatePatient } = useData();
  const [justTreated, setJustTreated] = useState(null);

  const doctor = doctors.find(d => d.name === user?.name) || doctors[0];
  const active = patients.filter(p => p.doctor === doctor?.id && p.status !== "Completed");

  const handleTreat = (p) => {
    markTreated(p.id);
    setJustTreated(p);
    setTimeout(() => setJustTreated(null), 3000);
  };

  return (
    <div className="page">
      <Nav currentPath={currentPath} onNavigate={onNavigate} />
      <div className="main container animate-in">
        <div className="page-title">Treat Patients</div>
        <div className="page-subtitle">{active.length} active patient{active.length !== 1 ? "s" : ""} assigned to you</div>

        {justTreated && (
          <div style={{ background: "var(--green-bg)", border: "1px solid var(--green)", borderRadius: "var(--radius-lg)", padding: "14px 20px", marginBottom: 20, color: "var(--green)", fontSize: "0.875rem" }}>
            ✓ <strong>{justTreated.name}</strong> marked as treated and removed from queue.
          </div>
        )}

        {active.length === 0 ? (
          <div className="card">
            <div className="empty">
              <div className="empty-icon">✓</div>
              <div style={{ fontWeight: 500, marginBottom: 6 }}>All patients treated!</div>
              <div style={{ color: "var(--muted)", fontSize: "0.875rem" }}>No more patients in your queue.</div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {active.map(p => (
              <div key={p.id} className="card animate-in">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: "1.1rem" }}>{p.type === "Emergency" ? "🚑" : "🏥"}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "1rem" }}>{p.name}</div>
                        <div style={{ color: "var(--muted)", fontSize: "0.78rem", fontFamily: "var(--mono)" }}>#{p.id} · Age {p.age}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                      <span className={`badge ${p.type === "Emergency" ? "badge-red" : "badge-blue"}`}>{p.type}</span>
                      {p.severity && <span className={`priority-${p.severity}`}>{p.severity}</span>}
                      <span className={`badge ${p.status === "In Treatment" ? "badge-blue" : "badge-amber"}`}>{p.status}</span>
                    </div>

                    <div style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
                      Arrived at {p.time}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {p.status === "Waiting" && (
                      <button className="btn btn-primary btn-sm" onClick={() => updatePatient(p.id, { status: "In Treatment" })}>
                        Start Treatment
                      </button>
                    )}
                    <button
                      className="btn btn-green"
                      onClick={() => handleTreat(p)}
                      style={{ minWidth: 140 }}
                    >
                      ✓ Mark as Treated
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
