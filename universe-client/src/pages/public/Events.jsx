import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import FeaturedEventSlider from "@/components/public/FeaturedEventSlider";
import EventCard from "@/components/common/EventCard";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { FEATURED_EVENTS, UPCOMING_EVENTS } from "@/data/mockEvents";

const CATEGORIES = [
  "All",
  "Academic",
  "Creative",
  "Lifestyle",
  "Community",
  "Leadership",
];

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Simulating loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const placeholders = [
    "Search for 'Social Media Mastery'...",
    "Finding FiTA film screenings?",
    "Looking for 'Animation Kingdom'?",
    "find 'Food Festival'...",
    "What's happening at FPM?",
    "Events near College Jasmine...",
  ];

  const filteredEvents = UPCOMING_EVENTS.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-4 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12 overflow-x-hidden">
      {/* 1. FEATURED HERO SLIDER */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        <FeaturedEventSlider events={FEATURED_EVENTS} />
      </motion.section>

      {/* 2. SEARCH & FILTERS */}
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

      {/* 3. UPCOMING EXPERIENCES (REVERTED TO 3-COLUMN GRID) */}
      <section>
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent flex-grow" />
          <h2 className="text-2xl md:text-3xl font-bold font-clash text-white tracking-tight">
            Upcoming Experiences
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
                    <EventCard event={event} index={index} />
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
                    No events found
                  </h3>
                  <p className="text-slate-500 font-clash text-lg max-w-sm mx-auto">
                    Try adjusting your search query or faculty filter to find
                    what you're looking for.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
};

export default Events;
