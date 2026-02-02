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

  // Associations are restricted to organizer/admin views only
  if (!allowedRoles && user.role === "association") {
    return <Navigate to="/organizer/my-events" replace />;
  }

  // Logged in, check role-based access
  if (allowedRoles) {
    // Check against new roles array (Source of Truth) or primary role
    // Special: associations are automatically allowed to organizer and admin routes
    const isAssociation = user.role === "association";
    const hasRole =
      (isAssociation &&
        (allowedRoles.includes("organizer") ||
          allowedRoles.includes("admin"))) ||
      (user.roles && user.roles.some((r) => allowedRoles.includes(r))) ||
      allowedRoles.includes(user.role);

    if (!hasRole) {
      // Redirect to a sensible default based on their actual role
      if (
        user.role === "admin" ||
        (user.roles && user.roles.includes("admin"))
      ) {
        return <Navigate to="/admin" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
