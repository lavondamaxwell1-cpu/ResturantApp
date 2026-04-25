import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";
import API_URL from "../api";
function AdminMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { token } = useAuth();
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/menu`);
        setMenuItems(res.data);
      } catch (err) {
        console.error("Fetch menu error:", err);
        toast.error("Failed to load menu items");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this item?");
    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await axios.delete(`${API_URL}/api/menu/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMenuItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Menu item deleted");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete item");
    } finally {
      setDeletingId(null);
    }
  };
  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="h-10 w-56 animate-pulse rounded bg-gray-100" />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              className="h-80 animate-pulse rounded-3xl bg-gray-100"
            />
          ))}
        </div>
      </main>
    );
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Menu</h1>
          <p className="mt-1 text-gray-600">Manage restaurant menu items.</p>
        </div>
        <Link
          to="/admin/menu/new"
          className="rounded-full bg-green-600 px-6 py-3 text-center font-bold text-white hover:bg-green-700"
        >
          Add item
        </Link>

        <Link
          to="/admin/orders"
          className="rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
        >
          View Orders
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="overflow-hidden rounded-2xl border bg-white shadow-sm"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-44 w-full object-cover"
            />

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">{item.name}</h2>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>

                <span className="font-bold text-orange-600">
                  ${item.price.toFixed(2)}
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                {item.description}
              </p>

              <p
                className={`mt-3 text-sm font-semibold ${
                  item.available ? "text-green-600" : "text-red-500"
                }`}
              >
                {item.available ? "Available" : "Unavailable"}
              </p>

              <div className="mt-5 flex gap-3">
                <Link
                  to={`/menu/edit/${item._id}`}
                  className="flex-1 rounded-xl border px-4 py-2 text-center font-semibold hover:bg-gray-100"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {deletingId === item._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminMenu;
