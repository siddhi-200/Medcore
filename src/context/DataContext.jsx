import { createContext, useContext, useState } from "react";

/* ─ Seed Data ─ */
const seedDoctors = [
  { id: "D1", name: "Dr. Priya Nair",    speciality: "Emergency",   available: true,  patients: 4 },
  { id: "D2", name: "Dr. Arjun Mehta",   speciality: "Cardiology",  available: true,  patients: 2 },
  { id: "D3", name: "Dr. Sneha Kulkarni",speciality: "Neurology",   available: false, patients: 6 },
  { id: "D4", name: "Dr. Ravi Sharma",   speciality: "Orthopedics", available: true,  patients: 1 },
];

const seedPatients = [
  { id: "P1001", name: "Aisha Khan",     age: 34, type: "Emergency", severity: "critical", status: "In Treatment", doctor: "D1", time: "09:14" },
  { id: "P1002", name: "Rajan Pillai",   age: 57, type: "Emergency", severity: "serious",  status: "Waiting",      doctor: "D1", time: "09:22" },
  { id: "P1003", name: "Meera Iyer",     age: 29, type: "OPD",       severity: null,       status: "Waiting",      doctor: "D2", time: "10:00" },
  { id: "P1004", name: "Suresh Nambiar", age: 63, type: "OPD",       severity: null,       status: "Completed",    doctor: "D3", time: "08:45" },
  { id: "P1005", name: "Laila Fernandez",age: 22, type: "Emergency", severity: "stable",   status: "Waiting",      doctor: "D4", time: "09:50" },
];

const seedAppointments = [
  { id: "A1", patientId: "P1003", doctor: "Dr. Arjun Mehta", date: "2025-06-18", time: "10:00 AM", status: "Upcoming" },
  { id: "A2", patientId: "P1004", doctor: "Dr. Sneha Kulkarni", date: "2025-06-15", time: "08:30 AM", status: "Completed" },
];

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [patients, setPatients] = useState(seedPatients);
  const [doctors,  setDoctors]  = useState(seedDoctors);
  const [appointments, setAppointments] = useState(seedAppointments);
  const [undoStack, setUndoStack] = useState([]); // { action, payload, timestamp }

  /* ── Helpers ── */
  const pushUndo = (action, payload) => {
    setUndoStack(prev => [...prev, { action, payload, timestamp: new Date().toLocaleTimeString() }]);
  };

  /* ── Patient ops ── */
  const addPatient = (patient) => {
    const p = { ...patient, id: `P${Date.now()}` };
    setPatients(prev => [p, ...prev]);
    pushUndo("ADD_PATIENT", p);
    return p;
  };

  const removePatient = (id) => {
    const p = patients.find(x => x.id === id);
    setPatients(prev => prev.filter(x => x.id !== id));
    if (p) pushUndo("REMOVE_PATIENT", p);
  };

  const updatePatient = (id, changes) => {
    const old = patients.find(x => x.id === id);
    setPatients(prev => prev.map(x => x.id === id ? { ...x, ...changes } : x));
    if (old) pushUndo("UPDATE_PATIENT", old);
  };

  const markTreated = (id) => updatePatient(id, { status: "Completed" });

  /* ── Doctor ops ── */
  const addDoctor = (doctor) => {
    const d = { ...doctor, id: `D${Date.now()}`, patients: 0 };
    setDoctors(prev => [...prev, d]);
    pushUndo("ADD_DOCTOR", d);
    return d;
  };

  const removeDoctor = (id) => {
    const d = doctors.find(x => x.id === id);
    setDoctors(prev => prev.filter(x => x.id !== id));
    if (d) pushUndo("REMOVE_DOCTOR", d);
  };

  const toggleDoctorAvailability = (id) => {
    const d = doctors.find(x => x.id === id);
    setDoctors(prev => prev.map(x => x.id === id ? { ...x, available: !x.available } : x));
    if (d) pushUndo("TOGGLE_DOCTOR", d);
  };

  /* ── Appointment ops ── */
  const addAppointment = (appt) => {
    const a = { ...appt, id: `A${Date.now()}`, status: "Upcoming" };
    setAppointments(prev => [...prev, a]);
    pushUndo("BOOK_APPOINTMENT", a);
    return a;
  };

  /* ── Undo ── */
  const undo = () => {
    if (!undoStack.length) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));

    switch (last.action) {
      case "ADD_PATIENT":    setPatients(prev => prev.filter(x => x.id !== last.payload.id)); break;
      case "REMOVE_PATIENT": setPatients(prev => [last.payload, ...prev]); break;
      case "UPDATE_PATIENT": setPatients(prev => prev.map(x => x.id === last.payload.id ? last.payload : x)); break;
      case "ADD_DOCTOR":     setDoctors(prev => prev.filter(x => x.id !== last.payload.id)); break;
      case "REMOVE_DOCTOR":  setDoctors(prev => [...prev, last.payload]); break;
      case "TOGGLE_DOCTOR":  setDoctors(prev => prev.map(x => x.id === last.payload.id ? last.payload : x)); break;
      case "BOOK_APPOINTMENT": setAppointments(prev => prev.filter(x => x.id !== last.payload.id)); break;
      default: break;
    }
    return last;
  };

  /* ── Hash Table search (O(1) lookup by ID) ── */
  const patientHashTable = patients.reduce((map, p) => { map[p.id] = p; return map; }, {});
  const findPatientById = (id) => patientHashTable[id] || null;

  /* ── Priority Queue sort (critical > serious > stable > null) ── */
  const priorityOrder = { critical: 0, serious: 1, stable: 2, null: 3 };
  const emergencyQueue = patients
    .filter(p => p.type === "Emergency" && p.status !== "Completed")
    .sort((a, b) => (priorityOrder[a.severity] ?? 3) - (priorityOrder[b.severity] ?? 3));

  return (
    <DataContext.Provider value={{
      patients, doctors, appointments, undoStack, emergencyQueue,
      addPatient, removePatient, updatePatient, markTreated,
      addDoctor, removeDoctor, toggleDoctorAvailability,
      addAppointment, undo, findPatientById,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
