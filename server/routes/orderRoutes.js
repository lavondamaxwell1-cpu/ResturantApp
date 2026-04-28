const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const sendEmail = require("../utils/sendEmail");

//
// 🔹 CREATE ORDER (fallback / non-Stripe)
//
router.post("/", protect, async (req, res) => {
  try {
    const { items, totalAmount, customer, orderType, estimatedTime } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      customer,
      orderType,
      estimatedTime,
      paymentStatus: "pending",
      status: "pending",
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Error creating order" });
  }
});

//
// 🔹 GET ALL ORDERS (ADMIN)
//
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

//
// 🔹 GET MY ORDERS (CUSTOMER)
//
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    console.error("My orders error:", err);
    res.status(500).json({ message: "Error fetching your orders" });
  }
});

//
// 🔹 UPDATE ORDER STATUS (ADMIN)
//
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
     console.log("🔥 STATUS ROUTE HIT");
     console.log("ORDER ID:", req.params.id);
     console.log("NEW STATUS:", req.body.status);
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );
    console.log("UPDATED ORDER:", order);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔔 Send email when ready
    if (status === "ready" && order.customer?.email) {
      await sendEmail({
        to: order.customer.email,
        subject: "Your order is ready!",
        html: `
          <div style="font-family:sans-serif">
            <h2>Your order is ready 🎉</h2>
            <p>Hi ${order.customer.name},</p>
            <p>Your order is ready for pickup or delivery.</p>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <br/>
            <p>Thanks for ordering!</p>
          </div>
        `,
      });
    }

    res.json(order);
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Error updating order status" });
  }
});

//
// 🔹 GET SINGLE ORDER
//
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Fetch single order error:", err);
    res.status(500).json({ message: "Error fetching order" });
  }
});

module.exports = router;