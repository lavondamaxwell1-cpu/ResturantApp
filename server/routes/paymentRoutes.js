const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const Order = require("../models/Order");
const protect = require("../middleware/authMiddleware");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe checkout session
router.post("/create-checkout-session", protect, async (req, res) => {
  try {
    const { cart, customer, orderType, estimatedTime } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const order = await Order.create({
      user: req.user.id,
      items: cart.map((item) => ({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalAmount,
      customer,
      orderType,
      estimatedTime,
      paymentStatus: "pending",
    });

    const line_items = cart.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/order-success/${order._id}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ message: "Stripe error" });
  }
});

// Stripe webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error("Webhook signature failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const order = await Order.findById(session.metadata.orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.paymentStatus === "paid") {
        return res.json({ received: true });
      }

      order.paymentStatus = "paid";
      order.stripeSessionId = session.id;
      await order.save();
    }

      res.json({ received: true });
    } catch (err) {
      console.error("Webhook order update error:", err);
      res.status(500).json({ message: "Webhook error" });
    }
  },
);

module.exports = router;
