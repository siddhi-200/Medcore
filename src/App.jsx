import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

import Login    from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard  from "./pages/Admin/Dashboard";
import EmergencyTriage from "./pages/Admin/EmergencyTriage";
import EmergencyQueue  from "./pages/Admin/EmergencyQueue";
import ManageDoctors   from "./pages/Admin/ManageDoctors";
import Patients        from "./pages/Admin/Patients";
import Undo            from "./pages/Admin/Undo";

import DoctorDashboard from "./pages/Doctor/Dashboard";
import DoctorQueue     from "./pages/Doctor/Queue";
import TreatPatient    from "./pages/Doctor/TreatPatient";

import PatientDashboard  from "./pages/Patient/Dashboard";
import BookAppointment   from "./pages/Patient/BookAppointment";
import MyAppointments    from "./pages/Patient/MyAppointments";

import Reports from "./pages/Reports";
import Search  from "./pages/Search";

import "./pages/style.css";

function AppRoutes() {
  const { user } = useAuth();
  const [path, setPath] = useState("/login");
  const navigate = (p) => setPath(p);

  if (!user) {
    if (path === "/register") return <Register onNavigate={navigate} onSwitchToLogin={() => navigate("/login")} />;
    return <Login onNavigate={navigate} onSwitchToRegister={() => navigate("/register")} />;
  }

  const routes = {
    "/admin":          <AdminDashboard  currentPath={path} onNavigate={navigate} />,
    "/admin/triage":   <EmergencyTriage currentPath={path} onNavigate={navigate} />,
    "/admin/queue":    <EmergencyQueue  currentPath={path} onNavigate={navigate} />,
    "/admin/doctors":  <ManageDoctors   currentPath={path} onNavigate={navigate} />,
    "/admin/patients": <Patients        currentPath={path} onNavigate={navigate} />,
    "/admin/undo":     <Undo            currentPath={path} onNavigate={navigate} />,
    "/doctor":         <DoctorDashboard currentPath={path} onNavigate={navigate} />,
    "/doctor/queue":   <DoctorQueue     currentPath={path} onNavigate={navigate} />,
    "/doctor/treat":   <TreatPatient    currentPath={path} onNavigate={navigate} />,
    "/patient":              <PatientDashboard currentPath={path} onNavigate={navigate} />,
    "/patient/book":         <BookAppointment  currentPath={path} onNavigate={navigate} />,
    "/patient/appointments": <MyAppointments   currentPath={path} onNavigate={navigate} />,
    "/reports": <Reports currentPath={path} onNavigate={navigate} />,
    "/search":  <Search  currentPath={path} onNavigate={navigate} />,
  };

  return routes[path] || routes[`/${user.role}`] || <div style={{ padding: 40, color: "var(--muted)" }}>404</div>;
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppRoutes />
      </DataProvider>
    </AuthProvider>
  );
}
