import React, { useState } from "react";
import axios from "axios";

export default function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // FastAPI login expects application/x-www-form-urlencoded
      const params = new URLSearchParams();
      params.append("username", form.email);
      params.append("password", form.password);

      const res = await axios.post("http://127.0.0.1:8000/api/v1/auth/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      localStorage.setItem("token", res.data.access_token);
      setMessage("Login successful!");
      if (onLogin) onLogin();
    } catch (err) {
      setMessage("Login failed: " + (err.response?.data?.detail || "Unknown error"));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required /><br />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required /><br />
      <button type="submit">Login</button>
      <div>{message}</div>
    </form>
  );
}
