import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function MyOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("${API_URL}/api/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data);
      } catch (err) {
        console.error("My orders error:", err);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  if (!token) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="mt-4 text-gray-600">Please login to view your orders.</p>

        <Link
          to="/login"
          className="mt-6 inline-block rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold">My Orders</h1>
      <p className="mt-1 text-gray-600">View your past restaurant orders.</p>

      <div className="mt-8 space-y-6">
        {orders.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">You have no orders yet.</p>

            <Link
              to="/"
              className="mt-5 inline-block rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
            >
              Start Ordering
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold">Order #{order._id}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Status:{" "}
                    <span className="font-semibold text-orange-600 capitalize">
                      {order.status}
                    </span>
                    <p className="mt-1 text-sm text-gray-500">
                      Type:{" "}
                      <span className="font-semibold capitalize text-green-600">
                        {order.orderType}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Payment:{" "}
                      <span className="font-semibold capitalize text-green-600">
                        {order.paymentStatus}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Time:{" "}
                      <span className="font-semibold">
                        {order.estimatedTime}
                      </span>
                    </p>
                  </p>
                </div>

                <p className="text-xl font-bold text-orange-600">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl bg-gray-50 p-3"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyOrders;
