// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import DashboardPage from "./DashboardPage";        // user dashboard
import AdminDashboardPage from "./AdminDashboardPage"; // admin dashboard

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* user dashboard route */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* admin dashboard route */}
      <Route path="/admin-dashboard" element={<AdminDashboardPage />} />

      {/* redirect / and anything else to /login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
