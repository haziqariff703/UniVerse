import React, { useState, useEffect } from "react";
import VenueLandscapeCard from "@/components/venues/VenueLandscapeCard";
import { MOCK_VENUES } from "@/data/mockVenues";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import TrueFocus from "@/components/ui/TrueFocus";
import { VIBE_TAGS } from "@/data/liveVenueStatus";
import { Sparkles, X, BookOpen, Snowflake, Wifi, Users } from "lucide-react";

const CATEGORIES = ["All", "Academic", "Residential", "Social", "Outdoor"];

// Animation variants for staggered list
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeVibe, setActiveVibe] = useState(null);
  const [user, setUser] = useState(null);

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }

    const fetchVenues = async () => {
      try {
        const [venuesRes, eventsRes] = await Promise.all([
          fetch(`${API_BASE}/api/venues`),
          fetch(`${API_BASE}/api/events?status=approved`),
        ]);

        if (venuesRes.ok && eventsRes.ok) {
          const venuesData = await venuesRes.json();
          const eventsData = await eventsRes.json();

          // Attach relevant events to each venue
          const venuesWithEvents = venuesData.map((v) => ({
            ...v,
            events: eventsData.filter(
              (e) => e.venue_id?._id === v._id || e.venue_id === v._id,
            ),
          }));

          setVenues(venuesWithEvents);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const filteredVenues = venues.filter((venue) => {
    // 1. Search Logic (Always applies)
    const matchesSearch =
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location_code.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Vibe Logic
    const matchesVibe =
      !activeVibe ||
      (activeVibe === "quiet"
        ? ["Academic", "Residential"].includes(venue.type)
        : activeVibe === "ac"
          ? venue.facilities?.some((f) => f.toLowerCase().includes("ac"))
          : activeVibe === "wifi"
            ? venue.facilities?.some((f) => f.toLowerCase().includes("wifi"))
            : activeVibe === "social"
              ? ["Social", "Outdoor"].includes(venue.type)
              : true);

    return matchesSearch && matchesVibe;
  });

  const placeholders = [
    "Search for Academic Block...",
    "Looking for a hall with AC?",
    "Find spots for Exhibitions",
    "Search for Surau Ar-Razzaq",
    "Where is the Library?",
    "Best venues for Formal Dinners",
  ];

  return (
    <div className="min-h-screen pt-4 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Cinema Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="mb-4">
            <TrueFocus
              sentence="Venues Hub"
              manualMode={false}
              blurAmount={10}
              borderColor="#D946EF" // Fuchsia-500
              animationDuration={0.8}
              pauseBetweenAnimations={1}
              fontSize="text-4xl md:text-7xl"
            />
          </div>
          <p className="text-xl md:text-2xl text-slate-400 font-clash max-w-3xl leading-relaxed">
            Find your perfect study spot, event space, or hangout zone at{" "}
            <span className="text-white border-b-2 border-fuchsia-500/50 pb-1">
              UiTM Puncak Perdana
            </span>
            .
          </p>
        </motion.div>

        {/* Combined Search & Discovery Hero */}
        <div className="relative z-[50] mb-16">
          {/* Search Bar */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-2xl">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSubmit={(e) => e.preventDefault()}
                value={searchTerm}
              />
            </div>
          </div>

          {/* VIBE CHIPS (Integrated) */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {VIBE_TAGS.map((vibe) => {
              const Icon =
                vibe.id === "quiet"
                  ? BookOpen
                  : vibe.id === "ac"
                    ? Snowflake
                    : vibe.id === "wifi"
                      ? Wifi
                      : vibe.id === "social"
                        ? Users
                        : Sparkles;

              return (
                <button
                  key={vibe.id}
                  onClick={() =>
                    setActiveVibe(activeVibe === vibe.id ? null : vibe.id)
                  }
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all backdrop-blur-xl border select-none",
                    activeVibe === vibe.id
                      ? "bg-slate-900/80 text-white border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.3)] scale-105"
                      : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-3.5 h-3.5",
                      activeVibe === vibe.id
                        ? "text-fuchsia-400"
                        : "opacity-70",
                    )}
                  />
                  {vibe.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vertical Feed */}
        <motion.div
          className="flex flex-col gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 border border-white/5 rounded-[3rem] bg-slate-900/20 backdrop-blur-sm">
              <div className="w-16 h-16 border-4 border-fuchsia-500/20 border-t-fuchsia-500 rounded-full animate-spin mb-6" />
              <p className="text-slate-400 font-clash text-lg animate-pulse">
                Scanning campus frequencies...
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredVenues.map((venue, idx) => (
                <motion.div
                  key={venue._id || `venue-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <VenueLandscapeCard
                    venue={{ ...venue, id: venue._id }}
                    index={idx}
                    user={user}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {!loading && filteredVenues.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-40 border border-white/5 rounded-[3rem] bg-slate-900/20 backdrop-blur-sm"
            >
              <div className="text-7xl mb-8 opacity-40 text-fuchsia-500">
                🔍
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 font-clash tracking-tight">
                No scenes found in this galaxy
              </h3>
              <p className="text-slate-400 text-lg font-clash max-w-md mx-auto">
                Try searching for a different area or switching categories.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveVibe(null);
                }}
                className="mt-12 px-10 py-4 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                Reset Radar
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
export default Venues;
