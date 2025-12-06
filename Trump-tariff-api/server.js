// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

dotenv.config();

const { sequelize, User, ForexHistory } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key";
const FRANKFURTER_BASE = "https://api.frankfurter.app"; // free FX API base URL

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Trump Tariff API running" });
});

/* ================= AUTH ================= */

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const finalRole = (role || "user").toLowerCase();

    const user = await User.create({
      username: username || email.split("@")[0],
      email,
      password: hashed,
      role: finalRole,
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, asAdmin } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (asAdmin && user.role !== "admin") {
      return res.status(403).json({ message: "Not an admin account" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

/* =============== AUTH MIDDLEWARE =============== */

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.user = payload;
    next();
  });
}

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "Protected data", user: req.user });
});

/* =============== DASHBOARD DATA =============== */

app.get("/api/dashboard", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "username", "email", "role"],
    });

    const quickActions = [
      { id: 1, title: "Industry Explorer" },
      { id: 2, title: "Tariff Impact Analysis" },
      { id: 3, title: "Cost Calculator" },
      { id: 4, title: "Forex Analysis" },
    ];

    const recentAnalyses = [
      {
        id: 1,
        title: "Electronics Import Analysis - China to USA",
        status: "Completed",
        time: "2 hours ago",
      },
      {
        id: 2,
        title: "Automotive Parts Tariff Impact",
        status: "Completed",
        time: "1 day ago",
      },
      {
        id: 3,
        title: "Textile Trade Comparison 2024",
        status: "Completed",
        time: "3 days ago",
      },
    ];

    const keyInsights = [
      {
        id: 1,
        label: "Average tariff increase on Chinese imports",
        value: "18.7%",
      },
      {
        id: 2,
        label: "Trade agreements active",
        value: "38 countries",
      },
      {
        id: 3,
        label: "High-impact industries",
        value: "Electronics, Automotive, Steel",
      },
    ];

    res.json({
      user,
      quickActions,
      recentAnalyses,
      keyInsights,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
});

/* =============== ADMIN SUMMARY =============== */

app.get("/api/admin/summary", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const totalUsers = await User.count();

    const recentUsers = await User.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
      attributes: ["id", "username", "email", "role", "createdAt"],
    });

    const activeSessions = 178;
    const totalQueries = 45892;
    const systemHealth = 98.2;

    res.json({
      totalUsers,
      activeSessions,
      totalQueries,
      systemHealth,
      recentUsers,
    });
  } catch (err) {
    console.error("Admin summary error:", err);
    res.status(500).json({ message: "Failed to load admin summary" });
  }
});




app.get("/api/forex/currencies", async (req, res) => {
  try {
    const resp = await axios.get(`${FRANKFURTER_BASE}/currencies`);
    res.json({ currencies: resp.data || {} });
  } catch (err) {
    console.error("Currencies error:", err.message);
    res.status(500).json({ message: "Failed to load currencies" });
  }
});


app.get("/api/forex/latest", async (req, res) => {
  try {
    const from = req.query.from || "USD";
    const to = req.query.to || "EUR";
    const amount = Number(req.query.amount || 1);

    const url = `${FRANKFURTER_BASE}/latest?base=${from}&symbols=${to}`;
    const resp = await axios.get(url);

    if (!resp.data || !resp.data.rates || resp.data.rates[to] == null) {
      return res
        .status(502)
        .json({ message: "Rate not available for this pair" });
    }

    const rate = resp.data.rates[to];
    const date = resp.data.date;
    const convertedAmount = amount * rate;

    res.json({
      from,
      to,
      amount,
      rate,
      convertedAmount,
      date,
    });
  } catch (err) {
    console.error("Latest FX error:", err.message);
    res.status(500).json({ message: "Failed to load latest rate" });
  }
});

