import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import Nav from "../../components/Nav";

const TIMES = ["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","02:00 PM","02:30 PM","03:00 PM","03:30 PM","04:00 PM"];

export default function BookAppointment({ currentPath, onNavigate }) {
  const { user } = useAuth();
  const { doctors, addAppointment, patients } = useData();
  const [form, setForm] = useState({ doctorId: "", date: "", time: "" });
  const [success, setSuccess] = useState(null);

  const patient = patients.find(p => p.name === user?.name) || patients[0];
  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const selectedDoctor = doctors.find(d => d.id === form.doctorId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const a = addAppointment({
      patientId: patient?.id || "P_GUEST",
      doctor: selectedDoctor?.name,
      date: form.date,
      time: form.time,
    });
    setSuccess(a);
    setForm({ doctorId: "", date: "", time: "" });
  };

  // Minimum date = today
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="page">
      <Nav currentPath={currentPath} onNavigate={onNavigate} />
      <div className="main container animate-in">
        <div className="page-title">Book Appointment</div>
        <div className="page-subtitle">Select a doctor and preferred time slot</div>

        {success && (
          <div style={{ background: "var(--green-bg)", border: "1px solid var(--green)", borderRadius: "var(--radius-lg)", padding: "14px 20px", marginBottom: 24, color: "var(--green)" }}>
            ✓ Appointment booked with <strong>{success.doctor}</strong> on {success.date} at {success.time}.
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 12 }} onClick={() => onNavigate("/patient/appointments")}>
              View Appointments →
            </button>
          </div>
        )}

        <div className="grid-2">
          <div className="card">
            <div className="section-title" style={{ marginBottom: 20 }}>Appointment Details</div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label">Select Doctor</label>
                <select className="select" value={form.doctorId} onChange={set("doctorId")} required>
                  <option value="">Choose a doctor…</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id} disabled={!d.available}>
                      {d.name} – {d.speciality}{!d.available ? " (Unavailable)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDoctor && (
                <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 14px", marginBottom: 16, fontSize: "0.82rem" }}>
                  <span className={`badge ${selectedDoctor.available ? "badge-green" : "badge-red"}`} style={{ marginBottom: 6 }}>
                    {selectedDoctor.available ? "Available" : "Unavailable"}
                  </span>
                  <div style={{ color: "var(--muted)", marginTop: 6 }}>{selectedDoctor.speciality} · Currently treating {selectedDoctor.patients} patient{selectedDoctor.patients !== 1 ? "s" : ""}</div>
                </div>
              )}

              <div className="form-group">
                <label className="label">Preferred Date</label>
                <input className="input" type="date" min={today} value={form.date} onChange={set("date")} required />
              </div>

              <div className="form-group">
                <label className="label">Preferred Time</label>
                <select className="select" value={form.time} onChange={set("time")} required>
                  <option value="">Select a time slot…</option>
                  {TIMES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                📅 Confirm Appointment
              </button>
            </form>
          </div>

          {/* Doctor cards */}
          <div>
            <div style={{ marginBottom: 12, fontWeight: 500, color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Available Doctors</div>
            {doctors.filter(d => d.available).map(d => (
              <div
                key={d.id}
                className="card card-sm"
                style={{ marginBottom: 10, cursor: "pointer", border: form.doctorId === d.id ? "1px solid var(--accent)" : "1px solid var(--border)", background: form.doctorId === d.id ? "var(--blue-bg)" : "var(--surface)" }}
                onClick={() => setForm(prev => ({ ...prev, doctorId: d.id }))}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{d.name}</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{d.speciality}</div>
                  </div>
                  <span className="badge badge-green">Available</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
