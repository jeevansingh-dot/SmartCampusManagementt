import React from "react";
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// STUDENT
import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import LostFound from "./components/LostFound";
import Complaint from "./components/Complaint";
import AIAssistant from "./components/AIAssistant";

// ADMIN
import AdminDashboard from "./components/AdminDashboard";
import AdminComplaints from "./components/AdminComplaints";
import AdminLostFound from "./components/AdminLostFound";

function App() {
  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/"
        element={<Login />}
      />

      {/* STUDENT DASHBOARD */}
      <Route
        path="/student"
        element={<StudentDashboard />}
      />

      {/* STUDENT PAGES */}
      <Route
        path="/complaints"
        element={<Complaint />}
      />

      <Route
        path="/lostfound"
        element={<LostFound />}
      />

      <Route
        path="/ai"
        element={<AIAssistant />}
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/complaints"
        element={<AdminComplaints />}
      />

      <Route
        path="/admin/lostfound"
        element={<AdminLostFound />}
      />

      {/* INVALID URL */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;