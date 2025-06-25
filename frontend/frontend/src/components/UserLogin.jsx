import React, { useState } from "react";
import "./user-login.css"; // Adjust the path if you use /assets

export default function UserLogin({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append("username", form.email);
      params.append("password", form.password);

      const resp = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });
      if (resp.ok) {
        const data = await resp.json();
        localStorage.setItem("token", data.access_token);
        setMessage("Login successful!");
        if (onLogin) onLogin();
      } else {
        const err = await resp.json();
        setMessage(err.detail || "Login failed!");
      }
    } catch (err) {
      setMessage("Login failed: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <a href="/" className="back-link">
          <span>&larr;</span> Back to Home
        </a>
        <div className="auth-header">
          <h2>Login to ComplaintHub</h2>
          <p>Enter your email and password to access your account.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              className="form-control"
              type="email"
              id="email"
              name="email"
              autoComplete="username"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              className="form-control"
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%" }}>
            Login
          </button>
          {message && <div style={{ marginTop: 16, color: "#e74c3c" }}>{message}</div>}
        </form>
        <div style={{ marginTop: 24, textAlign: "center", fontSize: 14 }}>
          Don't have an account? <a href="/signup" style={{ color: "#3498db" }}>Sign Up</a>
        </div>
      </div>
    </div>
  );
}
