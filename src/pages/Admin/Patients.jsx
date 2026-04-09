import { useState } from "react";
import { useData } from "../../context/DataContext";
import Nav from "../../components/Nav";

export default function Patients({ currentPath, onNavigate }) {
  const { patients, removePatient, findPatientById } = useData();
  const [query, setQuery]   = useState("");
  const [filter, setFilter] = useState("all");

  // Hash table lookup when query looks like a Patient ID
  const isIdQuery = /^P\d+/i.test(query.trim());
  const hashResult = isIdQuery ? findPatientById(query.trim().toUpperCase()) : null;

  const filtered = patients.filter(p => {
    const matchSearch = !query || query.trim() === "" ||
      (isIdQuery ? (hashResult && p.id === hashResult.id) : p.name.toLowerCase().includes(query.toLowerCase()));
    const matchFilter = filter === "all" || p.type.toLowerCase() === filter || p.status.toLowerCase().replace(" ","") === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="page">
      <Nav currentPath={currentPath} onNavigate={onNavigate} />
      <div className="main container animate-in">
        <div className="page-title">All Patients</div>
        <div className="page-subtitle">{patients.length} registered patients</div>

        {/* Search + filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 220 }}>
            <input
              className="input"
              placeholder="Search by name or Patient ID (e.g. P1001)…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <select className="select" style={{ width: 160 }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All patients</option>
            <option value="emergency">Emergency</option>
            <option value="opd">OPD</option>
            <option value="waiting">Waiting</option>
            <option value="intreatment">In Treatment</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Hash lookup indicator */}
        {isIdQuery && (
          <div style={{
            background: hashResult ? "var(--green-bg)" : "var(--red-bg)",
            border: `1px solid ${hashResult ? "var(--green)" : "var(--red)"}`,
            borderRadius: "var(--radius)", padding: "8px 14px", marginBottom: 16,
            fontSize: "0.82rem", color: hashResult ? "var(--green)" : "var(--red)",
            display: "flex", alignItems: "center", gap: 8
          }}>
            <span style={{ fontFamily: "var(--mono)" }}>hashTable["{query}"]</span>
            {hashResult ? `→ Found: ${hashResult.name}` : "→ null (not found)"}
          </div>
        )}

        <div className="card">
          <div className="table-wrap" style={{ border: "none", borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Arrived</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td><span style={{ fontFamily: "var(--mono)", fontSize: "0.8rem", color: "var(--muted)" }}>{p.id}</span></td>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td style={{ color: "var(--muted)" }}>{p.age}</td>
                    <td>
                      <span className={`badge ${p.type === "Emergency" ? "badge-red" : "badge-blue"}`}>{p.type}</span>
                    </td>
                    <td>
                      {p.severity
                        ? <span className={`priority-${p.severity}`}>{p.severity}</span>
                        : <span style={{ color: "var(--faint)" }}>–</span>}
                    </td>
                    <td>
                      <span className={`badge ${
                        p.status === "Completed"    ? "badge-green" :
                        p.status === "In Treatment" ? "badge-blue"  : "badge-amber"
                      }`}>{p.status}</span>
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: "0.82rem" }}>{p.time}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => removePatient(p.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="empty"><div className="empty-icon">🔍</div>No patients match this search</div>
          )}
        </div>
      </div>
    </div>
  );
}
