import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../pages/style.css";

const DEMO_USERS = {
  admin:   { name: "Admin User",    email: "admin@hospital.com",   password: "admin123" },
  doctor:  { name: "Dr. Priya Nair",email: "doctor@hospital.com",  password: "doctor123" },
  patient: { name: "Aisha Khan",    email: "patient@hospital.com", password: "patient123" },
};

export default function Login({ onNavigate, onSwitchToRegister }) {
  const { login } = useAuth();
  const [role,     setRole]     = useState("admin");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const demo = DEMO_USERS[role];
      if (email === demo.email && password === demo.password) {
        login({ name: demo.name, email, role });
        onNavigate(`/${role}`);
      } else {
        setError("Invalid credentials. Use the demo credentials below.");
      }
      setLoading(false);
    }, 600);
  };

  const fillDemo = () => {
    const demo = DEMO_USERS[role];
    setEmail(demo.email);
    setPassword(demo.password);
  };

  return (
    <div className="auth-wrap animate-in">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-mark">🏥</div>
          <div className="auth-title">MediFlow HMS</div>
          <div className="auth-sub">Hospital Management System</div>
        </div>

        {/* Role selector */}
        <div className="form-group">
          <label className="label">Sign in as</label>
          <div className="role-grid">
            {[
              { value: "admin",   icon: "👑", label: "Admin" },
              { value: "doctor",  icon: "👨‍⚕️", label: "Doctor" },
              { value: "patient", icon: "🧑", label: "Patient" },
            ].map(r => (
              <div key={r.value}>
                <input
                  type="radio"
                  id={`role-${r.value}`}
                  name="role"
                  value={r.value}
                  className="role-option"
                  checked={role === r.value}
                  onChange={() => { setRole(r.value); setEmail(""); setPassword(""); setError(""); }}
                />
                <label htmlFor={`role-${r.value}`} className="role-label">
                  <span className="role-icon">{r.icon}</span>
                  {r.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder={`${DEMO_USERS[role].email}`}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ background: "var(--red-bg)", border: "1px solid var(--red)", borderRadius: "var(--radius)", padding: "10px 14px", color: "var(--red)", fontSize: "0.82rem", marginBottom: "16px" }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginBottom: "10px" }} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <button type="button" className="btn btn-ghost" style={{ width: "100%" }} onClick={fillDemo}>
            Fill demo credentials
          </button>
        </form>

        <hr className="divider" />
        <div style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--muted)" }}>
          New here?{" "}
          <a href="#" style={{ color: "var(--accent)" }} onClick={e => { e.preventDefault(); onSwitchToRegister(); }}>
            Create account
          </a>
        </div>
      </div>
    </div>
  );
}
