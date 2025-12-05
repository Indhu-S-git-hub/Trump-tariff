const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { sequelize } = require("./models");
const productRoutes = require("./Routes/productRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Trump Tariff API running" });
});

// ---------- PRODUCT ROUTES ONLY ----------
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
});

