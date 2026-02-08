import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Sparkles,
  MapPin,
  Search,
  Calendar,
  Filter,
} from "lucide-react";
import FeaturedEventSlider from "@/components/public/FeaturedEventSlider";
import MissionLogCard from "@/components/common/MissionLogCard";
import ReviewModal from "@/components/common/ReviewModal";
import EventCard from "@/components/common/EventCard";
import EventCarousel from "@/components/public/EventCarousel";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { resolveUrl } from "@/utils/urlHelper";

const API_BASE = "";

const mapEventToCardProps = (event) => ({
  id: event._id,
  title: event.title,
  description: event.description,
  image: resolveUrl(event.image) || "/placeholder-event.jpg",
  date: new Date(event.date_time).toLocaleDateString("en-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  time: new Date(event.date_time).toLocaleTimeString("en-MY", {
    hour: "2-digit",
    minute: "2-digit",
  }),
  venue: {
    name: event.venue_id?.name || event.location || "TBA",
  },
  organizer: event.organizer_id,
  category: event.category,
  target: event.target_audience,
  meritValue: event.merit_points,
  theme: "cyan", // Default theme, can be dynamic later if category model has color
  benefit: event.merit_points > 0 ? `+${event.merit_points} Merit` : null,
  tags: event.tags,
});

