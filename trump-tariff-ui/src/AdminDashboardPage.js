// src/AdminDashboardPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

const API_BASE = "http://localhost:5000";

function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("authRole");
    navigate("/login");
  };

  // load admin summary stats
  useEffect(() => {
    const token =
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken");

    if (!token) {
      setError("Not authenticated");
      return;
    }

    axios
      .get(`${API_BASE}/api/admin/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setSummary(res.data))
      .catch((err) => {
        console.error("Admin summary load error:", err);
        setError("Failed to load admin stats");
      });
  }, []);

  if (error) {
    return <div className="page-center">Error: {error}</div>;
  }

  if (!summary) {
    return <div className="page-center">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-layout">
      {/* Admin sidebar (fixed, not scrolling) */}
      <aside className="sidebar admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo-circle">TI</div>
          <div className="sidebar-title">TariffIntel</div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">Admin Dashboard</button>
          <button className="nav-item">User Management</button>
          <button className="nav-item">Agreements Management</button>
          <button className="nav-item">Country Database</button>
          <button className="nav-item">Product Library</button>
          <button className="nav-item">Reports</button>
          <button className="nav-item">News Feed Manager</button>
          <button className="nav-item">System Activity</button>
          <button className="nav-item">Settings</button>
        </nav>

        <button className="nav-item logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main admin content (scrollable center) */}
      <main className="admin-main">
        {/* Top blue bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <h1>Administrator Dashboard</h1>
            <p>Manage users, content, and system settings for TariffIntel.</p>
          </div>
        </header>

        {/* KPI cards - FIXED */}
        <section className="admin-kpi-row">
          <div className="admin-kpi-card">
            <div className="admin-kpi-label">Total Users</div>
            <div className="admin-kpi-value">{summary.totalUsers || 0}</div>
            <div className="admin-kpi-sub">+42 this month</div>
          </div>
          <div className="admin-kpi-card">
            <div className="admin-kpi-label">Active Sessions</div>
            <div className="admin-kpi-value">{summary.activeSessions || 0}</div>
            <div className="admin-kpi-sub">+15 from yesterday</div>
          </div>
          <div className="admin-kpi-card">
            <div className="admin-kpi-label">Total Queries</div>
            <div className="admin-kpi-value">{summary.totalQueries || 0}</div>
            <div className="admin-kpi-sub">This week</div>
          </div>
          <div className="admin-kpi-card">
            <div className="admin-kpi-label">System Health</div>
            <div className="admin-kpi-value">
              {(summary.systemHealth || 0).toFixed(1)}%
            </div>
            <div className="admin-kpi-sub">All systems operational</div>
          </div>
        </section>

        {/* Admin functions */}
        <section>
          <div className="admin-section-header">
            <h2>Admin Functions</h2>
          </div>

          <div className="admin-functions-grid">
            {/* Example: User Management */}
            <div className="admin-function-card">
              <div className="admin-func-icon user">
                <span>👥</span>
              </div>
              <div className="admin-func-content">
                <h3>User Management</h3>
                <p>Manage user accounts, roles, and permissions.</p>
                <span className="admin-function-meta">
                  {summary.totalUsers || 0} users
                </span>
              </div>
            </div>

            {/* Agreements Management */}
            <div className="admin-function-card">
              <div className="admin-func-icon agreements">
                <span>📄</span>
              </div>
              <div className="admin-func-content">
                <h3>Agreements Management</h3>
                <p>Update trade agreements and policy changes.</p>
                <span className="admin-function-meta">43 agreements</span>
              </div>
            </div>

            {/* Country Database */}
            <div className="admin-function-card">
              <div className="admin-func-icon country">
                <span>🌍</span>
              </div>
              <div className="admin-func-content">
                <h3>Country Database</h3>
                <p>Manage country tariff rates and regulations.</p>
                <span className="admin-function-meta">119 countries</span>
              </div>
            </div>

            {/* Product Library */}
            <div className="admin-function-card">
              <div className="admin-func-icon product">
                <span>📦</span>
              </div>
              <div className="admin-func-content">
                <h3>Product Library</h3>
                <p>Maintain HS codes and product categories.</p>
                <span className="admin-function-meta">8,471 products</span>
              </div>
            </div>

            {/* Reports */}
            <div className="admin-function-card">
              <div className="admin-func-icon reports">
                <span>📊</span>
              </div>
              <div className="admin-func-content">
                <h3>Reports</h3>
                <p>Generate system reports and analytics.</p>
                <span className="admin-function-meta">214 reports</span>
              </div>
            </div>

            {/* News Feed */}
            <div className="admin-function-card">
              <div className="admin-func-icon news">
                <span>📰</span>
              </div>
              <div className="admin-func-content">
                <h3>News Feed Manager</h3>
                <p>Manage news articles and updates.</p>
                <span className="admin-function-meta">176 articles</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboardPage;
