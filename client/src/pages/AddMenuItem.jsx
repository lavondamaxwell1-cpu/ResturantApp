import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";

function AddMenuItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    available: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await api.post("/api/menu", {
        ...form,
        price: Number(form.price),
      });

      toast.success("Item added");
      navigate("/admin");
    } catch (err) {
      console.error("Add item error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to add item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/admin" className="font-semibold text-gray-600 hover:underline">
        ← Back to admin
      </Link>

      <div className="mt-6 rounded-3xl border bg-white p-8 shadow-sm">
        <p className="font-bold text-green-600">Admin</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight">
          Add menu item
        </h1>
        <p className="mt-2 text-gray-600">
          Create a new food item for your restaurant menu.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            name="name"
            placeholder="Item name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border bg-gray-50 px-5 py-4 outline-none focus:border-green-600 focus:bg-white"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full rounded-2xl border bg-gray-50 px-5 py-4 outline-none focus:border-green-600 focus:bg-white"
          />

          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border bg-gray-50 px-5 py-4 outline-none focus:border-green-600 focus:bg-white"
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-2xl border bg-gray-50 px-5 py-4 outline-none focus:border-green-600 focus:bg-white"
          />

          <input
            name="image"
            placeholder="/images/burger.jpg"
            value={form.image}
            onChange={handleChange}
            className="w-full rounded-2xl border bg-gray-50 px-5 py-4 outline-none focus:border-green-600 focus:bg-white"
          />

          {form.image && (
            <img
              src={form.image}
              alt={form.name || "Preview"}
              className="h-56 w-full rounded-3xl object-cover"
            />
          )}

          <label className="flex items-center gap-3 rounded-2xl bg-gray-50 px-5 py-4 font-semibold">
            <input
              name="available"
              type="checkbox"
              checked={form.available}
              onChange={handleChange}
              className="h-5 w-5 accent-green-600"
            />
            Available
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-black px-6 py-4 font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isSubmitting ? "Adding..." : "Add item"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default AddMenuItem;