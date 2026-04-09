import { useState } from "react";
import { useData } from "../../context/DataContext";
import Nav from "../../components/Nav";

const SEVERITIES = [
  { value: "critical", label: "Critical", desc: "Life-threatening, immediate care",   color: "var(--red)" },
  { value: "serious",  label: "Serious",  desc: "Urgent, requires prompt attention",  color: "var(--amber)" },
  { value: "stable",   label: "Stable",   desc: "Non-urgent, can wait in queue",      color: "var(--green)" },
];

export default function EmergencyTriage({ currentPath, onNavigate }) {
  const { addPatient, doctors } = useData();
  const [form, setForm] = useState({ name: "", age: "", severity: "serious", doctor: "", notes: "" });
  const [success, setSuccess] = useState(null);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const p = addPatient({
      name: form.name,
      age: parseInt(form.age),
      type: "Emergency",
      severity: form.severity,
      status: "Waiting",
      doctor: form.doctor,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      notes: form.notes,
    });
    setSuccess(p);
    setForm({ name: "", age: "", severity: "serious", doctor: "", notes: "" });
  };

  return (
    <div className="page">
      <Nav currentPath={currentPath} onNavigate={onNavigate} />
      <div className="main container animate-in">
        <div className="page-title">🚑 Emergency Triage</div>
        <div className="page-subtitle">Register incoming emergency patients · Feeds Priority Queue</div>

        {success && (
          <div style={{ background: "var(--green-bg)", border: "1px solid var(--green)", borderRadius: "var(--radius-lg)", padding: "14px 20px", marginBottom: 24, color: "var(--green)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>✓ Patient <strong>{success.name}</strong> added to queue as <strong>{success.severity}</strong> · ID: {success.id}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("/admin/queue")}>View Queue →</button>
          </div>
        )}

        <div className="grid-2">
          <div className="card">
            <div className="section-title" style={{ marginBottom: 20 }}>Patient Information</div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label">Full Name</label>
                <input className="input" placeholder="Patient full name" value={form.name} onChange={set("name")} required />
              </div>
              <div className="form-group">
                <label className="label">Age</label>
                <input className="input" type="number" min="0" max="120" placeholder="Age in years" value={form.age} onChange={set("age")} required />
              </div>
              <div className="form-group">
                <label className="label">Assign Doctor</label>
                <select className="select" value={form.doctor} onChange={set("doctor")} required>
                  <option value="">Select a doctor</option>
                  {doctors.filter(d => d.available).map(d => (
                    <option key={d.id} value={d.id}>{d.name} – {d.speciality}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Notes</label>
                <textarea className="textarea" placeholder="Chief complaint, symptoms…" value={form.notes} onChange={set("notes")} />
              </div>

              <div className="form-group">
                <label className="label">Severity</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                  {SEVERITIES.map(s => (
                    <label key={s.value} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "12px 16px", borderRadius: "var(--radius)",
                      border: `1px solid ${form.severity === s.value ? s.color : "var(--border)"}`,
                      background: form.severity === s.value ? `${s.color}15` : "var(--surface2)",
                      cursor: "pointer", transition: "all var(--transition)"
                    }}>
                      <input type="radio" name="severity" value={s.value} checked={form.severity === s.value} onChange={set("severity")} style={{ accentColor: s.color }} />
                      <div>
                        <div style={{ fontWeight: 600, color: form.severity === s.value ? s.color : "var(--text)", fontSize: "0.9rem" }}>{s.label}</div>
                        <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{s.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-danger" style={{ width: "100%", marginTop: 8 }}>
                🚑 Add to Emergency Queue
              </button>
            </form>
          </div>

          {/* Info panel */}
          <div>
            <div className="card">
              <div className="section-title" style={{ marginBottom: 14 }}>Severity Guide</div>
              {SEVERITIES.map(s => (
                <div key={s.value} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                  <span className={`priority-${s.value}`}>{s.label}</span>
                  <span style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: 2 }}>{s.desc}</span>
                </div>
              ))}
            </div>
            <div className="card" style={{ marginTop: 16 }}>
              <div className="section-title" style={{ marginBottom: 12 }}>Priority Queue Logic</div>
              <div style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.8 }}>
                Patients are sorted by severity on submission. Critical patients always appear first, followed by Serious, then Stable. Within the same severity, arrival time determines order.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
