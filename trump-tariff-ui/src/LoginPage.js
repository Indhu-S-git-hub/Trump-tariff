// src/LoginPage.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

const API_BASE = "http://localhost:5000";

function LoginPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("admin"); // "admin" | "user"
  const [username, setUsername] = useState("");        // company name or username (UI only)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError(null);
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
        asAdmin: activeTab === "admin"
      });

      const { token, user } = res.data;

      if (remember) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("authRole", user.role);
      } else {
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("authRole", user.role);
      }

      console.log("Logged in:", user);
      console.log("activeTab =", activeTab);

      if (activeTab === "user") {
        // user tab → user dashboard
        console.log("Navigating to /dashboard");
        navigate("/dashboard");
      } else if (activeTab === "admin" && user.role === "admin") {
        // admin tab + admin role → admin dashboard
        console.log("Navigating to /admin-dashboard");
        navigate("/admin-dashboard");
      } else {
        // tab/role mismatch
        setError("This account role does not match the selected login tab.");
      }
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
            type="button"
            onClick={() => switchTab("admin")}
          >
            <span className="tab-icon">🏛️</span>
            Admin Login
          </button>
          <button
            className={activeTab === "user" ? "tab active" : "tab"}
            type="button"
            onClick={() => switchTab("user")}
          >
            <span className="tab-icon">👤</span>
            User Login
          </button>
        </div>

        <form className="form" onSubmit={handleLogin}>
          {activeTab === "admin" ? (
            <>
              {/* Admin fields: company name + admin email */}
              <label className="field">
                <span className="field-label">Company Name</span>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>

              <label className="field">
                <span className="field-label">Admin Email</span>
                <input
                  type="email"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </>
          ) : (
            <>
              {/* User fields: username + user email */}
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
            </>
          )}

          {/* Password is common */}
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
          onClick={() => navigate("/signup")}
        >
          Don't have an account? <span>Sign Up</span>
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
