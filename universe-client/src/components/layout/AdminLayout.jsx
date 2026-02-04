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
} from "lucide-react";
import useMalaysiaTime from "@/hooks/useMalaysiaTime";
import SidePeek from "../admin/dashboard/SidePeek";

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
      const response = await fetch("/api/admin/stats", {
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

  const handleLogout = () => {
    if (confirm("Logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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
        {/* Global Admin Header */}
        <header className="h-20 border-b border-white/5 bg-[#0e0e12]/50 backdrop-blur-xl sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
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
            <div className="relative hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Search workspace..."
                className="bg-[#13131a] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-violet-500 transition-colors w-64"
              />
            </div>
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
      </main>
    </div>
  );
};

export default AdminLayout;
