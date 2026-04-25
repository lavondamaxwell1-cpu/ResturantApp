import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";
function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form,
      );
      login(res.data.user, res.data.token);
      toast.success("Account created successfully");
      navigate("/");
    } catch (err) {
     toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Create account
        </h1>
        <p className="mt-2 text-gray-600">Sign up and start ordering.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border bg-gray-50 px-5 py-4 outline-none focus:border-green-600 focus:bg-white"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border bg-gray-50 px-5 py-4 outline-none focus:border-green-600 focus:bg-white"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border bg-gray-50 px-5 py-4 outline-none focus:border-green-600 focus:bg-white"
          />

          <button
            type="submit"
            className="w-full rounded-full bg-green-600 px-6 py-4 font-bold text-white hover:bg-green-700"
          >
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-green-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
