import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AgreementsManagementPage from "./pages/AgreementsManagementPage";

import SignupPage from "./SignupPage";
import DashboardPage from "./DashboardPage";
import AdminDashboardPage from "./AdminDashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Signup Page */}
        <Route path="/signup" element={<SignupPage />} />

        {/* Agreements */}
        <Route path="/agreements" element={<AgreementsManagementPage />} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />

        {/* Redirect anything else to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
