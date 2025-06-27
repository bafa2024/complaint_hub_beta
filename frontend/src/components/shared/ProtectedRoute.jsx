// src/components/shared/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function ProtectedRoute({ role }) {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading…</div>;
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check role-based access
  let hasAccess = false;
  
  switch (role) {
    case "admin":
      hasAccess = user.is_admin === true;
      break;
    case "brand":
      hasAccess = user.is_brand === true;
      break;
    case "user":
      // Regular users are those who are not admin and not brand
      hasAccess = !user.is_admin && !user.is_brand;
      break;
    default:
      hasAccess = false;
  }

  if (!hasAccess) {
    // Redirect based on user type
    if (user.is_brand) {
      return <Navigate to="/brand/dashboard" replace />;
    } else if (user.is_admin) {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return <Outlet />;
}