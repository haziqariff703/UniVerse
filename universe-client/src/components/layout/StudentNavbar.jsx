import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Bell,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentNavbar({
  user,
  sidebarCollapsed,
  toggleSidebar,
  onLogout,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const location = useLocation();

  // 1. Live Clock Logic
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date
      .toLocaleTimeString("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", " •");
  };

  // 2. Helper for Mobile Title
  const getPageTitle = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);

    // For organizer routes, use the second segment (the actual page)
    if (pathSegments[0] === "organizer") {
      if (pathSegments.length > 1) {
        // Handle routes like /organizer/my-events or /organizer/event/123/dashboard
        const pageName = pathSegments[1];

        // Convert kebab-case to Title Case (e.g., "my-events" -> "My Events")
        return pageName
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
      return "Organizer";
    }

    // For other routes, use the first segment
    const path = pathSegments[0];
    return path ? path.charAt(0).toUpperCase() + path.slice(1) : "Dashboard";
  };

  return (
    <header className="sticky top-4 z-50 px-4 w-full flex justify-between pointer-events-none">
      {/* LEFT: Hamburger | Title (Matching Glass Pill) - Slides with Sidebar */}
      <div
        className="pointer-events-auto flex items-center gap-3 bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 shadow-lg transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateX(${!sidebarCollapsed ? "240px" : "0px"})`,
        }}
      >
        <button
          onClick={toggleSidebar}
          className="text-white hover:text-fuchsia-400 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        {/* Divider */}
        <div className="h-4 w-px bg-white/20" />
        <span className="font-clash font-bold text-white text-sm tracking-wide">
          {getPageTitle()}
        </span>
      </div>

      {/* DESKTOP: Right-Aligned Status HUD Pill */}
      <div className="pointer-events-auto flex items-center gap-4 bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {/* A. Live Clock (Hidden on Mobile) */}
        <div className="hidden md:block text-xs font-geist text-white/50 tracking-widest uppercase min-w-[120px] text-center">
          {formatTime(time)}
        </div>

        {/* Divider */}
        <div className="hidden md:block h-4 w-px bg-white/10" />

        {/* B. Notification Bell (Links to /notifications) */}
        <Link
          to="/notifications"
          className="relative p-1.5 rounded-full hover:bg-white/10 transition-colors group"
        >
          <Bell className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
          {/* Pulsing Red Dot for Alerts */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0a0a0f] animate-pulse" />
        </Link>

        {/* C. Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 pl-2 focus:outline-none group"
          >
            {/* Gradient Avatar Ring */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fuchsia-600 to-purple-600 p-[1px] group-hover:shadow-[0_0_10px_#d946ef] transition-shadow">
              <img
                src={
                  user?.avatar && user.avatar.length > 0
                    ? user.avatar
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=18181b&color=fff`
                }
                alt="Profile"
                className="w-full h-full rounded-full object-cover bg-[#0a0a0f]"
              />
            </div>
            <ChevronDown
              className={`w-4 h-4 text-white/50 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* D. Glass Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-60 bg-[#0a0a0f]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col py-1 z-50"
              >
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-bold text-white truncate">
                    {user?.name || "Cadet"}
                  </p>
                  <p className="text-xs text-white/40 font-geist">
                    Student • Online
                  </p>
                </div>

                {/* Menu Links */}
                <div className="p-2 space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left">
                    <Sun className="w-4 h-4" /> Light Mode
                  </button>
                </div>

                {/* Logout Footer */}
                <div className="p-2 border-t border-white/5 mt-1">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
