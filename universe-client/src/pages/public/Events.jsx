import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FeaturedEventSlider from "@/components/public/FeaturedEventSlider";
import MissionLogCard from "@/components/common/MissionLogCard";
import ReviewModal from "@/components/common/ReviewModal";
import EventCard from "@/components/common/EventCard";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import {
  FEATURED_EVENTS,
  UPCOMING_EVENTS,
  PAST_EVENTS,
} from "@/data/mockEvents";

const CATEGORIES = [
  "All",
  "Academic",
  "Creative",
  "Lifestyle",
  "Community",
  "Leadership",
];

const Events = () => {
  const [view, setView] = useState("upcoming"); // "upcoming" | "past"
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Review Modal State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewEvent, setReviewEvent] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  // Simulating loading state
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [view]); // Reload when tab changes

  const placeholders = [
    "Search for 'Social Media Mastery'...",
    "Finding FiTA film screenings?",
    "Looking for 'Animation Kingdom'?",
    "find 'Food Festival'...",
    "What's happening at FPM?",
    "Events near College Jasmine...",
  ];

  // Filter Logic
  const datasource = view === "upcoming" ? UPCOMING_EVENTS : PAST_EVENTS;

  const filteredEvents = datasource.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleReview = (event) => {
    setReviewEvent(event);
    setIsReviewOpen(true);
  };

  return (
    <div className="min-h-screen pt-4 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12 overflow-x-hidden">
      {/* 1. FEATURED HERO SLIDER (Only show in Upcoming view) */}
      <AnimatePresence>
        {view === "upcoming" && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full overflow-hidden"
          >
            <FeaturedEventSlider events={FEATURED_EVENTS} user={user} />
          </motion.section>
        )}
      </AnimatePresence>

      {/* 1.5 MERIT TRACKER (ONLY FOR LOGGED IN STUDENTS) */}
      {user && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group p-[2px] rounded-[2rem] bg-gradient-to-r from-fuchsia-500/20 via-violet-500/20 to-cyan-500/20 overflow-hidden"
        >
          <div className="relative bg-slate-950/80 backdrop-blur-3xl rounded-[1.9rem] p-6 md:p-8 border border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                  Student Merit Progress
                </p>
                <h3 className="text-2xl font-clash font-bold text-white">
                  Welcome back,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-400">
                    {user.name}
                  </span>
                  . You've earned{" "}
                  <span className="text-fuchsia-400">45/100</span> Merit points.
                </h3>
              </div>

              <div className="flex-1 w-full max-w-md space-y-3">
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "45%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 shadow-[0_0_15px_rgba(217,70,239,0.5)]"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <span>Semester Goal</span>
                  <span className="text-fuchsia-400">
                    15 points to Next Level
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. DUAL-ORBIT TAB SWITCHER - HIDDEN FOR PUBLIC USERS if they only have 1 option? Or restrict Mission Logs */}
      {user && (
        <div className="flex justify-center">
          <div className="relative flex p-1 bg-slate-900/50 backdrop-blur-md rounded-full border border-white/10">
            <button
              onClick={() => setView("upcoming")}
              className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold font-clash transition-colors duration-300 ${
                view === "upcoming"
                  ? "text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {user ? "Active Missions" : "Upcoming Experiences"}
              {view === "upcoming" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/10 rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>

            {/* RESTRICTION: Hide Mission Logs for public users */}
            {user && (
              <button
                onClick={() => setView("past")}
                className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold font-clash transition-colors duration-300 ${
                  view === "past"
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Mission Logs
                {view === "past" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSubmit={(e) => e.preventDefault()}
          />
        </div>

        {/* Category Filter Pills */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-wrap gap-2 justify-center md:justify-end"
        >
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-bold font-clash transition-all duration-300 border ${
                selectedCategory === category
                  ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  : "bg-slate-900/50 text-slate-400 border-slate-700/50 hover:border-slate-500 hover:text-slate-200 backdrop-blur-sm"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
      </div>

      {/* 4. EVENT GRID (Dynamic Content) */}
      <section>
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent flex-grow" />
          <h2 className="text-2xl md:text-3xl font-bold font-clash text-white tracking-tight">
            {view === "upcoming" ? "Upcoming Experiences" : "Mission History"}
          </h2>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent flex-grow" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[500px] rounded-3xl bg-slate-900/40 animate-pulse border border-white/5"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            <AnimatePresence mode="popLayout">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    {view === "upcoming" ? (
                      <EventCard event={event} index={index} user={user} />
                    ) : (
                      <MissionLogCard
                        event={event}
                        index={index}
                        onReview={handleReview}
                      />
                    )}
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-32 text-center bg-slate-900/20 rounded-[2.5rem] border border-white/5 backdrop-blur-sm"
                >
                  <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Calendar className="text-slate-500 w-10 h-10" />
                  </div>
                  <h3 className="text-2xl text-white font-clash font-bold mb-3 tracking-tight">
                    {view === "upcoming"
                      ? "No upcoming events found"
                      : "Mission Log Empty"}
                  </h3>
                  <p className="text-slate-500 font-clash text-lg max-w-sm mx-auto">
                    {view === "upcoming"
                      ? "Try adjusting your search query or faculty filter."
                      : "You haven't attended any events yet. Join a mission to start your log!"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* 5. REVIEW MODAL */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        event={reviewEvent}
      />
    </div>
  );
}; // End Events Component

export default Events;
