import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";
import api from "../api";

function Checkout() {
  const { cart } = useCart();
  const { token } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    orderType: "delivery",
    email: "",
  });

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login before checkout");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post("/api/payments/create-checkout-session", {
        cart,
        customer: form,
        orderType: form.orderType,
        estimatedTime:
          form.orderType === "pickup" ? "Ready in 15 minutes" : "30–45 minutes",
      });

      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Payment failed");
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-14">
        <h1 className="text-4xl font-extrabold">Checkout</h1>
        <p className="mt-3 text-gray-600">Your cart is empty.</p>

        <Link
          to="/"
          className="mt-8 inline-block rounded-full bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
        >
          Browse Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/cart" className="text-sm text-gray-600 hover:underline">
        ← Back to cart
      </Link>

      <h1 className="mt-6 text-4xl font-extrabold">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border bg-white p-6 shadow-sm"
        >
          <h2 className="text-2xl font-extrabold">Order details</h2>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Order type
            </label>

            <select
              name="orderType"
              value={form.orderType}
              onChange={handleChange}
              className="w-full rounded-2xl border bg-gray-50 px-5 py-4 outline-none focus:border-green-600 focus:bg-white"
            >
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>

          {form.orderType === "pickup" ? (
            <div className="mt-4 rounded-2xl bg-green-50 p-4 text-green-700">
              <p className="font-bold">Pickup instructions</p>
              <p className="text-sm">
                Your order will be ready in about 15 minutes.
              </p>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-gray-700">
              <p className="font-bold">Estimated delivery</p>
              <p className="text-sm">30–45 minutes</p>
            </div>
          )}

          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-5 w-full rounded-2xl border bg-gray-50 px-5 py-4 outline-none focus:border-green-600 focus:bg-white"
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-5 w-full rounded-2xl border bg-gray-50 px-5 py-4 outline-none focus:border-green-600 focus:bg-white"
          />

          {form.orderType === "delivery" && (
            <input
              name="address"
              placeholder="Delivery address"
              value={form.address}
              onChange={handleChange}
              required
              className="mt-5 w-full rounded-2xl border bg-gray-50 px-5 py-4 outline-none focus:border-green-600 focus:bg-white"
            />
          )}

          <input
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            className="mt-5 w-full rounded-2xl border bg-gray-50 px-5 py-4 outline-none focus:border-green-600 focus:bg-white"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 w-full rounded-full bg-green-600 px-6 py-4 font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isSubmitting ? "Redirecting to payment..." : "Continue to payment"}
          </button>
        </form>

        <aside className="h-fit rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold">Order summary</h2>

          <div className="mt-5 space-y-4 border-b pb-5">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-between text-xl font-extrabold">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;
