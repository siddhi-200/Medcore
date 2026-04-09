import { useData } from "../context/DataContext";
import Nav from "../components/Nav";

export default function Reports({ currentPath, onNavigate }) {
  const { patients, doctors } = useData();

  const total     = patients.length;
  const emergency = patients.filter(p => p.type === "Emergency").length;
  const opd       = patients.filter(p => p.type === "OPD").length;
  const completed = patients.filter(p => p.status === "Completed").length;
  const waiting   = patients.filter(p => p.status === "Waiting").length;
  const inTx      = patients.filter(p => p.status === "In Treatment").length;
  const critical  = patients.filter(p => p.severity === "critical").length;
  const serious   = patients.filter(p => p.severity === "serious").length;
  const stable    = patients.filter(p => p.severity === "stable").length;

  const pct    = (n) => total     ? Math.round((n / total)     * 100) : 0;
  const sevPct = (n) => emergency ? Math.round((n / emergency) * 100) : 0;

  const BarRow = ({ label, value, max, color }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{label}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.8rem" }}>{value}</span>
      </div>
      <div style={{ height: 6, background: "var(--surface2)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${max ? Math.round((value / max) * 100) : 0}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );

  return (
    <div className="page">
      <Nav currentPath={currentPath} onNavigate={onNavigate} />
      <div className="main container animate-in">
        <div className="page-title">📈 Reports & Analytics</div>
        <div className="page-subtitle">Hospital performance overview</div>

        <div className="stats-grid" style={{ marginBottom: 28 }}>
          <div className="stat-card blue">
            <div className="stat-label">Total Patients</div>
            <div className="stat-value">{total}</div>
          </div>
          <div className="stat-card red">
            <div className="stat-label">Emergency Rate</div>
            <div className="stat-value">{pct(emergency)}%</div>
            <div className="stat-sub">{emergency} of {total} patients</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Discharge Rate</div>
            <div className="stat-value">{pct(completed)}%</div>
            <div className="stat-sub">{completed} completed</div>
          </div>
          <div className="stat-card teal">
            <div className="stat-label">Doctor Utilization</div>
            <div className="stat-value">
              {doctors.length ? Math.round((doctors.filter(d => !d.available).length / doctors.length) * 100) : 0}%
            </div>
            <div className="stat-sub">{doctors.filter(d => !d.available).length} occupied</div>
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="section-title" style={{ marginBottom: 20 }}>Patient Status Breakdown</div>
            <BarRow label="Waiting"      value={waiting}   max={total} color="var(--amber)" />
            <BarRow label="In Treatment" value={inTx}      max={total} color="var(--blue)"  />
            <BarRow label="Completed"    value={completed} max={total} color="var(--green)" />
            <hr className="divider" />
            <div className="section-title" style={{ marginBottom: 16, marginTop: 4 }}>Patient Type</div>
            <BarRow label="Emergency" value={emergency} max={total} color="var(--red)"  />
            <BarRow label="OPD"       value={opd}       max={total} color="var(--blue)" />
          </div>

          <div className="card">
            <div className="section-title" style={{ marginBottom: 20 }}>Emergency Severity Distribution</div>
            {emergency === 0
              ? <div className="empty"><div className="empty-icon">✓</div>No emergency patients</div>
              : (
                <>
                  <BarRow label="Critical" value={critical} max={emergency} color="var(--red)"   />
                  <BarRow label="Serious"  value={serious}  max={emergency} color="var(--amber)" />
                  <BarRow label="Stable"   value={stable}   max={emergency} color="var(--green)" />
                  <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                    {[
                      { label: "Critical", val: sevPct(critical), bg: "var(--red-bg)",   border: "var(--red)",   color: "var(--red)"   },
                      { label: "Serious",  val: sevPct(serious),  bg: "var(--amber-bg)", border: "var(--amber)", color: "var(--amber)" },
                      { label: "Stable",   val: sevPct(stable),   bg: "var(--green-bg)", border: "var(--green)", color: "var(--green)" },
                    ].map(s => (
                      <div key={s.label} style={{ flex: 1, background: s.bg, border: `1px solid ${s.border}`, borderRadius: "var(--radius)", padding: "10px 14px", textAlign: "center" }}>
                        <div style={{ color: s.color, fontWeight: 600, fontSize: "1.3rem" }}>{s.val}%</div>
                        <div style={{ color: "var(--muted)", fontSize: "0.72rem" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </>
              )
            }

            <hr className="divider" />
            <div className="section-title" style={{ marginBottom: 16 }}>Doctor Load</div>
            {doctors.map(d => (
              <BarRow
                key={d.id}
                label={d.name}
                value={d.patients}
                max={Math.max(...doctors.map(x => x.patients), 1)}
                color="var(--teal)"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
