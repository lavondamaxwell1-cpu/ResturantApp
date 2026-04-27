import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      toast.success("Login successful");

      // ✅ Go to orders page
      navigate("/my-orders");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-gray-600">Log in to order your favorites.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-2xl border bg-gray-50 px-5 py-4 outline-none focus:border-green-600 focus:bg-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-2xl border bg-gray-50 px-5 py-4 outline-none focus:border-green-600 focus:bg-white"
          />

          <button
            type="submit"
            className="w-full rounded-full bg-black px-6 py-4 font-bold text-white hover:bg-gray-800"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          New here?{" "}
          <Link
            to="/register"
            className="font-bold text-green-600 hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
