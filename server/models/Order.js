const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    items: [
      {
        menuItemId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    orderType: {
      type: String,
      enum: ["delivery", "pickup"],
      default: "delivery",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    estimatedTime: String,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    stripeSessionId: String,
    customer: {
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        default: "",
      },
      phone: String,
      email: String,
    },

    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
