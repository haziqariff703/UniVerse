import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Rocket,
  LayoutGrid, // Dashboard/News
  Users, // Communities
  Calendar, // Events
  MapPin, // Venues
  Mic2, // Speakers
  Ticket, // My Bookings
  PlusCircle, // Organizer
} from "lucide-react";
import GradientText from "@/components/ui/GradientText";

const MainSidebar = ({ user, collapsed }) => {
  const location = useLocation();

  // Define navigation items based on role
  const getNavItems = () => {
    if (!user) {
      return [
        { label: "Home", path: "/", icon: LayoutGrid },
        { label: "Communities", path: "/communities", icon: Users },
        { label: "Events", path: "/events", icon: Calendar },
        { label: "Venues", path: "/venues", icon: MapPin },
        { label: "Speakers", path: "/speakers", icon: Mic2 },
      ];
    }

    if (user.role === "organizer") {
      return [
        { label: "My Events", path: "/events", icon: Calendar },
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

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-screen sticky top-0 left-0 bg-background border-r border-border flex flex-col z-50 overflow-hidden text-foreground"
    >
      {/* 1. Header & Logo */}
      <div className="p-6 flex items-center gap-3 h-20">
        <Link to="/" className="flex items-center gap-3">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Rocket className="text-primary w-8 h-8 flex-shrink-0" />
          </motion.div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <GradientText
                colors={["#7c3aed", "#a78bfa", "#7c3aed"]}
                className="text-xl font-bold font-neuemontreal"
                showBorder={false}
              >
                UniVerse
              </GradientText>
            </motion.div>
          )}
        </Link>
      </div>

      {/* 2. Navigation Items */}
      <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto no-scrollbar">
        {!collapsed && (
          <div className="px-2 mb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Menu
            </h3>
          </div>
        )}
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon
                className={`w-5 h-5 flex-shrink-0 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-medium text-sm whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};
export default MainSidebar;