// Historical yearly series with volatility (fetches from Frankfurter + saves to DB)
// GET /api/forex/history?from=USD&to=INR&year=2024
app.get("/api/forex/history", async (req, res) => {
  try {
    const from = req.query.from || "USD";
    const to = req.query.to || "EUR";
    const year = req.query.year || "2024";

    const start = `${year}-01-01`;
    const end = `${year}-12-31`;

    const url = `${FRANKFURTER_BASE}/${start}..${end}?from=${from}&to=${to}`;
    const resp = await axios.get(url);

    const ratesByDate = resp.data && resp.data.rates ? resp.data.rates : {};

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const history = months.map((m) => {
      const monthStr = m.toString().padStart(2, "0");
      const monthRates = [];

      Object.entries(ratesByDate).forEach(([date, obj]) => {
        if (date.slice(5, 7) === monthStr && obj[to] !== undefined) {
          monthRates.push(obj[to]);
        }
      });

      const avg =
        monthRates.length > 0
          ? monthRates.reduce((a, b) => a + b, 0) / monthRates.length
          : null;

      return { month: monthNames[m - 1], rate: avg };
    });

    const validRates = history
      .filter((h) => h.rate !== null)
      .map((h) => h.rate);

    let volatilityPercent = 0;
    let volatilityLabel = "No data";

    if (validRates.length > 1) {
      const mean =
        validRates.reduce((a, b) => a + b, 0) / validRates.length;
      const variance =
        validRates.reduce((sum, r) => sum + (r - mean) * (r - mean), 0) /
        (validRates.length - 1);
      const stdDev = Math.sqrt(variance);
      volatilityPercent = (stdDev / mean) * 100;

      if (volatilityPercent < 2) volatilityLabel = "Low volatility – Stable";
      else if (volatilityPercent < 5) volatilityLabel = "Medium volatility";
      else volatilityLabel = "High volatility";
    }

    // Save monthly history to DB (upsert)
    if (ForexHistory) {
      await Promise.all(
        history
          .filter((h) => h.rate !== null)
          .map((h) =>
            ForexHistory.upsert({
              from,
              to,
              year: Number(year),
              month: h.month,
              rate: h.rate,
            })
          )
      );
    }

    res.json({
      from,
      to,
      year,
      history,
      volatilityPercent: Number(volatilityPercent.toFixed(2)),
      volatilityLabel,
    });
  } catch (err) {
    console.error("History FX error:", err.message);
    res.status(500).json({ message: "Failed to load history" });
  }
});

// Get saved history from DB (cached data)
// GET /api/forex/history/saved?from=USD&to=INR&year=2024
app.get("/api/forex/history/saved", async (req, res) => {
  try {
    const from = req.query.from || "USD";
    const to = req.query.to || "EUR";
    const year = Number(req.query.year || "2024");

    const rows = await ForexHistory.findAll({
      where: { from, to, year },
      order: [["id", "ASC"]],
      raw: true,
    });

    if (rows.length === 0) {
      return res.json({
        from,
        to,
        year,
        history: [],
        message: "No saved history for this pair and year",
      });
    }

    const history = rows.map((row) => ({
      month: row.month,
      rate: row.rate,
    }));

    // Calculate volatility for saved data
    const validRates = history.map((h) => h.rate);
    let volatilityPercent = 0;
    let volatilityLabel = "No data";

    if (validRates.length > 1) {
      const mean =
        validRates.reduce((a, b) => a + b, 0) / validRates.length;
      const variance =
        validRates.reduce((sum, r) => sum + (r - mean) * (r - mean), 0) /
        (validRates.length - 1);
      const stdDev = Math.sqrt(variance);
      volatilityPercent = (stdDev / mean) * 100;

      if (volatilityPercent < 2) volatilityLabel = "Low volatility – Stable";
      else if (volatilityPercent < 5) volatilityLabel = "Medium volatility";
      else volatilityLabel = "High volatility";
    }

    res.json({
      from,
      to,
      year,
      history,
      volatilityPercent: Number(volatilityPercent.toFixed(2)),
      volatilityLabel,
      source: "database",
    });
  } catch (err) {
    console.error("Saved history error:", err.message);
    res.status(500).json({ message: "Failed to load saved history" });
  }
});

/* =============== START SERVER =============== */

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
});
