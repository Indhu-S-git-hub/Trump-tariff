import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AgreementsManagementPage from "./pages/AgreementsManagementPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<LoginPage />} />

        {/* Agreements Page */}
        <Route path="/agreements" element={<AgreementsManagementPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
