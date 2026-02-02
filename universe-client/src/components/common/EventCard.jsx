import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Target,
  Award,
  Map,
  Zap,
  Ticket,
  CheckCircle,
} from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";

const EventCard = ({ event, index }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(event.isRegistered || false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Auth sync error", e);
      }
    }
  }, []);

  // Sync isRegistered if prop changes
  useEffect(() => {
    if (event.isRegistered !== undefined) {
      setIsRegistered(event.isRegistered);
    }
  }, [event.isRegistered]);

  // Determine Theme
  const isFPM =
    event.theme === "cyan" ||
    event.organizer?.name?.includes("FPM") ||
    event.organizer?.name?.includes("IMSA");
  const themeColor = isFPM ? "cyan" : "purple";

  // Spotlight Color
  const spotlightColor = isFPM
    ? "rgba(6, 182, 212, 0.25)" // Cyan
    : "rgba(168, 85, 247, 0.4)"; // Purple

  const handleQuickJoin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: event.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setIsRegistered(true);
    } catch (err) {
      console.error("Quick join error:", err);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isToday = event.date === "2024-05-15"; // Mock comparison for demo

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full relative group"
    >
      <Spotlight
        spotlightColor={spotlightColor}
        className="h-full rounded-[2.5rem] border border-white/5 bg-slate-950/40 backdrop-blur-xl overflow-hidden"
      >
        <Link
          to={user ? `/events/${event.id}` : "#"}
          onClick={(e) => {
            if (!user) {
              e.preventDefault();
              navigate("/login");
            }
          }}
          className="relative z-10 flex flex-col h-full"
        >
          {/* Image Section - Enforced Aspect Ratio */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-80" />

            {/* Top Badges */}
            <div className="absolute top-5 left-5 flex flex-col gap-2">
              {/* NEW: Merit Pill */}
              {user && event.meritValue && (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-400 backdrop-blur-md flex items-center gap-1.5 shadow-[0_0_15px_rgba(217,70,239,0.3)]"
                >
                  <Zap size={10} fill="currentColor" />+{event.meritValue} Merit
                </motion.span>
              )}
              {event.target && (
                <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-black/60 border border-white/10 text-white backdrop-blur-md flex items-center gap-1.5 w-fit">
                  <Target size={12} className={`text-${themeColor}-400`} />
                  {event.target}
                </span>
              )}
            </div>

            <div className="absolute top-5 right-5">
              {isRegistered && (
                <motion.span
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 backdrop-blur-md flex items-center gap-1.5"
                >
                  <CheckCircle size={12} />
                  You're Going
                </motion.span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-7 flex flex-col flex-grow relative">
            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold font-clash mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-white to-slate-400 transition-all duration-300">
              {event.title}
            </h3>

            {/* Meta Details */}
            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-center gap-3 text-slate-400">
                <Calendar size={16} className={`text-${themeColor}-400`} />
                <span className="font-clash text-xs font-semibold tracking-wide">
                  {event.date}
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <MapPin size={16} className={`text-${themeColor}-400`} />
                <span className="font-clash text-xs font-semibold tracking-wide truncate">
                  {event.venue?.name}
                </span>
              </div>
            </div>

            {/* NEW: Bottom Action Row */}
            <div className="flex items-center justify-between pt-6 border-t border-white/5 transition-all">
              {/* Social Facepile */}
              {user && event.attendingFriends && (
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {event.attendingFriends.map((friend) => (
                      <div
                        key={friend.id}
                        className="w-6 h-6 rounded-full border-2 border-slate-950 overflow-hidden bg-slate-900"
                      >
                        <img
                          src={friend.avatar}
                          alt="friend"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-400 transition-colors">
                    {event.attendingFriends[0].name || "Friends"} attending
                  </span>
                </div>
              )}

              {user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleQuickJoin}
                  disabled={isLoading || isRegistered}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isRegistered
                      ? isToday
                        ? "bg-fuchsia-600 text-white shadow-[0_0_15px_rgba(217,70,239,0.4)]"
                        : "bg-white/10 text-slate-400"
                      : "bg-white text-black hover:bg-slate-200"
                  }`}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isRegistered ? (
                    isToday ? (
                      <>
                        <Ticket size={12} />
                        View QR
                      </>
                    ) : (
                      "Registered"
                    )
                  ) : (
                    <>
                      <Zap size={10} fill="currentColor" />
                      Quick Join
                    </>
                  )}
                </motion.button>
              ) : (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  View Details
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              )}
            </div>
          </div>
        </Link>
      </Spotlight>
    </motion.div>
  );
};

export default EventCard;
