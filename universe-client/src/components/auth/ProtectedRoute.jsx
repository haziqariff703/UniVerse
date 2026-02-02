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

  // Logged in, check role-based access
  if (allowedRoles) {
    const hasAllowedRole = allowedRoles.includes(user.role);

    // Special case: users with is_organizer_approved can access "organizer" routes
    const isApprovedOrganizer =
      allowedRoles.includes("organizer") && user.is_organizer_approved;

    if (!hasAllowedRole && !isApprovedOrganizer) {
      // Redirect to a sensible default based on their actual role
      if (user.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
