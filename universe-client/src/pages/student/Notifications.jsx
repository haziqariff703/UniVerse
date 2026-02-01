import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Info,
  AlertTriangle,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const signalData = [
    {
      id: "s1",
      title: "Registration Confirmed",
      message:
        "You have successfully registered for 'Nebula Music Festival'. Your QR code is ready.",
      type: "success",
      time: "2 hours ago",
      group: "Today",
      isRead: false,
    },
    {
      id: "s2",
      title: "Event Reminder",
      message:
        "The 'Quantum Physics Symposium' is starting in 30 minutes at Mars Campus.",
      type: "info",
      time: "30 mins ago",
      group: "Today",
      isRead: false,
    },
    {
      id: "s3",
      title: "Venue Change",
      message:
        "The venue for 'Astro-Culinary Workshop' has been changed to Saturn Ring Station.",
      type: "alert",
      time: "Yesterday",
      group: "Yesterday",
      isRead: true,
    },
    {
      id: "s4",
      title: "Merit Points Updated",
      message: "You earned +20 Merit for attending 'Cyber Security Talk'.",
      type: "success",
      time: "3 days ago",
      group: "Older",
      isRead: true,
    },
  ];

  const [signals, setSignals] = useState(signalData);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <CheckCircle2
            className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
            size={28}
          />
        );
      case "alert":
        return (
          <AlertTriangle
            className="text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]"
            size={28}
          />
        );
      default:
        return (
          <Info
            className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]"
            size={28}
          />
        );
    }
  };

  const filteredSignals = signals.filter((s) => {
    if (activeTab === "unread") return !s.isRead;
    return true;
  });

  const groupedSignals = {
    Today: filteredSignals.filter((s) => s.group === "Today"),
    Yesterday: filteredSignals.filter((s) => s.group === "Yesterday"),
    Older: filteredSignals.filter((s) => s.group === "Older"),
  };

  const markAllRead = () => {
    setSignals(signals.map((s) => ({ ...s, isRead: true })));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "backOut" },
    },
  };

  return (
    <div className="min-h-screen pt-12 pb-20 px-6 md:px-12 bg-transparent relative">
      {/* Background Glow for visibility */}
      <div className="fixed top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* HERO HUD */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Link
                to="/"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
              >
                <ArrowLeft size={20} />
              </Link>
              <span className="text-xs font-mono font-bold text-fuchsia-400 tracking-[0.2em] uppercase glow-text">
                / SIGNAL CENTER
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-black font-clash text-white tracking-tighter drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
              Notifications
            </h1>
          </div>

          {/* UNIFIED HUD BAR */}
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xl border border-white/20 p-1.5 rounded-full shadow-2xl">
            {["all", "unread"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative px-6 py-2.5 rounded-full text-xs font-bold font-mono uppercase tracking-widest transition-all",
                  activeTab === tab
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                    : "text-slate-400 hover:text-white hover:bg-white/10",
                )}
              >
                {tab}
                {tab === "unread" && signals.some((s) => !s.isRead) && (
                  <span className="ml-2 w-2 h-2 inline-block rounded-full bg-fuchsia-500 animate-pulse shadow-[0_0_10px_#d946ef]" />
                )}
              </button>
            ))}
            <div className="w-[1px] h-5 bg-white/20 mx-2" />
            <button
              onClick={markAllRead}
              className="p-2.5 text-slate-400 hover:text-fuchsia-400 hover:bg-white/10 rounded-full transition-colors"
              title="Mark all read"
            >
              <Check size={18} />
            </button>
          </div>
        </div>

        {/* CHRONOLOGICAL FEED */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {Object.entries(groupedSignals).map(
            ([group, groupSignals]) =>
              groupSignals.length > 0 && (
                <div key={group}>
                  <h3 className="text-xs font-mono font-bold text-fuchsia-300/80 uppercase tracking-[0.3em] pl-1 mb-4 flex items-center gap-4">
                    {group}
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-fuchsia-500/30 to-transparent" />
                  </h3>

                  <div className="grid gap-4">
                    {groupSignals.map((signal) => (
                      <motion.div
                        key={signal.id}
                        variants={itemVariants}
                        className={cn(
                          "group relative flex items-center gap-6 p-5 md:p-6 rounded-[2.5rem] border transition-all duration-300",
                          !signal.isRead
                            ? "bg-white/[0.08] border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-xl"
                            : "bg-black/40 border-white/10 hover:border-white/30 backdrop-blur-md opacity-90 hover:opacity-100",
                        )}
                      >
                        {/* Icon Halo */}
                        <div className="shrink-0 relative">
                          <div
                            className={cn(
                              "absolute inset-0 opacity-20 blur-xl rounded-full transition-opacity group-hover:opacity-40",
                              signal.type === "success"
                                ? "bg-emerald-500"
                                : signal.type === "alert"
                                  ? "bg-rose-500"
                                  : "bg-blue-500",
                            )}
                          />
                          <div className="relative w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-inner">
                            {getIcon(signal.type)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                          <div className="flex items-center justify-between gap-4">
                            <h4
                              className={cn(
                                "text-lg font-clash font-bold tracking-wide truncate pr-4",
                                !signal.isRead
                                  ? "text-white drop-shadow-md"
                                  : "text-slate-300",
                              )}
                            >
                              {signal.title}
                            </h4>
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest whitespace-nowrap bg-black/30 px-2 py-1 rounded-lg border border-white/5">
                              {signal.time}
                            </span>
                          </div>
                          <p
                            className={cn(
                              "text-sm leading-relaxed truncate pr-8",
                              !signal.isRead
                                ? "text-slate-200 font-medium"
                                : "text-slate-500",
                            )}
                          >
                            {signal.message}
                          </p>
                        </div>

                        {/* Unread Indicator */}
                        <div className="shrink-0 flex items-center justify-center">
                          {!signal.isRead && (
                            <div className="w-3 h-3 rounded-full bg-fuchsia-500 shadow-[0_0_15px_#d946ef] animate-pulse" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ),
          )}

          {filteredSignals.length === 0 && (
            <div className="py-24 text-center border border-dashed border-white/20 rounded-[3rem] bg-white/[0.02] backdrop-blur-sm">
              <Bell className="w-16 h-16 text-slate-700 mx-auto mb-6 opacity-50" />
              <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">
                No signals detected in this sector
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;
