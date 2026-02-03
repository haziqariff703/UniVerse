import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  Zap,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Plus,
  Users,
  Award,
  Heart,
  Menu,
  Rocket,
} from "lucide-react";
// import StudentSidebar from "@/components/layout/StudentSidebar"; // REMOVED
import MissionHistoryCard from "@/components/student/MissionHistoryCard";
import ReviewModal from "@/components/common/ReviewModal";
import { PAST_EVENTS } from "@/data/mockEvents";

const StudentDashboard = ({ user }) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [favorites] = useState(() => {
    return JSON.parse(localStorage.getItem("user_favorites") || "[]");
  });

  // const [isSidebarOpen, setIsSidebarOpen] = useState(false); // REMOVED
  const [selectedHistoryEvent, setSelectedHistoryEvent] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Real Data States
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [profileRes, bookingsRes, clubsRes, venuesRes] =
          await Promise.all([
            fetch("http://localhost:5000/api/users/profile", { headers }).then(
              (r) => r.json(),
            ),
            fetch("http://localhost:5000/api/registrations/my-bookings", {
              headers,
            }).then((r) => r.json()),
            fetch("http://localhost:5000/api/communities/my-communities", {
              headers,
            }).then((r) => r.json()),
            fetch("http://localhost:5000/api/venues").then((r) => r.json()),
          ]);

        setProfile(profileRes);
        setBookings(Array.isArray(bookingsRes) ? bookingsRes : []);
        setClubs(Array.isArray(clubsRes) ? clubsRes : []);
        setVenues(Array.isArray(venuesRes) ? venuesRes : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          <p className="text-cyan-500 font-mono animate-pulse">
            Synchronizing Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const favoriteVenues = venues.filter((v) => favorites.includes(v._id));

  // Merit Data
  const meritPoints = profile?.current_merit || 0;
  const nextRank = profile?.merit_goal || 500;
  const meritProgress = (meritPoints / nextRank) * 100;
  const circleRadius = 36;
  const circleCircumference = 2 * Math.PI * circleRadius;

  // Filter Upcoming vs Past
  const today = new Date();
  const upcomingEvents = bookings
    .filter((reg) => new Date(reg.event_id?.date_time) >= today)
    .map((reg) => ({
      id: reg._id,
      name: reg.event_id?.title || "Unknown Event",
      date: reg.event_id?.date_time
        ? new Date(reg.event_id.date_time).toLocaleString("en-MY", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Date TBA",
      venue:
        reg.event_id?.venue_id?.name ||
        reg.event_snapshot?.venue ||
        "Venue TBA",
      category: reg.event_id?.category || "General",
      canCheckIn: reg.status === "confirmed" && !reg.attended,
      color:
        reg.event_id?.category === "Academic" ? "bg-blue-500" : "bg-purple-500",
      rawDate: reg.event_id?.date_time,
    }))
    .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));

  const missionHistory = bookings
    .filter((reg) => reg.attended || new Date(reg.event_id?.date_time) < today)
    .map((reg) => ({
      ...reg.event_id,
      id: reg._id,
      overallScore: reg.review
        ? reg.review.rating * 2
        : reg.attended
          ? "Pending Review"
          : "N/A",
      attended: reg.attended,
      category: reg.event_id?.category,
      review: reg.review,
    }));

  // Live Pulse from Venues
  const newsHighlights = venues
    .filter(
      (v) => v.occupancyStatus === "Busy" || v.occupancyStatus === "Moderate",
    )
    .slice(0, 2)
    .map((v) => ({
      id: v._id,
      title: v.name,
      summary: `${v.name} is currently ${v.liveOccupancy}% full.`,
      tag: "Live Occupancy",
      isLive: true,
      occupancy: v.occupancyStatus,
    }));

  const interestedFriends = [
    "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    "https://i.pravatar.cc/150?u=a04258114e29026302d",
  ];

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleHistoryClick = (event) => {
    setSelectedHistoryEvent(event);
    setIsReviewOpen(true);
  };

  return (
    // full-bleed wrapper, removed sidebar layout
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-6 py-8 space-y-8 min-h-screen relative"
    >
      {/* 1. Header & Stats */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <p className="text-slate-400 font-mono text-xs uppercase tracking-widest mb-1">
            {currentDate}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold font-clash text-white">
            Welcome,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              {user?.name?.split(" ")[0] || "Student"}
            </span>
            .
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            to="/events"
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2.5rem] text-white text-sm font-bold font-clash transition-all backdrop-blur-sm"
          >
            Find Events
          </Link>
          {user?.is_organizer_approved || user?.roles?.includes("organizer") ? (
            <Link
              to="/organizer/my-events"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-violet-500/30 text-violet-400 text-sm font-bold font-clash rounded-[2.5rem] transition-all backdrop-blur-sm flex items-center gap-2 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              <TrendingUp className="w-4 h-4" />
              Manage Events
            </Link>
          ) : (
            <Link
              to="/start-club"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-fuchsia-500/30 text-fuchsia-400 text-sm font-bold font-clash rounded-[2.5rem] transition-all backdrop-blur-sm flex items-center gap-2 hover:shadow-[0_0_15px_rgba(232,121,249,0.3)]"
            >
              <Rocket className="w-4 h-4" />
              Start a Club
            </Link>
          )}
          <Link
            to="/communities"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-[2.5rem] text-white text-sm font-bold font-clash transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)]"
          >
            Join a Club
          </Link>
        </div>
      </motion.div>

      {/* 2. Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bookings Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.02 }}
          className="p-6 rounded-[2.5rem] bg-black/60 border border-white/10 backdrop-blur-3xl hover:border-white/20 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all group relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-4">
            <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">
              Bookings
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold font-clash text-white mb-2">
            {upcomingEvents.length} Active
          </p>
          <Link
            to="/venues"
            className="absolute bottom-4 right-4 p-2 rounded-full bg-white/5 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all border border-white/5"
            title="New Booking"
          >
            <Plus className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Community Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.02 }}
          className="p-6 rounded-[2.5rem] bg-black/60 border border-white/10 backdrop-blur-3xl hover:border-white/20 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">
              Community
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold font-clash text-white">
            {clubs.length} Clubs
          </p>
        </motion.div>

        {/* Events Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.02 }}
          className="p-6 rounded-[2.5rem] bg-black/60 border border-white/10 backdrop-blur-3xl hover:border-white/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">
              Saved
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold font-clash text-white">
            {missionHistory.length} Attended
          </p>
        </motion.div>

        {/* Merit Status Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.02 }}
          className="p-4 pl-6 rounded-[2.5rem] bg-gradient-to-br from-black/80 to-blue-950/30 border border-white/10 backdrop-blur-3xl hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all flex items-center justify-between group"
        >
          <div>
            <span className="text-slate-400 text-xs font-mono uppercase tracking-widest block mb-1">
              Merit Status
            </span>
            <p className="text-2xl font-bold font-clash text-white mb-2 group-hover:text-blue-400 transition-colors">
              Rising Star
            </p>
            <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
              {meritPoints}/{nextRank} XP
            </span>
          </div>

          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r={circleRadius}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r={circleRadius}
                fill="none"
                stroke="url(#blue-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circleCircumference}
                initial={{ strokeDashoffset: circleCircumference }}
                animate={{
                  strokeDashoffset:
                    circleCircumference -
                    (meritProgress / 100) * circleCircumference,
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient
                  id="blue-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <Award className="absolute w-6 h-6 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
          </div>
        </motion.div>
      </div>

      {/* 3. BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLUMN 1: Upcoming Schedule - span 8 */}
        <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-clash text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Upcoming Schedule
            </h2>
            <Link
              to="/my-bookings"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group uppercase tracking-wider"
            >
              View Full Schedule{" "}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex flex-col md:flex-row md:items-center gap-5 p-6 rounded-[2.5rem] bg-black/60 border border-white/10 backdrop-blur-3xl hover:bg-white/[0.03] hover:border-white/20 transition-all group relative overflow-hidden"
                >
                  {/* Date Badge */}
                  <div
                    className={`w-16 h-16 rounded-2xl ${event.color} bg-opacity-10 flex flex-col items-center justify-center border border-white/5 shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider ${event.category === "Academic" ? "text-blue-400" : "text-purple-400"}`}
                    >
                      {event.date.split(" ")[0]}
                    </span>
                    <span className="text-xl font-bold text-white font-clash">
                      {event.date.split(" ")[1]?.replace(",", "")}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 z-10">
                    <h3 className="text-lg font-bold font-clash text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {event.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5">
                        <Clock className="w-3 h-3 text-cyan-400" /> {event.date}
                      </span>
                      <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5">
                        <MapPin className="w-3 h-3 text-purple-400" />{" "}
                        {event.venue}
                      </span>
                    </div>
                  </div>

                  {/* Smart Action Button */}
                  <div className="mt-2 md:mt-0 z-10 w-full md:w-auto">
                    {event.canCheckIn ? (
                      <Link
                        to={`/events/${event.id}`}
                        className="w-full md:w-auto px-6 py-3 bg-emerald-500 text-black font-bold font-clash rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 animate-pulse hover:animate-none"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Check In
                      </Link>
                    ) : (
                      <span className="inline-block w-full text-center md:w-auto px-4 py-2 rounded-full text-xs font-bold font-mono bg-white/5 text-slate-400 border border-white/10">
                        {new Date(event.rawDate) > today ? "UPCOMING" : "ENDED"}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-12 rounded-[2.5rem] border border-dashed border-white/10 text-center">
                <p className="text-slate-500 font-mono text-sm mb-4">
                  No upcoming events found.
                </p>
                <Link
                  to="/events"
                  className="text-cyan-400 font-bold hover:underline"
                >
                  Browse Events Hub
                </Link>
              </div>
            )}
          </div>

          {/* Quick Find */}
          <div className="p-8 rounded-[2.5rem] bg-gradient-to-r from-blue-950/40 to-purple-950/40 border border-blue-500/20 backdrop-blur-3xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold font-clash text-white mb-2">
                  Explore the UniVerse
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3 hover:space-x-1 transition-all">
                    {interestedFriends.map((src, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full border-2 border-black bg-slate-800 overflow-hidden relative z-0 hover:z-10 hover:scale-110 transition-all"
                      >
                        <img
                          src={src}
                          alt="Student"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-black bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white z-0">
                      +12
                    </div>
                  </div>
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                    Friends active now
                  </p>
                </div>
              </div>
              <Link
                to="/events"
                className="px-8 py-3 bg-white text-black text-sm font-bold font-clash rounded-xl hover:bg-slate-200 transition-colors shadow-lg shadow-white/10 whitespace-nowrap"
              >
                Explore Events
              </Link>
            </div>
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full group-hover:bg-blue-500/30 transition-colors pointer-events-none" />
          </div>
        </motion.div>

        {/* COLUMN 2: Participation History (Side Feed) - span 4 */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-clash text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-fuchsia-400" />
              Participation History
            </h2>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              Recent Feedback
            </span>
          </div>

          <div className="space-y-4">
            {/* History Feed */}
            {missionHistory.length > 0 ? (
              missionHistory
                .slice(0, 3)
                .map((event) => (
                  <MissionHistoryCard
                    key={event.id}
                    event={event}
                    onClick={handleHistoryClick}
                  />
                ))
            ) : (
              <div className="p-8 rounded-[1.5rem] bg-black/40 border border-white/5 text-center">
                <p className="text-[10px] font-mono text-slate-600 uppercase">
                  No prior activity
                </p>
              </div>
            )}

            {/* View All Button */}
            <Link
              to="/events"
              className="block w-full py-4 text-center rounded-[2.5rem] border border-dashed border-white/10 text-xs font-mono text-slate-500 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest"
            >
              Explore More Events
            </Link>
          </div>

          {/* Live Status (Previously Campus Pulse) */}
          <div className="pt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-clash text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Live Status
              </h2>
            </div>
            <div className="space-y-3">
              {newsHighlights.map((news) => (
                <div
                  key={news.id}
                  className="group p-4 rounded-[1.5rem] bg-black/40 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${news.isLive ? "bg-red-500/10 text-red-500" : "bg-white/5 text-slate-400"}`}
                    >
                      {news.tag}
                    </span>
                    <span className="text-[10px] font-mono text-slate-600">
                      2m ago
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                    {news.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {news.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* 4. My Spots (Favorites) */}
      <AnimatePresence>
        {favoriteVenues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pt-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-clash text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-fuchsia-400 fill-fuchsia-500/20" />
                My Spots
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteVenues.slice(0, 3).map((venue) => (
                <motion.div
                  key={venue._id}
                  whileHover={{ y: -5 }}
                  className="group relative h-48 rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-3xl"
                >
                  <img
                    src={venue.image}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                    alt={venue.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-3 h-3 text-fuchsia-400" />
                      <span className="text-[10px] font-mono font-bold text-white/60 tracking-widest uppercase">
                        {venue.location_code}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                      {venue.name}
                    </h3>
                    <Link
                      to={`/venues/${venue.id}`}
                      className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-400 hover:text-white transition-colors"
                    >
                      Check Live <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Read-Only Review Modal */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        event={selectedHistoryEvent}
        readOnly={true}
      />
    </motion.div>
  );
};

export default StudentDashboard;
