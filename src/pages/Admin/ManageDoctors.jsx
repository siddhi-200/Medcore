import { useState } from "react";
import { useData } from "../../context/DataContext";
import Nav from "../../components/Nav";

const SPECIALITIES = ["Emergency","Cardiology","Neurology","Orthopedics","Pediatrics","Oncology","General Medicine"];

export default function ManageDoctors({ currentPath, onNavigate }) {
  const { doctors, addDoctor, removeDoctor, toggleDoctorAvailability } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", speciality: "General Medicine", phone: "" });

  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const handleAdd = (e) => {
    e.preventDefault();
    addDoctor(form);
    setForm({ name: "", speciality: "General Medicine", phone: "" });
    setShowForm(false);
  };

  return (
    <div className="page">
      <Nav currentPath={currentPath} onNavigate={onNavigate} />
      <div className="main container animate-in">
        <div className="page-title">Manage Doctors</div>
        <div className="page-subtitle">{doctors.length} registered · {doctors.filter(d=>d.available).length} available</div>

        <div className="section-header">
          <div />
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ Cancel" : "+ Add Doctor"}
          </button>
        </div>

        {showForm && (
          <div className="card animate-in" style={{ marginBottom: 24 }}>
            <div className="section-title" style={{ marginBottom: 18 }}>New Doctor</div>
            <form onSubmit={handleAdd}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="label">Full Name</label>
                  <input className="input" placeholder="Dr. First Last" value={form.name} onChange={set("name")} required />
                </div>
                <div className="form-group">
                  <label className="label">Phone</label>
                  <input className="input" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Speciality</label>
                <select className="select" value={form.speciality} onChange={set("speciality")}>
                  {SPECIALITIES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Add Doctor</button>
            </form>
          </div>
        )}

        <div className="card">
          <div className="table-wrap" style={{ border: "none", borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Speciality</th>
                  <th>Patients</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map(d => (
                  <tr key={d.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{d.name}</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.78rem", fontFamily: "var(--mono)" }}>{d.id}</div>
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: "0.875rem" }}>{d.speciality}</td>
                    <td style={{ fontFamily: "var(--mono)", fontSize: "0.875rem" }}>{d.patients}</td>
                    <td>
                      <span className={`badge ${d.available ? "badge-green" : "badge-red"}`}>
                        {d.available ? "Available" : "Occupied"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => toggleDoctorAvailability(d.id)}>
                          Toggle
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => removeDoctor(d.id)}>
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
