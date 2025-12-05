// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import your existing pages
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import DashboardPage from "./DashboardPage";
import AdminDashboardPage from "./AdminDashboardPage";
import AgreementsManagementPage from "./pages/AgreementsManagementPage";

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Signup */}
      <Route path="/signup" element={<SignupPage />} />

      {/* Agreements Management */}
      <Route path="/agreements" element={<AgreementsManagementPage />} />

      {/* User Dashboard */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* Admin Dashboard */}
      <Route path="/admin-dashboard" element={<AdminDashboardPage />} />

      {/* Redirect any unknown routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
