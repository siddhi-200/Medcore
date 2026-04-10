# 🏥 MediFlow HMS — Hospital Management System

A full React frontend for a Hospital Management System with role-based access, priority queues, hash table search, and stack-based undo.

---

## 📁 Folder Structure

```
src/
├── index.js                      ← Entry point
├── App.jsx                       ← Router (no react-router, pure state)
├── context/
│   ├── AuthContext.jsx            ← Login/logout/user state
│   └── DataContext.jsx            ← All data + DS logic (queue, hash, stack)
├── components/
│   └── Nav.jsx                   ← Shared navigation bar
└── pages/
    ├── style.css                 ← Global design system (dark clinical theme)
    ├── Login.js                  ← Role-based login
    ├── Register.js               ← New account registration
    ├── Reports.js                ← Analytics (optional)
    ├── Search.js                 ← Hash table search demo (optional)
    ├── Admin/
    │   ├── Dashboard.js          ← Overview stats + quick actions
    │   ├── EmergencyTriage.js    ← Add patient → Priority Queue
    │   ├── EmergencyQueue.js     ← Sorted emergency list
    │   ├── ManageDoctors.js      ← CRUD for doctors
    │   ├── Patients.js           ← All patients + hash search
    │   └── Undo.js               ← Stack-based undo operations
    ├── Doctor/
    │   ├── Dashboard.js          ← Doctor overview + schedule
    │   ├── Queue.js              ← Patient queue view
    │   └── TreatPatient.js       ← Mark patients as treated
    └── Patient/
        ├── Dashboard.js          ← Patient status + info
        ├── BookAppointment.js    ← Book with a doctor
        └── MyAppointments.js     ← View all appointments
```

---

## 🚀 Getting Started

```bash
npm install
npm start
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔐 Demo Credentials

| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Admin   | admin@hospital.com       | admin123    |
| Doctor  | doctor@hospital.com      | doctor123   |
| Patient | patient@hospital.com     | patient123  |

> Or use the **"Fill demo credentials"** button on the login page.

---

## 🧠 Data Structures Demonstrated

### 1. Priority Queue (EmergencyTriage / EmergencyQueue)
- Patients sorted by severity: `Critical → Serious → Stable`
- Implemented as a sorted array in `DataContext`
- Adding a patient re-sorts the queue automatically

### 2. Hash Table (Patients / Search)
- `patientHashTable` built as `{ [patient.id]: patient }` on every render
- O(1) lookup by Patient ID vs O(n) linear scan by name
- The Search page visually labels which algorithm is running

### 3. Stack — Undo Operations (Undo.js)
- Every `add`, `remove`, `update` pushes to `undoStack[]`
- Undo pops the top item and applies the inverse operation
- The Undo page visualizes the stack with TOP indicator

---

## 🎨 Design System

- **Theme:** Dark clinical / medical — navy blacks, sharp accent cyan
- **Font:** DM Sans + DM Mono
- **Colors:** CSS custom properties (`--accent`, `--red`, `--green`, `--amber`, `--teal`)
- **No external UI library** — pure CSS in `style.css`

---

## 📄 Pages Summary

| Page | Role | DS Concept |
|---|---|---|
| Login / Register | All | – |
| Admin Dashboard | Admin | – |
| Emergency Triage | Admin | Priority Queue (enqueue) |
| Emergency Queue | Admin | Priority Queue (view) |
| Manage Doctors | Admin | CRUD |
| All Patients | Admin | Hash Table search |
| Undo Operations | Admin | Stack |
| Doctor Dashboard | Doctor | – |
| Patient Queue | Doctor | Queue view |
| Treat Patient | Doctor | Dequeue |
| Patient Dashboard | Patient | – |
| Book Appointment | Patient | Enqueue |
| My Appointments | Patient | – |
| Reports | Optional | Analytics |
| Search | Optional | Hash Table demo |
