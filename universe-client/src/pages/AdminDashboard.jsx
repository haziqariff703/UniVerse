import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  Ticket,
  TrendingUp,
  Bell,
  Search,
  Settings,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const AdminDashboard = () => {
  // Mock data for dashboard
  const stats = [
    {
      label: "Total Users",
      value: "1,284",
      change: "+12%",
      isPositive: true,
      icon: Users,
      color: "from-blue-500 to-indigo-500",
    },
    {
      label: "Active Events",
      value: "42",
      change: "+5%",
      isPositive: true,
      icon: Calendar,
      color: "from-violet-500 to-fuchsia-500",
    },
    {
      label: "Total Bookings",
      value: "8,421",
      change: "-2%",
      isPositive: false,
      icon: Ticket,
      color: "from-orange-500 to-rose-500",
    },
    {
      label: "Revenue",
      value: "RM 124K",
      change: "+18%",
      isPositive: true,
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: "Ahmad Zaki",
      action: "Registered for",
      target: "Nebula Music Festival",
      time: "2 mins ago",
      avatar: "AZ",
    },
    {
      id: 2,
      user: "Sarah Lim",
      action: "Created new event",
      target: "Vibe Check Art Gallery",
      time: "15 mins ago",
      avatar: "SL",
    },
    {
      id: 3,
      user: "Jason Tan",
      action: "Updated venue info",
      target: "Cyberjaya Arena",
      time: "1 hour ago",
      avatar: "JT",
    },
    {
      id: 4,
      user: "Nuraisha Ali",
      action: "Requested refund",
      target: "Tech Summit 2026",
      time: "3 hours ago",
      avatar: "NA",
    },
  ];

  const topEvents = [
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
  ];

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
            {[
              "Overview",
              "Events Control",
              "Users List",
              "Revenue",
              "Settings",
            ].map((item) => (
              <button
                key={item}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  item === "Overview"
                    ? "bg-starlight text-black font-bold"
                    : "text-starlight/60 hover:bg-starlight/5 hover:text-starlight"
                }`}
              >
                <span className="text-sm">{item}</span>
              </button>
            ))}
          </nav>
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
      <main className="flex-grow flex flex-col gap-8">
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
          {stats.map((stat, idx) => (
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
                {stat.value}
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
              {topEvents.map((event) => (
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
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-starlight/5 flex items-center justify-center text-xs font-bold text-starlight/60 border border-starlight/10 group-hover:border-violet-400/50 transition-colors">
                    {activity.avatar}
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
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
