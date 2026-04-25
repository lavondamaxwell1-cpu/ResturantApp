import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/useCart";
import API_URL from "../api";
function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const { clearCart } = useCart();
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/orders/${id}`);
     setOrder(Array.isArray(res.data) ? res.data : []);

        if (res.data.paymentStatus === "paid") {
          clearCart();
        }
      } catch (err) {
        console.error("Fetch order error:", err);
      }
    };

    fetchOrder();
  }, [id, clearCart]);

  if (!order) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <p className="text-lg font-semibold">Loading your order...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✓
          </div>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight">
            Order placed
          </h1>

          <p className="mt-2 text-gray-600">
            We received your order and it’s now being prepared.
          </p>
        </div>

        <div className="mt-8 rounded-3xl bg-gray-50 p-5">
          <p className="text-sm font-semibold text-gray-500">Order ID</p>
          <p className="mt-1 break-all font-bold">{order._id}</p>

          <p className="mt-5 text-sm font-semibold text-gray-500">Status</p>
          <p className="mt-1 font-bold capitalize text-green-600">
            {order.status}
          </p>
        </div>

        <p className="mt-1 font-bold capitalize text-green-600">
          Payment: {order.paymentStatus}
        </p>
        <div className="mt-8">
          <h2 className="text-2xl font-extrabold">Order summary</h2>
          <p className="mt-5 text-sm font-semibold text-gray-500">Order Type</p>
          <p className="mt-1 font-bold capitalize text-green-600">
            {order.orderType}
          </p>

          <p className="mt-5 text-sm font-semibold text-gray-500">Payment</p>
          <p className="mt-1 font-bold capitalize text-green-600">
            {order.paymentStatus}
          </p>

          <p className="mt-5 text-sm font-semibold text-gray-500">
            Estimated Time
          </p>
          <p className="mt-1 font-bold">{order.estimatedTime}</p>
          <div className="mt-4 space-y-3">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between rounded-2xl bg-gray-50 p-4"
              >
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty {item.quantity}</p>
                </div>

                <p className="font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between border-t pt-5 text-2xl font-extrabold">
            <span>Total</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="rounded-full bg-black px-6 py-3 text-center font-bold text-white hover:bg-gray-800"
          >
            Back to menu
          </Link>

          <Link
            to="/my-orders"
            className="rounded-full bg-green-600 px-6 py-3 text-center font-bold text-white hover:bg-green-700"
          >
            View my orders
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrderSuccess;
