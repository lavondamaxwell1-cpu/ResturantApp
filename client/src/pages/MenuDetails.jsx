import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/useCart";

function MenuDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const res = await axios.get(`http://localhost:5000/api/menu/${id}`);
      setItem(res.data);
    };

    fetchItem();
  }, [id]);

  if (!item) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }
  if (!item) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="h-[350px] animate-pulse rounded-3xl bg-gray-100" />

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">
          <div>
            <div className="h-8 w-2/3 animate-pulse rounded bg-gray-100" />
            <div className="mt-4 h-4 w-full animate-pulse rounded bg-gray-100" />
            <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-gray-100" />
          </div>

          <div className="h-40 animate-pulse rounded-3xl bg-gray-100" />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <Link
          to="/"
          className="text-sm font-medium text-gray-600 hover:underline"
        >
          ← Back
        </Link>
      </div>

      <div className="w-full">
        <img
          src={item.image}
          alt={item.name}
          className="h-[300px] w-full object-cover md:h-[400px]"
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium text-green-600">
              {item.category}
            </p>

            <h1 className="mt-1 text-3xl font-bold md:text-4xl">{item.name}</h1>

            <p className="mt-4 max-w-xl text-gray-600">{item.description}</p>

            <p
              className={`mt-3 text-sm font-semibold ${
                item.available ? "text-green-600" : "text-red-500"
              }`}
            >
              {item.available ? "Available now" : "Currently unavailable"}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm md:min-w-[250px]">
            <p className="text-2xl font-bold text-gray-900">
              ${item.price.toFixed(2)}
            </p>

            <button
              onClick={() => addToCart(item)}
              disabled={!item.available}
              className="mt-4 w-full rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MenuDetails;
