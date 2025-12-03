// src/SignupPage.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

const API_BASE = "http://localhost:5000";
const ROLE_OPTIONS = ["Admin", "Analyst", "User"];

function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_BASE}/api/auth/signup`, {
        email,
        password,
        role: role.toLowerCase() // "admin" | "analyst" | "user"
      });

      console.log("Signup success:", res.data);

      // Redirect to login page after successful signup
      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Sign up failed. Please try again.";
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

        <h2 className="title">Create Account</h2>
        <p className="subtitle">Sign up for TariffIntel</p>

        <form className="form" onSubmit={handleSignup}>
          <label className="field">
            <span className="field-label">Email</span>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field-label">Role</span>
            <select
              className="select-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
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

          <label className="field">
            <span className="field-label">Confirm Password</span>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>

          {error && <div className="error">{error}</div>}

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <button
          type="button"
          className="signup-link"
          onClick={() => navigate("/login")}
        >
          Already have an account? <span>Sign In</span>
        </button>
      </div>
    </div>
  );
}

export default SignupPage;
