import { useData } from "../../context/DataContext";
import Nav from "../../components/Nav";

const ACTION_LABELS = {
  ADD_PATIENT:      { icon: "➕", label: "Added Patient",          color: "var(--blue)" },
  REMOVE_PATIENT:   { icon: "🗑️", label: "Removed Patient",         color: "var(--red)" },
  UPDATE_PATIENT:   { icon: "✏️", label: "Updated Patient",         color: "var(--amber)" },
  ADD_DOCTOR:       { icon: "➕", label: "Added Doctor",            color: "var(--blue)" },
  REMOVE_DOCTOR:    { icon: "🗑️", label: "Removed Doctor",           color: "var(--red)" },
  TOGGLE_DOCTOR:    { icon: "🔄", label: "Toggled Doctor Status",   color: "var(--teal)" },
  BOOK_APPOINTMENT: { icon: "📅", label: "Booked Appointment",      color: "var(--green)" },
};

export default function Undo({ currentPath, onNavigate }) {
  const { undoStack, undo } = useData();
  const reversed = [...undoStack].reverse(); // top of stack first

  const handleUndo = () => {
    const result = undo();
    // result contains the undone action
  };

  return (
    <div className="page">
      <Nav currentPath={currentPath} onNavigate={onNavigate} />
      <div className="main container animate-in">
        <div className="page-title">Undo Operations</div>
        <div className="page-subtitle">Stack-based operation history · Last-in, first-out</div>

        <div className="grid-2">
          {/* Stack visual */}
          <div className="card">
            <div className="section-header">
              <div>
                <div className="section-title">Operation Stack</div>
                <div className="section-sub">{undoStack.length} actions recorded</div>
              </div>
              <button
                className="btn btn-amber"
                onClick={handleUndo}
                disabled={undoStack.length === 0}
                style={{ opacity: undoStack.length === 0 ? 0.4 : 1 }}
              >
                ↩ Undo Last
              </button>
            </div>

            {undoStack.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📋</div>
                <div>No operations yet. Perform actions to track history.</div>
              </div>
            ) : (
              <div className="stack-visual">
                {reversed.map((item, i) => {
                  const meta = ACTION_LABELS[item.action] || { icon: "?", label: item.action, color: "var(--muted)" };
                  const isTop = i === 0;
                  return (
                    <div
                      key={i}
                      className="stack-item"
                      style={{
                        borderColor: isTop ? "var(--accent)" : "var(--border)",
                        background: isTop ? "var(--blue-bg)" : "var(--surface2)",
                        opacity: 1 - (i * 0.12),
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {isTop && <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--accent)", marginRight: 4 }}>TOP ↑</span>}
                        <span style={{ fontSize: "1rem" }}>{meta.icon}</span>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: "0.875rem", color: isTop ? "var(--accent)" : "var(--text)" }}>
                            {meta.label}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                            {item.payload?.name || item.payload?.id || ""}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--muted)" }}>
                        {item.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info panel */}
          <div>
            <div className="card">
              <div className="section-title" style={{ marginBottom: 14 }}>How It Works</div>
              <div className="timeline">
                {[
                  { title: "Action performed", desc: "Every add, remove, or update is pushed onto the stack." },
                  { title: "Stack grows", desc: "Most recent action is always at the top (LIFO)." },
                  { title: "Undo pressed", desc: "Top item is popped and the inverse operation is applied." },
                  { title: "State restored", desc: "System reverts to exactly the previous state." },
                ].map((s, i) => (
                  <div className="timeline-item" key={i}>
                    <div style={{ fontWeight: 500, fontSize: "0.875rem" }}>{s.title}</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ marginTop: 16 }}>
              <div className="section-title" style={{ marginBottom: 10 }}>Tracked Actions</div>
              {Object.entries(ACTION_LABELS).map(([key, val]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                  <span>{val.icon}</span>
                  <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{val.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
