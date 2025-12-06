// src/ForexAnalysisPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE = "http://localhost:5000";

function ForexAnalysisPage() {
  const [currencies, setCurrencies] = useState({});
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState(1000);
  const [year, setYear] = useState(2024);

  const [rate, setRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [date, setDate] = useState(null);

  const [history, setHistory] = useState([]);
  const [volatilityPercent, setVolatilityPercent] = useState(null);
  const [volatilityLabel, setVolatilityLabel] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ------------------------
  // LOAD CURRENCY LIST
  // ------------------------
  useEffect(() => {
    async function loadCurrencies() {
      try {
        const res = await axios.get(`${API_BASE}/api/forex/currencies`);
        setCurrencies(res.data.currencies || {});
      } catch (err) {
        console.error(err);
        setError("Failed to load currencies");
      }
    }
    loadCurrencies();
  }, []);

  // ------------------------
  // ANALYZE FOREX
  // ------------------------
  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError("");

      const latestPromise = axios.get(`${API_BASE}/api/forex/latest`, {
        params: { from, to, amount },
      });

      const historyPromise = axios.get(`${API_BASE}/api/forex/history`, {
        params: { from, to, year },
      });

      const [latestRes, historyRes] = await Promise.all([
        latestPromise,
        historyPromise,
      ]);

      // Latest data
      const latest = latestRes.data;
      setRate(latest.rate);
      setConvertedAmount(latest.convertedAmount);
      setDate(latest.date);

      // History data
      const hist = historyRes.data || {};
      const histArray = Array.isArray(hist.history) ? hist.history : [];

      setHistory(
        histArray.map((h) => ({
          name: h.month,
          rate: h.rate,
        }))
      );

      setVolatilityPercent(
        typeof hist.volatilityPercent === "number"
          ? hist.volatilityPercent
          : null
      );
      setVolatilityLabel(hist.volatilityLabel || "");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch forex data");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // DROPDOWN OPTIONS
  // ------------------------
  const currencyOptions = Object.entries(currencies).map(([code, name]) => (
    <option key={code} value={code}>
      {code} – {name}
    </option>
  ));

  // ------------------------
  // REQUIRED FIXED FUNCTIONS
  // ------------------------
  const goToForexAnalysis = () => {
    // Optional: You can use React Router here
    window.location.href = "/forex";
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="forex-layout">
      {/* ---------------- SIDEBAR ---------------- */}
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

          <button className="nav-item" onClick={goToForexAnalysis}>
            Forex Analysis
          </button>

          <button className="nav-item">Cost Calculator</button>
          <button className="nav-item">Data Manager</button>
          <button className="nav-item">News</button>
          <button className="nav-item">Settings</button>
        </nav>

        <button className="nav-item logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/*Forex main*/}
      <main className="forex-main">
        <header className="forex-topbar">
          <h1>Forex Analysis</h1>
          
        </header>

        {/* Filters */}
        <section className="forex-filters-card">
          <h2 className="forex-filters-title">
            Currency Converter &amp; Analysis
          </h2>

          <div className="forex-filters-grid">
            <div className="filter-field">
              <label>Base Currency</label>
              <select value={from} onChange={(e) => setFrom(e.target.value)}>
                {currencyOptions}
              </select>
            </div>

            <div className="filter-field">
              <label>Target Currency</label>
              <select value={to} onChange={(e) => setTo(e.target.value)}>
                {currencyOptions}
              </select>
            </div>

            <div className="filter-field">
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="filter-field">
              <label>Year</label>
              <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {Array.from({ length: 10 }, (_, i) => 2016 + i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-actions">
              <button onClick={handleAnalyze} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze"}
              </button>
            </div>
          </div>
        </section>

        {/* Error banner */}
        {error && <div className="error-banner">{error}</div>}

        {/* Summary */}
        <section className="forex-summary-strip">
          <div className="forex-card forex-card-rate">
            <h3>Current Exchange Rate</h3>
            {rate != null ? (
              <>
                <p className="forex-main-value">
                  1 {from} = {rate.toFixed(2)} {to}
                </p>
                {date && <p className="forex-subtext">Last updated: {date}</p>}
              </>
            ) : (
              <p className="forex-placeholder">Run an analysis to see rate</p>
            )}
          </div>

          <div className="forex-card forex-card-amount">
            <h3>Converted Amount</h3>
            {convertedAmount != null ? (
              <>
                <p className="forex-main-value">
                  {convertedAmount.toFixed(2)} {to}
                </p>
                <p className="forex-subtext">
                  From {amount} {from}
                </p>
              </>
            ) : (
              <p className="forex-placeholder">Run an analysis to convert</p>
            )}
          </div>

          <div className="forex-card forex-card-vol">
            <h3>Volatility Index</h3>
            {volatilityPercent != null ? (
              <>
                <p className="forex-main-value">
                  {volatilityPercent.toFixed(1)}%
                </p>
                <p className="forex-subtext">{volatilityLabel}</p>
              </>
            ) : (
              <p className="forex-placeholder">Run an analysis to see volatility</p>
            )}
          </div>
        </section>

        {/* Chart */}
        <section className="forex-chart-card">
          <h2>Historical Exchange Rate Trend ({year})</h2>
          <div className="forex-chart-wrapper" style={{ height: "350px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#2563eb" dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ForexAnalysisPage;
