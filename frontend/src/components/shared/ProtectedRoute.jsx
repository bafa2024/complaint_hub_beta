// src/components/shared/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function ProtectedRoute({ role }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading…</div>;

  // determine if this user fulfills the required role
  const ok =
    role === "admin" && user?.is_admin ||
    role === "brand" && user?.is_brand ||
    role === "user" && !user?.is_admin && !user?.is_brand;

  if (!ok) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
