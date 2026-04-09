import { useState } from "react";
import { useData } from "../context/DataContext";
import Nav from "../components/Nav";

export default function Search({ currentPath, onNavigate }) {
  const { patients, findPatientById } = useData();
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const isId = /^P\d+/i.test(query.trim());

  // Hash table O(1) for ID, linear scan for name
  const results = !query.trim() ? [] : isId
    ? (findPatientById(query.trim().toUpperCase()) ? [findPatientById(query.trim().toUpperCase())] : [])
    : patients.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="page">
      <Nav currentPath={currentPath} onNavigate={onNavigate} />
      <div className="main container animate-in">
        <div className="page-title">Search</div>
        <div className="page-subtitle">Find any patient by name or ID</div>

        <div className="card" style={{ marginBottom: 24 }}>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: 12 }}>
            <div className="search-bar" style={{ flex: 1 }}>
              <input
                className="input"
                placeholder="Type a patient name or ID (e.g. P1001)…"
                value={query}
                onChange={e => { setQuery(e.target.value); setSearched(false); }}
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          {/* Algorithm indicator */}
          {query && (
            <div style={{ marginTop: 12, padding: "8px 12px", background: "var(--surface2)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem" }}>
              <span style={{ fontFamily: "var(--mono)", color: isId ? "var(--green)" : "var(--amber)" }}>
                {isId ? "O(1) Hash Table lookup" : "O(n) Linear scan"}
              </span>
              <span style={{ color: "var(--muted)" }}>
                {isId ? `→ hashTable["${query.toUpperCase()}"]` : `→ patients.filter(name.includes("${query}"))`}
              </span>
            </div>
          )}
        </div>

        {/* Results */}
        {searched && (
          <div className="animate-in">
            <div style={{ marginBottom: 14, color: "var(--muted)", fontSize: "0.82rem" }}>
              {results.length === 0 ? "No results found" : `${results.length} result${results.length !== 1 ? "s" : ""} found`}
            </div>

            {results.length > 0 && (
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
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map(p => (
                        <tr key={p.id}>
                          <td><span style={{ fontFamily: "var(--mono)", fontSize: "0.8rem", color: "var(--accent)" }}>{p.id}</span></td>
                          <td style={{ fontWeight: 500 }}>{p.name}</td>
                          <td style={{ color: "var(--muted)" }}>{p.age}</td>
                          <td><span className={`badge ${p.type === "Emergency" ? "badge-red" : "badge-blue"}`}>{p.type}</span></td>
                          <td>
                            {p.severity
                              ? <span className={`priority-${p.severity}`}>{p.severity}</span>
                              : <span style={{ color: "var(--faint)" }}>–</span>}
                          </td>
                          <td>
                            <span className={`badge ${
                              p.status === "Completed" ? "badge-green" :
                              p.status === "In Treatment" ? "badge-blue" : "badge-amber"
                            }`}>{p.status}</span>
                          </td>
                          <td style={{ color: "var(--muted)", fontSize: "0.82rem" }}>{p.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {results.length === 0 && (
              <div className="card">
                <div className="empty">
                  <div className="empty-icon">🔍</div>
                  <div>No patients found for "{query}"</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: 6 }}>
                    Try searching by exact Patient ID (e.g. P1001) or full/partial name
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick suggestions */}
        {!searched && (
          <div className="card">
            <div className="section-title" style={{ marginBottom: 14 }}>Quick Search</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["P1001","P1002","Aisha","Rajan","Meera"].map(s => (
                <button
                  key={s}
                  className="btn btn-ghost btn-sm"
                  onClick={() => { setQuery(s); setSearched(true); }}
                  style={{ fontFamily: /^P\d/.test(s) ? "var(--mono)" : undefined }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
