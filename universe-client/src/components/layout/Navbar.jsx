import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Rocket, Menu, Bell, LogOut, User, X } from "lucide-react";
import GradientText from "@/components/ui/GradientText";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollY } = useScroll();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check for user on mount
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Listen for auth changes (custom event from Login/Signup)
    window.addEventListener("authChange", checkUser);
    window.addEventListener("storage", checkUser);

    return () => {
      window.removeEventListener("authChange", checkUser);
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Transition from subtle glass to stronger "veil" as you scroll
  const bgOpacity = useTransform(scrollY, [0, 100], [0.1, 0.8]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0.1, 0.3]);
  const blurValue = useTransform(scrollY, [0, 100], [4, 12]);

  const navStyle = {
    backgroundColor: useTransform(bgOpacity, (v) => `rgba(10, 10, 20, ${v})`),
    borderColor: useTransform(
      borderOpacity,
      (v) => `rgba(255, 255, 255, ${v})`,
    ),
    backdropFilter: useTransform(blurValue, (v) => `blur(${v}px)`),
  };

  // Define navigation items based on role
  const getNavItems = () => {
    if (!user) {
      // Guest
      return [];
    }

    if (user.role === "admin") {
      return [{ label: "Dashboard", path: "/admin/dashboard" }];
    }

    if (user.role === "organizer") {
      return [
        { label: "My Events", path: "/events" },
        { label: "Create Event", path: "/organizer/create-event" },
      ];
    }

    // Student (default)
    return [
      { label: "News", path: "/news" },
      { label: "Communities", path: "/communities" },
      { label: "Events", path: "/events" },
      { label: "Venues", path: "/venues" },
      { label: "Speakers", path: "/speakers" },
      { label: "My Bookings", path: "/my-bookings" },
    ];
  };

  const navItems = getNavItems();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 px-4 md:px-6 py-4 pointer-events-none"
    >
      <div
        className={`max-w-7xl mx-auto rounded-md px-6 py-3 flex justify-between items-center pointer-events-auto transition-all duration-300 ${
          scrolled
            ? "bg-[#0A0A0A] border border-[#1E293B]"
            : "bg-transparent border-transparent"
        }`}
      >
        <Link to="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Rocket className="text-accent" />
            <GradientText
              colors={["#7c3aed", "#a78bfa", "#7c3aed", "#a78bfa", "#7c3aed"]}
              animationSpeed={3}
              showBorder={false}
              className="text-2xl font-neuemontreal font-bold"
            >
              UniVerse
            </GradientText>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-purple-400 border-b-2 border-purple-600 underline-offset-8"
                    : "text-starlight/70 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {user && (
            <>
              <Link
                to="/notifications"
                className="text-starlight/80 hover:text-white transition-colors"
              >
                <Bell className="w-5 h-5" />
              </Link>
              <Link
                to="/profile"
                className="text-starlight/80 hover:text-white transition-colors"
                title="Edit Profile"
              >
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          )}

          {!user && (
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-2 rounded-full font-medium transition-all shadow-lg shadow-violet-500/25"
              >
                Connect
              </motion.button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-starlight hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-2 mx-4 glass-panel rounded-2xl p-4 pointer-events-auto"
        >
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-starlight/80 hover:text-white transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  to="/profile"
                  className="text-starlight/80 hover:text-white transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Edit Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-rose-400 hover:text-rose-300 transition-colors font-medium py-2 text-left"
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <Link
                to="/login"
                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-2 rounded-full font-medium text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Connect
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
