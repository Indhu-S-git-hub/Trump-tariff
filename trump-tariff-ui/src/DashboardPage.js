// src/DashboardPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

import calculatorIcon from "./assets/calculator.png";

const API_BASE = "http://localhost:5000";

function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Only allow role=user
  useEffect(() => {
    const role =
      localStorage.getItem("authRole") ||
      sessionStorage.getItem("authRole");

    if (!role || role !== "user") {
      navigate("/login");
    }
  }, [navigate]);

  // Load dashboard data
  useEffect(() => {
    const token =
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken");

    if (!token) {
      setError("Not authenticated");
      return;
    }

    axios
      .get(`${API_BASE}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Dashboard load error:", err);
        setError("Failed to load dashboard.");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("authRole");
    navigate("/login");
  };

  if (error) {
    return <div className="page-center">Error: {error}</div>;
  }

  if (!data) {
    return <div className="page-center">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo-circle">TI</div>
          <div className="sidebar-title">TariffIntel</div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">Dashboard</button>
          <button className="nav-item">Industry Explorer</button>
          <button className="nav-item">Tariff Impact Analysis</button>
          <button className="nav-item">Taxation Module</button>
          <button className="nav-item">Trade Comparison</button>
          <button className="nav-item">Forex Analysis</button>
          <button className="nav-item">Cost Calculator</button>
          <button className="nav-item">Data Manager</button>
          <button className="nav-item">News</button>
          <button className="nav-item">Settings</button>
        </nav>

        <button className="nav-item logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        {/* Top bar */}
        <header className="dashboard-topbar">
          <div className="topbar-title">
            <h1>Trump Tariff Impact Analysis</h1>
            <p>
              Welcome,{" "}
              <strong>{data.user?.username || data.user?.email || "User"}</strong>
            </p>
          </div>
          <div className="topbar-actions">
            <button className="topbar-pill">Ask AI</button>
          </div>
        </header>

        {/* Welcome banner */}
        <section className="welcome-banner">
          <h2>Welcome to TariffIntel</h2>
          <p>
            Comprehensive analysis tools for understanding global tariff impacts
            and trade dynamics.
          </p>
        </section>

        {/* Quick actions */}
        <section className="quick-actions">
          {(data.quickActions || []).map((qa) => (
            <div key={qa?.id || Math.random()} className="quick-card">
              <div className="quick-icon">
                {qa?.id === 3 ? (
                  <img
                    src={calculatorIcon}
                    alt="Cost Calculator"
                    className="quick-icon-img"
                  />
                ) : qa?.id === 1 ? (
                  "🌐"
                ) : qa?.id === 2 ? (
                  "📈"
                ) : (
                  "🔄"
                )}
              </div>
              <div className="quick-text">
                <h3>{qa?.title || "Quick Action"}</h3>
                <p>
                  {qa?.id === 1 && "Analyze trade volumes and agreements by industry."}
                  {qa?.id === 2 && "Compare tariff impacts across different periods."}
                  {qa?.id === 3 && "Calculate landed costs with all fees included."}
                  {qa?.id === 4 && "Track currency trends and volatility."}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Bottom grid */}
        <section className="dashboard-grid">
          <div className="panel recent-panel">
            <div className="panel-header">
              <h3>Recent Analyses</h3>
              <button className="link-button">View All</button>
            </div>
            <ul className="recent-list">
              {(data.recentAnalyses || []).map((item, index) => (
                <li key={item?.id || index} className="recent-item">
                  <div className="recent-main">
                    <div className="recent-title">{item?.title || "Analysis"}</div>
                    <div className="recent-time">{item?.time || "Just now"}</div>
                  </div>
                  <span className="status-pill">{item?.status || "Pending"}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel insights-panel">
            <div className="panel-header">
              <h3>Key Insights</h3>
            </div>
            <ul className="insights-list">
              {(data.keyInsights || []).map((k, index) => (
                <li key={k?.id || index} className="insight-row">
                  <span className="insight-label">{k?.label || "Insight"}</span>
                  <span className="insight-value">{k?.value || "N/A"}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
