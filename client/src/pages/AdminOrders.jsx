import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";

import api from "../api";
function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
     const res = await api.get("/api/orders");

        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch orders error:", err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

 const handleStatusChange = async (orderId, newStatus) => {
   try {
     console.log("🚀 Sending update:", orderId, newStatus);

     const res = await api.put(`/api/orders/${orderId}/status`, {
       status: newStatus,
     });

     console.log("✅ Response from backend:", res.data);

     setOrders((prev) =>
       prev.map((order) => (order._id === orderId ? res.data : order)),
     );

     toast.success("Order status updated");
   } catch (err) {
     console.error("❌ Update error:", err.response?.data || err.message);
     toast.error("Failed to update order status");
   }
 };
  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="h-10 w-48 animate-pulse rounded bg-gray-100" />

        <div className="mt-8 space-y-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-48 animate-pulse rounded-3xl bg-gray-100"
            />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/admin" className="font-semibold text-gray-600 hover:underline">
        ← Back to admin
      </Link>

      <div className="mt-6">
        <p className="font-bold text-green-600">Admin</p>
        <h1 className="text-4xl font-extrabold tracking-tight">Orders</h1>
        <p className="mt-2 text-gray-600">Manage incoming customer orders.</p>
      </div>

      <div className="mt-8 space-y-5">
        {orders.length === 0 ? (
          <div className="rounded-3xl border bg-white p-8 text-center">
            <p className="text-gray-600">No orders yet.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="rounded-3xl border bg-white p-6">
              <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:justify-between">
                <div>
                  <h2 className="font-extrabold">Order #{order._id}</h2>

                  <div className="mt-2 space-y-1 text-sm text-gray-500">
                    <p>
                      {order.customer?.name} •{" "}
                      {order.customer?.phone || "No phone"}
                    </p>

                    {order.orderType === "delivery" && (
                      <p>{order.customer?.address}</p>
                    )}

                    <p className="capitalize">Type: {order.orderType}</p>
                    <p className="capitalize">Payment: {order.paymentStatus}</p>
                    <p>Estimated: {order.estimatedTime}</p>
                  </div>
                </div>

                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className="h-fit rounded-full border bg-gray-50 px-4 py-2 font-bold outline-none focus:border-green-600"
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="mt-5 space-y-3">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between rounded-2xl bg-gray-50 p-4"
                  >
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty {item.quantity}
                      </p>
                    </div>

                    <p className="font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-between border-t pt-5 text-xl font-extrabold">
                <span>Total</span>
                <span>${Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

export default AdminOrders;
