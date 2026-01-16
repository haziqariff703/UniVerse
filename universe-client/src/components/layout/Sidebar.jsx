import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutGrid, // "News" / Dashboard
  Users, // Communities
  Calendar, // Events
  MapPin, // Venues
  Mic2, // Speakers
  Ticket, // My Bookings
  Settings,
  LogOut,
  ChevronRight,
  PlusCircle, // Create Event
  Shield, // Admin
  X, // Close
  Rocket, // Logo
} from "lucide-react";
import GradientText from "@/components/ui/GradientText";

const Sidebar = ({ isOpen, onClose, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.dispatchEvent(new Event("authChange"));
    onClose(); // Close sidebar on logout
  };

  // Define navigation items based on role
  const getNavItems = () => {
    if (!user) {
      return [
        { label: "News", path: "/news", icon: LayoutGrid },
        { label: "Communities", path: "/communities", icon: Users },
        { label: "Events", path: "/events", icon: Calendar },
        { label: "Venues", path: "/venues", icon: MapPin },
        { label: "Speakers", path: "/speakers", icon: Mic2 },
      ];
    }

    if (user.role === "admin") {
      return [
        { label: "Dashboard", path: "/admin/dashboard", icon: Shield },
        { label: "News", path: "/news", icon: LayoutGrid },
        { label: "Events", path: "/events", icon: Calendar },
        { label: "Bookings", path: "/my-bookings", icon: Ticket }, // Admin views?
      ];
    }

    if (user.role === "organizer") {
      return [
        { label: "My Events", path: "/events", icon: Calendar }, // Maybe filter for organizer?
        {
          label: "Create Event",
          path: "/organizer/create-event",
          icon: PlusCircle,
        },
        { label: "Venues", path: "/venues", icon: MapPin },
      ];
    }

    // Student (default)
    return [
      { label: "News", path: "/news", icon: LayoutGrid },
      { label: "Communities", path: "/communities", icon: Users },
      { label: "Events", path: "/events", icon: Calendar },
      { label: "Venues", path: "/venues", icon: MapPin },
      { label: "Speakers", path: "/speakers", icon: Mic2 },
      { label: "My Bookings", path: "/my-bookings", icon: Ticket },
    ];
  };

  const navItems = getNavItems();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
      onClose();
      setSearchQuery("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (Mobile/Overlay) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Sidebar drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-[100dvh] w-80 bg-[#0A0A0A] border-r border-white/5 shadow-2xl z-[100] flex flex-col overscroll-contain"
          >
            {/* Header: Logo & Close */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center gap-2"
              >
                <Rocket className="text-accent w-6 h-6" />
                <GradientText
                  colors={[
                    "#7c3aed",
                    "#a78bfa",
                    "#7c3aed",
                    "#a78bfa",
                    "#7c3aed",
                  ]}
                  animationSpeed={3}
                  showBorder={false}
                  className="text-xl font-neuemontreal font-bold"
                >
                  UniVerse
                </GradientText>
              </Link>
              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              {/* 1. Search Bar */}
              <form
                onSubmit={handleSearch}
                className="relative mb-6 flex-shrink-0"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </form>

              {/* 2. Navigation */}
              <div className="flex-1 overflow-y-auto space-y-1 pr-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group ${
                        isActive
                          ? "bg-white text-black shadow-lg shadow-white/5"
                          : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                      }`}
                    >
                      <item.icon
                        className={`w-5 h-5 ${
                          isActive
                            ? "text-black"
                            : "text-neutral-500 group-hover:text-white"
                        }`}
                      />
                      <span>{item.label}</span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 3. User Profile (Bottom) */}
            {user ? (
              <div className="p-4 border-t border-neutral-900 bg-[#0A0A0A]">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-neutral-500 truncate capitalize">
                      {user.role}
                    </p>
                  </div>
                  {/* Settings / Actions */}
                  <div className="flex gap-1">
                    <Link
                      to="/profile"
                      onClick={onClose}
                      className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-1.5 text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border-t border-neutral-900 bg-[#0A0A0A]">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center justify-center w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition-colors"
                >
                  Connect Wallet / Login
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
