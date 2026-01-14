import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  Ticket,
  TrendingUp,
  Bell,
  Search,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  LogOut,
} from "lucide-react";
import UsersList from "../components/admin/UsersList";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check Admin Role & Fetch Data
  useEffect(() => {
    const checkAuth = () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      if (!token || user.role !== "admin") {
        navigate("/login");
        return;
      }

      if (activeView === "Overview") {
        fetchDashboardStats();
      }
    };

    checkAuth();
  }, [activeView, navigate]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Access denied. Admin privileges required.");
        }
        throw new Error("Failed to fetch dashboard stats");
      }

      const data = await response.json();
      setStats(data.stats);
      setRecentActivities(data.recentActivity);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message);
      if (err.message.includes("Access denied")) {
        navigate("/login"); // Redirect if backend rejects
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // Format time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  // Stats configuration with real data
  const statsConfig = [
    {
      label: "Total Users",
      value: stats?.totalUsers?.toLocaleString() || "0",
      change: "+12%",
      isPositive: true,
      icon: Users,
      color: "from-blue-500 to-indigo-500",
    },
    {
      label: "Active Events",
      value: stats?.activeEvents?.toString() || "0",
      change: "+5%",
      isPositive: true,
      icon: Calendar,
      color: "from-violet-500 to-fuchsia-500",
    },
    {
      label: "Total Bookings",
      value: stats?.totalBookings?.toLocaleString() || "0",
      change: "-2%",
      isPositive: false,
      icon: Ticket,
      color: "from-orange-500 to-rose-500",
    },
    {
      label: "Revenue",
      value: `RM ${stats?.revenue?.toLocaleString() || "0"}`,
      change: "+18%",
      isPositive: true,
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const navItems = [
    "Overview",
    "Events Control",
    "Users List",
    "Revenue",
    "Settings",
  ];

  // Render main content based on active view
  const renderContent = () => {
    switch (activeView) {
      case "Users List":
        return <UsersList onBack={() => setActiveView("Overview")} />;
      case "Events Control":
        return (
          <div className="glass-panel rounded-3xl p-12 text-center">
            <Calendar size={48} className="mx-auto text-starlight/20 mb-4" />
            <h3 className="text-xl font-bold text-starlight mb-2">
              Events Control
            </h3>
            <p className="text-starlight/40">Coming soon...</p>
          </div>
        );
      case "Revenue":
        return (
          <div className="glass-panel rounded-3xl p-12 text-center">
            <TrendingUp size={48} className="mx-auto text-starlight/20 mb-4" />
            <h3 className="text-xl font-bold text-starlight mb-2">
              Revenue Analytics
            </h3>
            <p className="text-starlight/40">Coming soon...</p>
          </div>
        );
      case "Settings":
        return (
          <div className="glass-panel rounded-3xl p-12 text-center">
            <h3 className="text-xl font-bold text-starlight mb-2">Settings</h3>
            <p className="text-starlight/40">Coming soon...</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => {
    if (error) {
      return (
        <div className="glass-panel rounded-3xl p-12 text-center">
          <div className="text-rose-400 mb-4">{error}</div>
          <button
            onClick={fetchDashboardStats}
            className="px-6 py-3 rounded-xl bg-violet-500 text-white font-bold hover:bg-violet-600 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-starlight text-glow">
              System{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                Intelligence
              </span>
            </h1>
            <p className="text-starlight/40 text-sm">
              Real-time metrics from across the galaxy
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardStats}
              className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-starlight/60 hover:text-starlight hover:border-starlight/30 transition-all"
              title="Refresh"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <button className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-starlight/60 hover:text-starlight hover:border-starlight/30 transition-all">
              <Search size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-starlight/60 hover:text-starlight hover:border-starlight/30 transition-all relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsConfig.map((stat, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              key={stat.label}
              className="glass-panel p-5 rounded-3xl relative overflow-hidden group border-starlight/5 hover:border-starlight/20 transition-all"
            >
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-bl-[100px] group-hover:opacity-[0.08] transition-opacity`}
              ></div>

              <div className="flex justify-between items-start mb-4">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                >
                  <stat.icon size={18} className="text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-bold ${
                    stat.isPositive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {stat.isPositive ? (
                    <ArrowUpRight size={12} />
                  ) : (
                    <ArrowDownRight size={12} />
                  )}
                  {stat.change}
                </div>
              </div>

              <div className="text-2xl font-black text-starlight mb-1">
                {loading ? "..." : stat.value}
              </div>
              <div className="text-xs text-starlight/40 font-bold uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Events Table */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 overflow-hidden border-starlight/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-starlight">
                Performance Leaderboard
              </h3>
              <button className="text-starlight/40 hover:text-starlight transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {[
                {
                  name: "Nebula Music Festival",
                  sold: "850/1000",
                  revenue: "RM 85,000",
                  progress: 85,
                },
                {
                  name: "Tech Summit: AI",
                  sold: "420/500",
                  revenue: "RM 42,000",
                  progress: 84,
                },
                {
                  name: "Artistic Souls",
                  sold: "120/150",
                  revenue: "RM 3,000",
                  progress: 80,
                },
              ].map((event) => (
                <div key={event.name}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-starlight text-sm">
                        {event.name}
                      </span>
                      <span className="text-xs text-starlight/40">
                        {event.revenue}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-starlight/60">
                      {event.sold} Tickets
                    </span>
                  </div>
                  <div className="w-full h-2 bg-starlight/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${event.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="glass-panel rounded-3xl p-6 border-starlight/5">
            <h3 className="font-bold text-starlight mb-8">Cosmic Feed</h3>
            <div className="flex flex-col gap-6">
              {loading ? (
                <div className="text-center text-starlight/40 py-8">
                  Loading...
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="text-center text-starlight/40 py-8">
                  No recent activity
                </div>
              ) : (
                recentActivities.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-starlight/5 flex items-center justify-center text-xs font-bold text-starlight/60 border border-starlight/10 group-hover:border-violet-400/50 transition-colors">
                      {activity.user?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm text-starlight leading-snug">
                        <span className="font-bold">{activity.user}</span>{" "}
                        {activity.action}{" "}
                        <span className="text-violet-400 font-semibold">
                          {activity.target}
                        </span>
                      </p>
                      <span className="text-[10px] text-starlight/30 font-bold uppercase tracking-wider mt-1">
                        {timeAgo(activity.time)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar (Desktop Only) */}
      <aside className="hidden md:flex flex-col w-64 gap-4">
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-1 mb-4 shadow-xl shadow-violet-500/20">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-2xl font-bold text-starlight">
                AD
              </div>
            </div>
            <h3 className="font-bold text-lg text-starlight">Admin Center</h3>
            <p className="text-xs text-starlight/40 uppercase tracking-widest mt-1 font-semibold">
              Universe HQ
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveView(item)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  item === activeView
                    ? "bg-starlight text-black font-bold"
                    : "text-starlight/60 hover:bg-starlight/5 hover:text-starlight"
                }`}
              >
                <span className="text-sm">{item}</span>
              </button>
            ))}
          </nav>

          <div className="h-px bg-starlight/10 my-1"></div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all duration-300"
          >
            <LogOut size={16} />
            <span className="text-sm font-bold">Logout Mission</span>
          </button>
        </div>

        <div className="glass-panel p-6 rounded-3xl bg-gradient-to-b from-starlight/5 to-transparent border-starlight/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            <span className="text-xs font-bold text-starlight/60 uppercase tracking-wider">
              System Status
            </span>
          </div>
          <p className="text-sm text-starlight/80 leading-relaxed">
            All planetary systems are operational. Data sync 100%.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col gap-8">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;
