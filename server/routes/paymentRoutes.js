const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");

//
// 🔹 CREATE CHECKOUT SESSION
//
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { cart, customer, orderType, estimatedTime } = req.body;

    // Create order in DB (pending)
    const newOrder = new Order({
      items: cart,
      customer,
      orderType,
      estimatedTime,
      totalAmount: cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
      paymentStatus: "pending",
      status: "pending",
    });

    await newOrder.save();

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cart.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/order-success/${newOrder._id}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        orderId: newOrder._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//
// 🔹 STRIPE WEBHOOK
//
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
      console.error("Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ PAYMENT SUCCESS
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
console.log("WEBHOOK EVENT:", event.type);
      try {
        const order = await Order.findById(session.metadata.orderId);

        if (!order) {
          console.log("Order not found");
          return res.sendStatus(200);
        }

        // Update order
        order.paymentStatus = "paid";
        await order.save();

        // ✅ SEND EMAIL
        if (order.customer?.email) {
          await sendEmail({
            to: order.customer.email,
            subject: "Your order is confirmed!",
            html: `
              <div style="font-family:sans-serif">
                <h2 style="color:green;">Order Confirmed 🎉</h2>
                <p>Hi ${order.customer.name},</p>
                <p>Your order has been received and is being prepared.</p>
                <hr/>
                <p><strong>Type:</strong> ${order.orderType}</p>
                <p><strong>Estimated Time:</strong> ${order.estimatedTime}</p>
                <p><strong>Total:</strong> $${order.totalAmount.toFixed(2)}</p>
                <br/>
                <p>Thanks for ordering 🍔</p>
              </div>
            `,
          });
          console.log("ORDER ID:", session.metadata.orderId);
          console.log("EMAIL TO:", order.customer?.email);
        }

        console.log("Order updated + email sent");
      } catch (err) {
        console.error("Webhook processing error:", err);
      }
    }

    res.sendStatus(200);
  },
);

module.exports = router;
