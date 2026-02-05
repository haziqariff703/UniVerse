import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// Icons
import {
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Moon,
  Sun,
  Menu,
  Rocket,
} from "lucide-react";
import { swalConfirm } from "@/lib/swalConfig";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Communities", href: "/communities" },
  { name: "Events", href: "/events" },
  { name: "Venues", href: "/venues" },
];
import StudentNavbar from "./StudentNavbar";

const Navbar = ({ user, collapsed, onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleLogout = async () => {
    const result = await swalConfirm({
      title: "Logout?",
      text: "Are you sure you want to end your session?",
      confirmButtonText: "Logout",
      confirmButtonColor: "#ef4444",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      window.dispatchEvent(new Event("authChange"));
    }
  };

  return user ? (
    <StudentNavbar
      user={user}
      sidebarCollapsed={collapsed}
      toggleSidebar={onToggleSidebar}
      onLogout={handleLogout}
    />
  ) : (
    // =============================================================
    // 🌍 PUBLIC STATE (Elite Glass Capsule)
    // =============================================================
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[95vw]">
      {/* CONTAINER: Thinner padding (py-2.5) for a sleek 'OS' feel */}
      <div className="flex items-center gap-6 px-5 py-2.5 rounded-full bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {/* 1. LOGO (Restored Original Floating Animation) */}
        <Link to="/" className="flex items-center gap-2 group shrink-0 pr-2">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* No Box Background - Just the Icon */}
            <Rocket className="w-5 h-5 text-fuchsia-500 fill-fuchsia-500/20 group-hover:text-fuchsia-400 transition-colors" />
          </motion.div>
          <span className="font-clash font-bold text-lg text-white tracking-wide hidden sm:block whitespace-nowrap">
            UniVerse
          </span>
        </Link>

        {/* 2. NAV LINKS (Sleek & Active Aware) */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.href;

            return (
              <li key={link.name} className="relative">
                <Link
                  to={link.href}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`relative z-10 block px-4 py-1.5 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.name}

                  {/* Magnetic Hover Bubble */}
                  {hoveredLink === link.name && (
                    <motion.div
                      layoutId="public-nav-pill"
                      className="absolute inset-0 bg-white/10 rounded-full -z-10"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}

                  {/* Active State Indicator (Glowing Dot) */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-fuchsia-500 rounded-full shadow-[0_0_8px_#d946ef]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* 3. AUTH (Balanced Hierarchy + Un-Squashed) */}
        <div className="flex items-center gap-4 shrink-0 pl-2">
          {/* Subtle Divider */}
          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Login: Ghost Style */}
          <Link
            to="/login"
            className="text-xs font-geist font-medium text-white/70 hover:text-white uppercase tracking-widest transition-colors whitespace-nowrap"
          >
            Login
          </Link>

          {/* Sign Up: White Shimmer Button (High Contrast) */}
          <Link
            to="/signup"
            className="relative group overflow-hidden rounded-full bg-white px-5 py-2 transition-transform hover:scale-105 whitespace-nowrap shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <span className="relative z-10 text-sm font-bold text-black group-hover:text-fuchsia-900 transition-colors">
              Sign Up
            </span>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent z-0" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
