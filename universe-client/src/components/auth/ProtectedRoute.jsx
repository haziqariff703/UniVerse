import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication and/or specific roles.
 * @param {object} props
 * @param {React.ReactNode} props.children - The component to render if authorized.
 * @param {string[]} [props.allowedRoles] - Optional array of roles allowed to access the route.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to a sensible default based on their actual role
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
