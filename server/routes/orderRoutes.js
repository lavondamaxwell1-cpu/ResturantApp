const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const sendEmail = require("../utils/sendEmail");
// CREATE order
router.post("/", async (req, res) => {
  try {
   const { items, totalAmount, customer, orderType } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    if (!customer || !customer.name || !customer.address) {
      return res
        .status(400)
        .json({ message: "Customer name and address required" });
    }

  const order = await Order.create({
    user: req.user.id,
    items,
    totalAmount,
    customer,
    orderType,
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

// GET all orders
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your orders" });
  }
});

// UPDATE order status
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(400).json({ message: "Error updating order status" });
  }
});

router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" },
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

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
  }git 
});

// GET single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { items, totalAmount, customer } = req.body;

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      customer,
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

module.exports = router;