const Events = () => {
  const [view, setView] = useState("upcoming");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [categories, setCategories] = useState(["All"]);

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewEvent, setReviewEvent] = useState(null);
  const [profile, setProfile] = useState({ current_merit: 0, merit_goal: 500 });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Auth parse error", e);
      }
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const [featRes, upRes, pastRes, registrationsRes, catRes] =
        await Promise.all([
          fetch(`/api/events?is_featured=true&upcoming=true`),
          fetch(`/api/events?upcoming=true`),
          fetch(`/api/events?upcoming=false`),
          token
            ? fetch(`/api/registrations/my-bookings`, {
                headers: { Authorization: `Bearer ${token}` },
              })
            : Promise.resolve({ ok: true, json: () => Promise.resolve([]) }),
          fetch(`/api/categories`),
        ]);

      const [feat, up, past, regs, cats] = await Promise.all([
        featRes.json(),
        upRes.json(),
        pastRes.json(),
        registrationsRes.ok ? registrationsRes.json() : Promise.resolve([]),
        catRes.ok ? catRes.json() : Promise.resolve([]),
      ]);

      if (Array.isArray(cats)) {
        setCategories(["All", ...cats.map((c) => c.name)]);
      }

      const registeredEventIds = new Set(
        Array.isArray(regs)
          ? regs.map((r) => r.event_id?._id || r.event_snapshot?._id)
          : [],
      );

      // Create a map of reviews by event ID
      const reviewMap = {};
      if (Array.isArray(regs)) {
        regs.forEach((reg) => {
          if (reg.review) {
            const eventId = reg.event_id?._id || reg.event_snapshot?._id;
            if (eventId) reviewMap[eventId] = reg.review;
          }
        });
      }

      const mapWithReg = (event) => ({
        ...mapEventToCardProps(event),
        isRegistered: registeredEventIds.has(event._id),
        review: reviewMap[event._id] || null, // Link review data
      });

      setFeaturedEvents(Array.isArray(feat) ? feat.map(mapWithReg) : []);
      setUpcomingEvents(Array.isArray(up) ? up.map(mapWithReg) : []);
      setPastEvents(
        Array.isArray(past)
          ? past.map(mapWithReg).filter((e) => e.isRegistered)
          : [],
      );

      // Fetch user profile stats for merit tracking
      if (token) {
        const profRes = await fetch(`/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profRes.ok) {
          const profData = await profRes.json();
          setProfile(profData);
        }
      }
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const placeholders = [
    "Search for 'Social Media Mastery'...",
    "Finding FiTA film screenings?",
    "Looking for 'Animation Kingdom'?",
    "What's happening at FPM?",
  ];

  const datasource = view === "upcoming" ? upcomingEvents : pastEvents;
  const filteredEvents = datasource.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.description &&
        e.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat =
      selectedCategory === "All" || e.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleReview = (event) => {
    setReviewEvent(event);
    setIsReviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-transparent pt-4 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12 overflow-x-hidden">
      {/* FEATURED HERO SLIDER */}
      <AnimatePresence mode="wait">
        {view === "upcoming" && featuredEvents.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <FeaturedEventSlider events={featuredEvents} user={user} />
          </motion.section>
        )}
      </AnimatePresence>

      {/* MERIT TRACKER */}
      {user && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group p-[2px] rounded-[2rem] bg-gradient-to-r from-fuchsia-500/20 via-violet-500/20 to-cyan-500/20 overflow-hidden"
        >
          <div className="relative bg-slate-950/80 backdrop-blur-lg rounded-[1.9rem] p-6 md:p-8 border border-white/5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                  Student Merit Progress
                </p>
                <div className="flex items-center gap-4">
                  <h3 className="text-3xl md:text-4xl font-bold font-clash text-white">
                    {profile.current_merit || 0}{" "}
                    <span className="text-sm font-medium text-slate-500">
                      Points
                    </span>
                  </h3>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                    <Sparkles size={12} />{" "}
                    {profile.current_merit >= 400 ? "Pro Tier" : "Starter Tier"}
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 space-y-3">
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, (profile.current_merit / (profile.merit_goal || 500)) * 100)}%`,
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-fuchsia-500 to-violet-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <span>Semester Goal</span>
                  <span className="text-fuchsia-400">
                    {Math.max(
                      0,
                      (profile.merit_goal || 500) - profile.current_merit,
                    )}{" "}
                    points to Next Level
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB SWITCHER */}
      {user && (
        <div className="flex justify-center">
          <div className="relative flex p-1 bg-slate-900/50 backdrop-blur-md rounded-full border border-white/10">
            <button
              onClick={() => setView("upcoming")}
              className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold font-clash transition-colors duration-300 ${view === "upcoming" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              {user ? "Active Missions" : "Upcoming Experiences"}
              {view === "upcoming" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/10 rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] -z-10"
                />
              )}
            </button>
            <button
              onClick={() => setView("past")}
              className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold font-clash transition-colors duration-300 ${view === "past" ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              Mission Logs
              {view === "past" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/10 rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] -z-10"
                />
              )}
            </button>
          </div>
        </div>
      )}

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="w-full md:w-1/2 lg:w-1/3 text-white">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSubmit={(e) => e.preventDefault()}
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center md:justify-end">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-bold font-clash border transition-all ${selectedCategory === c ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "bg-slate-900/50 text-slate-400 border-slate-700/50 hover:border-slate-500"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* CAROUSEL SECTION (Optional UI enrichment) */}
      {view === "upcoming" && upcomingEvents.length > 5 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-xl md:text-2xl font-bold font-clash text-white flex items-center gap-2">
              <Rocket className="text-fuchsia-400" size={20} /> Recommended for
              You
            </h2>
          </div>
          <EventCarousel events={upcomingEvents} />
        </section>
      )}

      {/* EVENT GRID */}
      <section>
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent flex-grow" />
          <h2 className="text-2xl md:text-3xl font-bold font-clash text-white tracking-tight">
            {view === "upcoming"
              ? "All Incoming Missions"
              : "Historical Archive"}
          </h2>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent flex-grow" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 rounded-3xl bg-slate-900/40 animate-pulse border border-white/5"
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
                  >
                    {view === "upcoming" ? (
                      <EventCard event={event} index={index} />
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
                <div className="col-span-full py-32 text-center bg-slate-900/20 rounded-[2.5rem] border border-white/5">
                  <Calendar size={48} className="mx-auto mb-4 text-slate-700" />
                  <h3 className="text-xl text-white font-bold mb-2">
                    No transmissions found
                  </h3>
                  <p className="text-slate-500">
                    Try narrowing your scan parameters.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>

      <ReviewModal
        key={reviewEvent?.id || "none"}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        event={reviewEvent}
        readOnly={true}
      />
    </div>
  );
};

export default Events;
