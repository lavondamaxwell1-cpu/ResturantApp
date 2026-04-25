require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");
const mongoose = require("mongoose");
app.use(cors());
const paymentRoutes = require("./routes/paymentRoutes");
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");




app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

app.use("/api/payments", paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
console.log("MONGO URI:", process.env.MONGO_URI);
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
