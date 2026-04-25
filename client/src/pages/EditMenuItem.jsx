import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";
import API_URL from "../api";
function EditMenuItem() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    available: true,
  });

  useEffect(() => {
    const fetchItem = async () => {
      const res = await axios.get(`${API_URL}/api/menu/${id}`);
      const item = res.data;

      setForm({
        name: item.name || "",
        description: item.description || "",
        price: item.price || "",
        category: item.category || "",
        image: item.image || "",
        available: item.available ?? true,
      });
    };

    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await axios.put(
        `${API_URL}/api/menu/${id}`,
        {
          ...form,
          price: Number(form.price),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Item updated");
      navigate("/admin");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update item");
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
          Edit menu item
        </h1>
        <p className="mt-2 text-gray-600">
          Update item details, pricing, availability, or image path.
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
              alt={form.name}
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
            className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-4 font-bold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Updating...
              </>
            ) : (
              "Update item"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

export default EditMenuItem;
