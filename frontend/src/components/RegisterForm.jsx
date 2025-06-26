import React, { useState } from "react";
import axios from "axios";

export default function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/v1/auth/register", form);
      setMessage("Registration successful! Please log in.");
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage("Registration failed: " + (err.response?.data?.detail || "Unknown error"));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required /><br />
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required /><br />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required /><br />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required /><br />
      <button type="submit">Register</button>
      <div>{message}</div>
    </form>
  );
}
