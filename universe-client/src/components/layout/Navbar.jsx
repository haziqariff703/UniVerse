import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
// UI Components
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// Icons
import {
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Moon,
  Sun,
  Menu, // Using Menu as Hamburger icon
  Rocket,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import GradientText from "@/components/ui/GradientText";

const Navbar = ({ user, onToggleSidebar }) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
        "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 transition-all duration-300",
      )}
    >
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left Side: Hamburger & Logo (Logo is in sidebar, but we might want it here if sidebar is hidden on mobile) */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Rocket className="text-primary w-6 h-6 flex-shrink-0" />
            </motion.div>
            <div className="overflow-hidden whitespace-nowrap">
              <GradientText
                colors={["#7c3aed", "#a78bfa", "#7c3aed"]}
                className="text-lg font-bold font-neuemontreal"
                showBorder={false}
              >
                UniVerse
              </GradientText>
            </div>
          </Link>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          {/* Notification Bell */}
          <Link
            to="/notifications"
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-accent/50 hover:bg-accent border border-border transition-all"
            >
              {user ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-foreground leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-sm font-medium text-foreground"
                >
                  Login
                </Link>
              )}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-xl shadow-xl overflow-hidden z-50 p-2 text-popover-foreground"
                >
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <p className="text-sm font-medium">Profile Settings</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <User className="w-4 h-4" /> View Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <div className="h-px bg-border my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
