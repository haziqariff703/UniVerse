import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({
  children,
  allowedRoles,
  requirePresident = false,
}) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const location = useLocation();

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, check role-based access
  if (allowedRoles) {
    const isAssociation = user.role === "association";
    const isAdmin =
      user.role === "admin" || (user.roles && user.roles.includes("admin"));

    const hasRole =
      isAdmin ||
      (isAssociation &&
        (allowedRoles.includes("organizer") ||
          allowedRoles.includes("admin"))) ||
      (user.roles && user.roles.some((r) => allowedRoles.includes(r))) ||
      allowedRoles.includes(user.role);

    if (!hasRole) {
      if (isAdmin) return <Navigate to="/admin" replace />;
      return <Navigate to="/" replace />;
    }
  }

  // New: Check for President/Admin/Association status if required
  if (requirePresident) {
    const isTreasurer = user.communityRoles?.includes("Treasurer");
    const isFinanceRoute = location.pathname.includes("/finance");

    const isAuthorized =
      user.role === "admin" ||
      user.role === "association" ||
      (user.roles && user.roles.includes("admin")) ||
      user.isPresident ||
      (isTreasurer && isFinanceRoute);

    if (!isAuthorized) {
      // Redirect to Workforce as it's the only thing they can see
      return <Navigate to="/organizer/workforce" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
