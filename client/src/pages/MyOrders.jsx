import { useEffect, useState } from "react";
import socket from "../socket";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";
import api from "../api";
import OrderProgress from "../components/OrderProgress";
function MyOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/orders/my-orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("My orders error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to load orders");
    }
  };

  if (token) {
    fetchOrders();
  }
}, [token]);
useEffect(() => {
  const handleOrderUpdated = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order,
      ),
    );
  };

  socket.on("orderUpdated", handleOrderUpdated);

  return () => {
    socket.off("orderUpdated", handleOrderUpdated);
  };
}, []);

  if (!token) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="mt-4 text-gray-600">Please login to view your orders.</p>

        <Link
          to="/login"
          className="mt-6 inline-block rounded-full bg-black px-6 py-3 font-bold text-white hover:bg-gray-800"
        >
          Login
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-4xl font-extrabold tracking-tight">My Orders</h1>
      <p className="mt-2 text-gray-600">View your past restaurant orders.</p>

      <div className="mt-8 space-y-6">
        {orders.length === 0 ? (
          <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">You have no orders yet.</p>

            <Link
              to="/"
              className="mt-5 inline-block rounded-full bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
            >
              Start Ordering
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="rounded-3xl border bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-extrabold">Order #{order._id}</h2>

                  <div className="mt-2 space-y-1 text-sm text-gray-500">
                    <p>
                      Status:{" "}
                      <span className="font-semibold capitalize text-orange-600">
                        {order.status}
                      </span>
                    </p>
                    <OrderProgress status={order.status} />
                    <p>
                      Type:{" "}
                      <span className="font-semibold capitalize text-green-600">
                        {order.orderType}
                      </span>
                    </p>

                    <p>
                      Payment:{" "}
                      <span className="font-semibold capitalize text-green-600">
                        {order.paymentStatus}
                      </span>
                    </p>

                    <p>
                      Estimated:{" "}
                      <span className="font-semibold">
                        {order.estimatedTime}
                      </span>
                    </p>
                  </div>
                </div>

                <p className="text-xl font-extrabold text-green-600">
                  ${Number(order.totalAmount).toFixed(2)}
                </p>
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
                      ${Number(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

export default MyOrders;
