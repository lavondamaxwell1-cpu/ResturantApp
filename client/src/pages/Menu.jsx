import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/useCart";
import { toast } from "react-toastify";
import API_URL from "../api";
function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/menu`);
        setMenuItems(res.data);
      } catch (err) {
        console.error("Fetch menu error:", err);
        toast.error("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);
  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="h-56 animate-pulse rounded-3xl bg-gray-100" />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="animate-pulse">
              <div className="h-44 rounded-2xl bg-gray-100" />
              <div className="mt-3 h-4 w-3/4 rounded bg-gray-100" />
              <div className="mt-2 h-4 w-1/2 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-4xl font-extrabold">Menu</h1>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md"
          >
            {/* Image */}
            <div className="h-44 w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h2 className="text-lg font-bold">{item.name}</h2>
              <p className="mt-1 text-sm text-gray-500">{item.description}</p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-extrabold">
                  ${item.price.toFixed(2)}
                </span>

                <button
                  onClick={() => {
                    addToCart(item);
                    toast.success(`${item.name} added to cart`);
                  }}
                  className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Menu;
