import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Communities", href: "/communities" },
  { name: "Events", href: "/events" },
  { name: "Venues", href: "/venues" },
];

const Navbar = ({ user, onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll listener - trigger at 20px like Vercel
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.dispatchEvent(new Event("authChange"));
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-black/40 backdrop-blur-md border-b border-white/5"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* LEFT: Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-3">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Rocket className="text-purple-400 w-5 h-5" />
              </motion.div>
              <span className="text-white font-semibold text-sm tracking-tight">
                UniVerse
              </span>
            </Link>
          </div>

          {/* CENTER: Nav Links with Sliding Pill */}
          {/* CENTER: Nav Links with Sliding Pill - HIDDEN FOR STUDENTS */}
          <nav className="hidden md:flex items-center gap-1">
            {(!user || user.role !== "student") &&
              NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {/* Sliding Pill Background */}
                  {(hoveredLink === link.href ||
                    location.pathname === link.href) && (
                    <motion.div
                      layoutId="navbar-pill"
                      className="absolute inset-0 bg-white/[0.06] rounded-md"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              ))}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile: Hamburger - ONLY for logged-in users */}
            {user && (
              <button
                onClick={onToggleSidebar}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}

            {user ? (
              /* LOGGED IN: User Dropdown with Theme/Notifications Inside */
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/[0.06] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-semibold text-xs">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-slate-400 transition-transform",
                      dropdownOpen && "rotate-180",
                    )}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden p-2"
                    >
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <p className="text-sm font-medium text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400">{user.role}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>

                      <Link
                        to="/notifications"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Bell className="w-4 h-4" />
                        Notifications
                        <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
                      </Link>

                      {mounted && (
                        <button
                          onClick={toggleTheme}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          {theme === "dark" ? (
                            <Sun className="w-4 h-4" />
                          ) : (
                            <Moon className="w-4 h-4" />
                          )}
                          {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </button>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>

                      <div className="h-px bg-white/10 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* GUEST: Login + Sign Up */
              <>
                <Link
                  to="/login"
                  className="hidden md:inline-flex px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-white/90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
