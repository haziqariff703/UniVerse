import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Calendar,
  MapPin,
  Users,
  Settings,
  LogOut,
  Rocket,
  PlusCircle,
  TrendingUp,
  DollarSign,
  Send,
  UserSearch,
  History,
  Newspaper,
  Ticket,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const StudentSidebar = ({ isOpen, user, onLogout }) => {
  const location = useLocation();

  const NAV_ITEMS = [
    { label: "Dashboard", path: "/", icon: Home },
    { label: "News", path: "/news", icon: Newspaper },
    { label: "Events", path: "/events", icon: Calendar },
    { label: "Venues", path: "/venues", icon: MapPin },
    { label: "Communities", path: "/communities", icon: Users },
    { label: "My Bookings", path: "/my-bookings", icon: Ticket },
  ];

  const ORGANIZER_ITEMS = [
    { label: "My Events", path: "/organizer/my-events", icon: Calendar },
    {
      label: "Create Event",
      path: "/organizer/create-event",
      icon: PlusCircle,
    },
    { label: "Venues", path: "/organizer/venues", icon: MapPin },
    { label: "Workforce", path: "/organizer/workforce", icon: Users },
    { label: "Analytics", path: "/organizer/analytics", icon: TrendingUp },
    { label: "Finance", path: "/organizer/finance", icon: DollarSign },
    { label: "Speakers", path: "/organizer/speakers", icon: UserSearch },
    { label: "Broadcast", path: "/organizer/broadcast", icon: Send },
    { label: "Activity Log", path: "/organizer/activity-log", icon: History },
  ];

  const isOrganizerMode = location.pathname.startsWith("/organizer");
  const isAssociation = user?.role === "association";
  const hasOrganizerRole =
    user?.roles?.includes("organizer") || user?.role === "organizer";

  // Determine which sections to show based on user request:
  // 1. Association ONLY sees Organizer Suite
  // 2. Student Mode sees Nav Items
  // 3. Organizer Mode sees Organizer Suite
  const showNavItems = !isAssociation && !isOrganizerMode;
  const showOrgItems = isAssociation || (isOrganizerMode && hasOrganizerRole);

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed top-0 left-0 h-screen w-[280px] z-40 bg-black/20 backdrop-blur-3xl border-r border-white/10 rounded-r-[2.5rem] flex flex-col pt-10 pb-8"
        >
          {/* Logo Section */}
          <div className="px-8 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl border border-white/10">
                <Rocket className="w-6 h-6 text-fuchsia-400" />
              </div>
              <span className="text-lg font-bold font-clash text-white tracking-wide">
                UniVerse
              </span>
            </div>
          </div>

          {/* Galaxy Rail - Navigation */}
          <div className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
            {/* Navigation Section */}
            {showNavItems &&
              NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="group relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-glow"
                        className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/20 to-violet-600/10 rounded-2xl border border-white/5"
                      />
                    )}
                    <item.icon
                      className={cn(
                        "w-5 h-5 relative z-10 transition-all duration-300 group-hover:scale-110",
                        isActive
                          ? "text-fuchsia-400"
                          : "text-slate-400 group-hover:text-white",
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm font-medium relative z-10 transition-colors duration-300",
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-white",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}

            {/* Organizer Suite - Shown for Associations or in Organizer Mode */}
            {showOrgItems && (
              <>
                <div className="px-6 pt-2 pb-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-500/60">
                    Organizer Suite
                  </p>
                </div>
                {ORGANIZER_ITEMS.filter((item) => {
                  // If Admin or Association, show everything
                  if (user?.role === "admin" || user?.role === "association")
                    return true;

                  // If President, show everything
                  if (user?.isPresident) return true;

                  // If AJK/Organizer but not President, only show Workforce (and maybe My Events to see context)
                  const restrictedItems = [
                    "Workforce",
                    "My Events",
                    "Activity Log",
                  ];

                  // Unlock Finance for Treasurer
                  if (
                    user?.communityRoles?.includes("Treasurer") &&
                    item.label === "Finance"
                  ) {
                    return true;
                  }

                  return restrictedItems.includes(item.label);
                }).map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="group relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-nav-glow"
                          className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/20 to-violet-600/10 rounded-2xl border border-white/5"
                        />
                      )}
                      <item.icon
                        className={cn(
                          "w-5 h-5 relative z-10 transition-all duration-300 group-hover:scale-110",
                          isActive
                            ? "text-fuchsia-400"
                            : "text-slate-400 group-hover:text-white",
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium relative z-10 transition-colors duration-300",
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-white",
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </>
            )}
          </div>

          {/* Bottom Rail - Settings & Logout */}
          <div className="px-4 mt-auto space-y-3">
            {/* Mode Switcher for Multi-Role Users */}
            {!isAssociation && hasOrganizerRole && (
              <Link
                to={isOrganizerMode ? "/" : "/organizer/my-events"}
                className="group flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
              >
                <div className="p-1.5 bg-violet-500/20 rounded-lg group-hover:bg-violet-500/30 transition-colors">
                  <ArrowLeftRight className="w-4 h-4 text-violet-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">
                    Switch context
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {isOrganizerMode ? "Student View" : "Organizer Mode"}
                  </span>
                </div>
              </Link>
            )}
            <div className="mx-4 mb-4 h-px bg-white/5" />
            <Link
              to="/profile"
              className="group flex items-center gap-4 px-6 py-3 rounded-2xl hover:bg-white/5 transition-all text-slate-400 hover:text-white"
            >
              <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Settings</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full group flex items-center gap-4 px-6 py-3 rounded-2xl hover:bg-red-500/10 transition-all text-slate-400 hover:text-red-400"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StudentSidebar;
