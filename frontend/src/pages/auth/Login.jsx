import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "vendor") navigate("/vendor/dashboard");
      else navigate("/customer/dashboard");
    } catch (err) {
      alert(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 py-6 sm:py-10 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block text-white">
          <h1 className="text-5xl font-extrabold leading-tight">
            Welcome to <br />
            Market<span className="text-blue-500">Hub</span>
          </h1>
          <p className="text-slate-300 mt-5 text-lg">
            Manage buying, selling, orders, and vendors from one powerful marketplace.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-10">
            <div className="bg-white/10 p-5 rounded-2xl text-center">🛡️<p className="mt-2 text-sm">Secure</p></div>
            <div className="bg-white/10 p-5 rounded-2xl text-center">🚚<p className="mt-2 text-sm">Delivery</p></div>
            <div className="bg-white/10 p-5 rounded-2xl text-center">🎧<p className="mt-2 text-sm">Support</p></div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-6">
            <Link to="/" className="text-3xl font-bold text-white">
              Market<span className="text-blue-500">Hub</span>
            </Link>
            <p className="text-slate-300 mt-2 text-sm sm:text-base">
              Multi-Vendor E-commerce Platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900">
              Welcome Back 👋
            </h2>
            <p className="text-center text-slate-500 mt-2 mb-6 sm:mb-8">
              Login to your account
            </p>

            <label className="font-semibold text-sm">Email Address</label>
            <input
              className="border rounded-xl p-3 w-full mb-5 mt-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <label className="font-semibold text-sm">Password</label>
            <input
              className="border rounded-xl p-3 w-full mb-6 mt-2 outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login →"}
            </button>

            <p className="text-center mt-6 text-slate-600 text-sm sm:text-base">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-blue-600 font-semibold">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;