import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import {
  Clock,
  Search,
  Bell,
  Filter,
  Plus,
  Calendar,
  UserCheck,
  Mic2,
  ArrowRight,
  RotateCw,
  Menu,
  Rocket,
} from "lucide-react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import useMalaysiaTime from "@/hooks/useMalaysiaTime";
import SidePeek from "../admin/dashboard/SidePeek";
import { swalConfirm } from "@/lib/swalConfig";

const FooterLogo = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true });

      tl.to(containerRef.current, {
        rotation: 360,
        duration: 0.8,
        ease: "back.out(1.7)",
      }).to(
        textRef.current,
        {
          backgroundPosition: "200% center",
          duration: 1,
          ease: "none",
        },
        "<",
      );

      const el = containerRef.current.parentElement;
      el.addEventListener("mouseenter", () => tl.play());
      el.addEventListener("mouseleave", () => tl.reverse());

      return () => {
        el.removeEventListener("mouseenter", () => tl.play());
        el.removeEventListener("mouseleave", () => tl.reverse());
      };
    },
    { scope: containerRef },
  );

  return (
    <div className="flex items-center gap-2 cursor-pointer group">
      <div
        ref={containerRef}
        className="h-6 w-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20"
      >
        <Rocket size={14} className="text-white fill-white/20" />
      </div>
      <span
        ref={textRef}
        className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-400 to-white bg-[size:200%_auto]"
      >
        UniVerse Admin Console
      </span>
    </div>
  );
};

const AdminLayout = ({ ...props }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [stats, setStats] = useState({
    pendingEvents: 0,
    pendingOrganizers: 0,
    pendingSpeakers: 0,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { formattedDate, formattedTime } = useMalaysiaTime();

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.stats) {
        setStats({
          pendingEvents: data.stats.pendingEvents || 0,
          pendingOrganizers: data.stats.pendingOrganizers || 0,
          pendingSpeakers: data.stats.pendingSpeakers || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching alert stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [fetchStats]);

  const totalAlerts =
    stats.pendingEvents + stats.pendingOrganizers + stats.pendingSpeakers;
  const getSafeUser = () => {
    try {
      const stored = localStorage.getItem("user");
      return stored && stored !== "undefined" ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };
  const user = getSafeUser();

  const handleLogout = async () => {
    const result = await swalConfirm({
      title: "Logout?",
      text: "Are you sure you want to end your administrative session?",
      confirmButtonText: "Logout",
      confirmButtonColor: "#ef4444",
      icon: "warning",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("authChange"));
      navigate("/login");
    }
  };

  // Helper to determine title based on path
  const getPageTitle = () => {
    if (props.title) return props.title;
    const path = location.pathname;
    if (path.includes("/admin/dashboard")) return "Overview";
    if (path.includes("/admin/venues")) return "Venues";
    if (path.includes("/admin/users")) return "Users";
    if (path.includes("/admin/events")) return "Event Approvals";
    if (path.includes("/admin/organizers")) return "Organizer Approvals";
    if (path.includes("/admin/speakers")) return "Speakers";
    if (path.includes("/admin/reviews")) return "Reviews";
    if (path.includes("/admin/notifications")) return "Notifications";
    if (path.includes("/admin/settings")) return "Settings";
    if (path.includes("/admin/categories")) return "Categories";
    // Default fallback
    return "Admin";
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row font-sans text-slate-200">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        handleLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A]">
        <header className="h-20 border-b border-white/5 bg-[#0e0e12]/50 backdrop-blur-xl sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 -ml-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-black text-white uppercase tracking-tight hidden sm:block">
              {getPageTitle()}
            </h1>
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 rounded-lg px-3 py-1.5 border border-white/5 font-mono">
              <div className="flex items-center">
                <Clock size={12} className="mr-1.5 text-violet-400" />
                {formattedDate}
              </div>
              <div className="w-px h-3 bg-white/10 mx-1" />
              <div className="text-starlight font-bold tracking-wider">
                {formattedTime}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAlertsOpen(true)}
              className="p-2 rounded-xl border border-white/10 bg-[#13131a] text-gray-400 hover:text-white transition-colors relative"
            >
              <Bell size={20} />
              {totalAlerts > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 border border-[#0A0A0A] text-[10px] font-black text-white flex items-center justify-center animate-pulse">
                  {totalAlerts}
                </span>
              )}
            </button>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-0.5">
              <div className="h-full w-full rounded-[10px] bg-black overflow-hidden relative">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                    user?.name || "Admin"
                  }`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* System Alerts SidePeek */}
        <SidePeek
          isOpen={isAlertsOpen}
          onClose={() => setIsAlertsOpen(false)}
          title="System Alerts"
          actions={
            <button
              onClick={fetchStats}
              className="p-2 rounded-lg hover:bg-white/5 text-starlight/40 hover:text-white transition-colors"
              title="Refresh Stats"
            >
              <RotateCw size={16} />
            </button>
          }
        >
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-starlight/40 font-bold mb-4">
                Pending Approvals
              </p>

              <div className="space-y-3">
                {[
                  {
                    label: "Event Proposals",
                    count: stats.pendingEvents,
                    icon: Calendar,
                    path: "/admin/events/approvals",
                    color: "text-amber-400",
                    bg: "bg-amber-400/10",
                  },
                  {
                    label: "Organizer Requests",
                    count: stats.pendingOrganizers,
                    icon: UserCheck,
                    path: "/admin/organizers/approvals",
                    color: "text-violet-400",
                    bg: "bg-violet-400/10",
                  },
                  {
                    label: "Speaker Verifications",
                    count: stats.pendingSpeakers,
                    icon: Mic2,
                    path: "/admin/speakers/approvals",
                    color: "text-emerald-400",
                    bg: "bg-emerald-400/10",
                  },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsAlertsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}
                      >
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-starlight">
                          {item.label}
                        </h4>
                        <p className="text-[10px] text-starlight/40">
                          Requires review
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-black ${item.count > 0 ? item.color : "text-starlight/20"}`}
                      >
                        {item.count}
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-starlight/20 group-hover:text-starlight group-hover:translate-x-0.5 transition-all"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Bell size={24} className="text-starlight/20" />
              </div>
              <h4 className="text-sm font-bold text-starlight/60">
                No System Broadcasts
              </h4>
              <p className="text-[10px] text-starlight/40 mt-1 max-w-[200px]">
                Create a broadcast in the Notifications Center to message all
                users.
              </p>
              <Link
                to="/admin/notifications"
                onClick={() => setIsAlertsOpen(false)}
                className="mt-4 text-[10px] font-bold text-violet-400 hover:text-violet-300 uppercase tracking-widest"
              >
                Go to Registry →
              </Link>
            </div>
          </div>
        </SidePeek>

        {/* Content Area */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>

        {/* Admin Footer */}
        <footer className="border-t border-white/5 bg-[#0e0e12] px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <FooterLogo />
            <p className="text-xs text-starlight/40 font-medium">
              &copy; {new Date().getFullYear()} UniVerse Event Management
              System. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;
