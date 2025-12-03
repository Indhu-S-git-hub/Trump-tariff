import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      {/* redirect / and anything else to /login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
