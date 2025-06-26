// src/services/authService.js
import apiClient from "./apiClient";

export async function signup({ email, password }) {
  const res = await apiClient.post("/auth/signup", { email, password });
  return res.data;
}

export async function login({ email, password }) {
  const res = await apiClient.post("/auth/login", { email, password });
  // { access_token, token_type }
  return res.data;
}

export async function getCurrentUser(token) {
  const res = await apiClient.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export default { signup, login, getCurrentUser };
