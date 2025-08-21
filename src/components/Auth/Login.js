import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const user = await authApi.login(form.email, form.password);
      localStorage.setItem("user", JSON.stringify(user));
      setMsg("Login successful");
      navigate("/");
    } catch (err) {
      setMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ background: "linear-gradient(135deg, #e9e0ddff, #e9e0ddff)" }}
    >
      <div className="card p-4 shadow-lg" style={{ maxWidth: 400, width: "100%", borderRadius: "15px" }}>
        <h2 className="text-center mb-4" style={{ fontWeight: "700", color: "#4b3a74", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
          Welcome Back
        </h2>
        {msg && (
          <div className="alert alert-info text-center" role="alert" style={{ fontWeight: "600" }}>
            {msg}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-secondary fw-semibold">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label text-secondary fw-semibold">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="btn btn-gradient w-100 fw-bold text-white"
            style={{
              background: "linear-gradient(90deg, #3905d8ff, #3905d8ff)",
              borderRadius: "50px",
              padding: "10px",
              fontSize: "1.1rem",
              transition: "background 0.3s",
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-3 text-muted">
          No account?{" "}
          <Link to="/register" className="text-gradient fw-semibold" style={{ background: "linear-gradient(90deg, #f20505ff, #f0440bff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
