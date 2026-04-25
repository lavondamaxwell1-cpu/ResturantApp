import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
        setMenuItems(Array.isArray(res.data) ? res.data : []);
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
    <main className="bg-white">
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-3xl bg-gray-100 px-6 py-10 md:px-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
            Fresh food, fast
          </p>

          <h1 className="mt-2 max-w-2xl text-4xl font-extrabold tracking-tight text-gray-950 md:text-5xl">
            Order your favorite meals anytime.
          </h1>

          <p className="mt-3 max-w-xl text-gray-600">
            Browse the menu, add items to your cart, and checkout in minutes.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-950">Popular near you</h2>
          <p className="text-sm text-gray-500">{menuItems.length} items</p>
        </div>

        <div className="mt-5 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {menuItems.map((item) => (
            <div key={item._id} className="group">
              <Link to={`/menu/${item._id}`}>
                <div className="overflow-hidden rounded-2xl bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>

              <div className="mt-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-gray-950">{item.name}</h3>

                  <span className="rounded-full bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-800">
                    ${Number(item.price).toFixed(2)}
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  {item.category} • 15–25 min
                </p>

                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                  {item.description}
                </p>

                {!item.available && (
                  <p className="mt-2 text-sm font-semibold text-red-500">
                    Currently unavailable
                  </p>
                )}

                <button
                  onClick={() => {
                    addToCart(item);
                    toast.success(`${item.name} added to cart`);
                  }}
                  disabled={!item.available}
                  className="mt-4 w-full rounded-full bg-black px-4 py-2 text-sm font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Menu;
