// src/App.jsx
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "http://localhost:5000"; // your Express+Sequelize API

function App() {
  const [activeTab, setActiveTab] = useState("admin"); // "admin" | "user"
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
        asAdmin: activeTab === "admin",
      });

      const { token, user } = res.data;

      if (remember) {
        localStorage.setItem("authToken", token);
      } else {
        sessionStorage.setItem("authToken", token);
      }

      console.log("Logged in:", user);
      // TODO: navigate to your dashboard route with react-router
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Login failed. Please check your email and password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="logo-circle">
          <span className="logo-icon">📊</span>
        </div>
        <h2 className="title">Welcome to TariffIntel</h2>
        <p className="subtitle">Smart Intelligence for Global Tariffs</p>

        <div className="tabs">
          <button
            className={activeTab === "admin" ? "tab active" : "tab"}
            onClick={() => setActiveTab("admin")}
            type="button"
          >
            <span className="tab-icon">🏛️</span>
            Admin Login
          </button>
          <button
            className={activeTab === "user" ? "tab active" : "tab"}
            onClick={() => setActiveTab("user")}
            type="button"
          >
            <span className="tab-icon">👤</span>
            User Login
          </button>
        </div>

        <form className="form" onSubmit={handleLogin}>
          <label className="field">
            <span className="field-label">Username</span>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field-label">Email</span>
            <input
              type="email"
              placeholder="user@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <div className="form-row">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Save My Password?</span>
            </label>

            <button
              type="button"
              className="link-button"
              onClick={() => alert("Forgot password flow coming soon")}
            >
              Forgot Password?
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          className="signup-link"
          type="button"
          onClick={() => alert("Navigate to Sign Up page")}
        >
          Don't have an account? <span>Sign Up</span>
        </button>
      </div>
    </div>
  );
}

export default App;
