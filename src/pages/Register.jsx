import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Register({ onNavigate, onSwitchToLogin }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "patient" });
  const [error, setError] = useState("");

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    login({ name: form.name, email: form.email, role: form.role });
    onNavigate(`/${form.role}`);
  };

  return (
    <div className="auth-wrap animate-in">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-mark">🏥</div>
          <div className="auth-title">Create Account</div>
          <div className="auth-sub">Join MediFlow HMS</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Full Name</label>
            <input className="input" placeholder="Your full name" value={form.name} onChange={set("name")} required />
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
          </div>
          <div className="form-group">
            <label className="label">Role</label>
            <select className="select" value={form.role} onChange={set("role")}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin / Reception</option>
            </select>
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set("password")} required />
          </div>
          <div className="form-group">
            <label className="label">Confirm Password</label>
            <input className="input" type="password" placeholder="Repeat password" value={form.confirm} onChange={set("confirm")} required />
          </div>

          {error && (
            <div style={{ background: "var(--red-bg)", border: "1px solid var(--red)", borderRadius: "var(--radius)", padding: "10px 14px", color: "var(--red)", fontSize: "0.82rem", marginBottom: "16px" }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginBottom: "10px" }}>
            Create Account
          </button>
        </form>

        <hr className="divider" />
        <div style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--muted)" }}>
          Already have an account?{" "}
          <a href="#" style={{ color: "var(--accent)" }} onClick={e => { e.preventDefault(); onSwitchToLogin(); }}>
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
