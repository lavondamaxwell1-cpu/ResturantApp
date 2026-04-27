require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");

const app = express();

//
// 🔹 CONNECT DB
//
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

//
// 🔹 CORS
//
//
// 🔹 CORS
//
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://resturant-app-dun.vercel.app",
  "https://resturant-dxqqgogh0-lavondamaxwell1-cpus-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

//
// 🔴 IMPORTANT: STRIPE WEBHOOK MUST BE FIRST
//
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

//
// 🔹 BODY PARSER (AFTER webhook)
//
app.use(express.json());

//
// 🔹 ROUTES
//
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

//
// 🔹 TEST ROUTE
//
app.get("/", (req, res) => {
  res.send("API running...");
});

//
// 🔹 SERVER
//
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
