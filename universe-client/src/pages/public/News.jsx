import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Zap,
  Clock,
  CalendarDays,
  X,
} from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import { Calendar } from "@/components/ui/calendar";

// --- DATA ADAPTERS ---
// Transform real data into "News" format

const CATEGORIES = [
  "ALL SIGNALS",
  "OFFICIAL SIGNALS",
  "CLUB NEWS",
  "CAMPUS ALERTS",
];

const News = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("ALL SIGNALS");
  const [date, setDate] = useState(null);
  const [showAllFeed, setShowAllFeed] = useState(false);

  // Real Data States
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);

  // Fetch signals
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await fetch("/api/public/news", { headers });
        const data = await response.json();

        if (Array.isArray(data.news)) {
          setBroadcasts(data.news);
        } else {
          setBroadcasts([]);
        }
      } catch (err) {
        console.error("News fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const timeZone = "Asia/Kuala_Lumpur";
  const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const getDateKey = (value) => {
    if (!value) return null;
    const parsed = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return dateKeyFormatter.format(parsed);
  };

  const isSameDay = (a, b) => {
    const aKey = getDateKey(a);
    const bKey = getDateKey(b);
    return aKey && bKey && aKey === bKey;
  };

  // Filter Logic
  const filteredBroadcasts = broadcasts.filter((b) => {
    const matchesCategory =
      activeCategory === "ALL SIGNALS" ||
      b.category?.toUpperCase() ===
        activeCategory.replace(" SIGNALS", "").toUpperCase() ||
      (activeCategory === "CAMPUS ALERTS" && b.type === "alert");

    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.message.toLowerCase().includes(searchQuery.toLowerCase());

    const createdAt = b?.created_at ? new Date(b.created_at) : null;
    const matchesDate = date ? isSameDay(createdAt, date) : true;

    return matchesCategory && matchesSearch && matchesDate;
  });

  useEffect(() => {
    setShowAllFeed(false);
  }, [activeCategory, searchQuery, broadcasts]);

  const normalize = (value) =>
    (value ?? "").toString().trim().toLowerCase();
  const isHeroSignal = (broadcast) =>
    normalize(broadcast?.priority) === "high";

  // UI Transformers
  const heroSlides = filteredBroadcasts
    .filter((b) => isHeroSignal(b))
    .slice(0, 3)
    .map((b) => ({
      id: b._id,
      title: b.title.toUpperCase(),
      urgentTag: `[${b.type?.toUpperCase() || "SIGNAL"}]`,
      subtitle: b.message,
      image:
        b.image_url ||
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
      category: b.category?.toUpperCase() || "SYSTEM",
      date: "NOW",
    }));

  // Fallback slides if no high priority
  const finalHeroSlides =
    heroSlides.length > 0
      ? heroSlides
      : [
          {
            id: "fallback-1",
            title: "SYSTEM ONLINE: AWAITING SIGNALS",
            urgentTag: "[STATUS: READY]",
            subtitle:
              "The UniVerse News Hub is synchronized. Latest campus signals will appear here.",
            image:
              "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
            category: "SYSTEM",
            date: "NOW",
          },
        ];

  const mainFeed = filteredBroadcasts
    .map((b) => ({
      id: b._id,
      type: "feature",
      title: b.title,
      description: b.message,
      image:
        b.image_url ||
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      category: b.category?.toUpperCase() || "GENERAL",
      signalTime:
        new Date(b.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }) +
        " | " +
        new Date(b.created_at).toLocaleDateString([], {
          day: "2-digit",
          month: "short",
        }),
    }));

  const quickUpdates = filteredBroadcasts.slice(0, 5).map((b) => ({
    id: b._id,
    title: b.title,
    category:
      (b.type === "alert" ? "CAMPUS ALERT" : b.category?.toUpperCase()) ||
      "INFO",
    time: "ACTIVE",
  }));

  const feedItems = showAllFeed ? mainFeed : mainFeed.slice(0, 3);

  // Auto-play slider
  useEffect(() => {
    if (finalHeroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % finalHeroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [finalHeroSlides.length]);

  // --- SUB-COMPONENTS ---
  const NewsDetailModal = ({ news, onClose }) => {
    if (!news) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl h-[90vh] md:h-[80vh] bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Stays fixed relative to modal */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-black/50 border border-white/10 text-white hover:bg-white hover:text-black transition-all backdrop-blur-md"
          >
            <X size={18} />
          </button>

          {/* Left: Poster Side - Fixed Ratio */}
          <div className="w-full md:w-[45%] h-[250px] md:h-full relative shrink-0">
            <img
              src={
                news.image_url ||
                news.image ||
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
              }
              alt={news.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-r" />
          </div>

          {/* Right: Content Side - Independently Scrollable */}
          <div className="w-full md:w-[55%] flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-6 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-fuchsia-500/20 transition-colors">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400 text-[10px] font-mono font-bold uppercase tracking-widest">
                  {news.category?.toUpperCase() || "SIGNAL"}
                </span>
                <span className="text-white/40 text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2">
                  <Clock size={12} /> {news.signalTime || "ACTIVE"}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-clash font-bold text-white leading-tight tracking-tight">
                {news.title}
              </h2>

              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 text-lg leading-relaxed font-sans whitespace-pre-wrap">
                  {news.message || news.description || news.subtitle}
                </p>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="p-8 border-t border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md flex justify-end shrink-0">
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-full bg-white text-black font-clash font-bold text-xs uppercase tracking-widest hover:bg-fuchsia-500 hover:text-white transition-all shadow-xl shadow-fuchsia-500/10"
              >
                Return to Hub
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-fuchsia-500/20 border-t-fuchsia-500 rounded-full animate-spin" />
          <p className="text-fuchsia-500 font-mono animate-pulse">
            Scanning Signals...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pb-20 pt-4">
      {/* Reduced pt-16 to pt-4 per user request */}

      {/* SECTION I: HEADER & CINEMATIC PORTAL SLIDER */}
      <div className="px-4 md:px-8 max-w-6xl mx-auto mb-6">
        {/* Headline with SplitText - Split for Gradient Control */}
        <div className="mb-6 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 md:gap-x-4">
            <SplitText
              text="Campus News"
              className="text-4xl md:text-6xl font-clash font-bold text-white tracking-tight"
              delay={40}
              animationFrom={{ opacity: 0, transform: "translate3d(0,40px,0)" }}
              animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
              threshold={0.1}
              rootMargin="-50px"
            />
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-4xl md:text-6xl font-clash font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent pb-1"
            >
              Hub
            </motion.span>
          </div>
          {/* Subheadline to balance the space if needed, or purely decorative */}
          <div className="h-1 w-20 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full mt-2 hidden md:block" />
        </div>

        {/* CINEMATIC PORTAL SLIDER */}
        <div className="relative w-full h-[450px] rounded-[2.5rem] overflow-hidden group border border-white/5 shadow-2xl bg-black/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <img
                src={finalHeroSlides[currentSlide].image}
                className="w-full h-full object-cover"
                alt={finalHeroSlides[currentSlide].title}
              />
              {/* Refined Gradient: Lighter bottom, focused readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-80" />
            </motion.div>
          </AnimatePresence>

          {/* SLIDER HUD - Vertically Centered / Top-Left Alignment */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 z-20 pointer-events-none">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-3xl pointer-events-auto"
            >
              {/* Soft Glass Backdrop for Text */}
              <div className="inline-block p-6 md:p-8 rounded-[2rem] bg-black/20 backdrop-blur-md border border-white/5">
                <span className="inline-block px-3 py-1 mb-4 rounded bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-300 text-[10px] font-mono font-bold uppercase tracking-widest backdrop-blur-md">
                  {finalHeroSlides[currentSlide].urgentTag}
                </span>

                <h2 className="text-4xl md:text-6xl font-clash font-extrabold text-white mb-4 leading-[1.1] tracking-tight drop-shadow-2xl">
                  {finalHeroSlides[currentSlide].title}
                </h2>

                <p className="text-white/90 text-lg md:text-xl max-w-xl font-sans leading-relaxed text-balance drop-shadow-md">
                  {finalHeroSlides[currentSlide].subtitle}
                </p>
                <button
                  onClick={() => setSelectedNews(finalHeroSlides[currentSlide])}
                  className="mt-6 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-clash font-bold text-xs uppercase tracking-widest transition-all backdrop-blur-xl pointer-events-auto"
                >
                  Intercept Signal
                </button>
              </div>
            </motion.div>
          </div>

          {/* PROGRESS BAR (HUD STYLE) */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-30">
            <motion.div
              key={`progress-${currentSlide}`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 6, ease: "linear" }}
              className="h-full bg-gradient-to-r from-fuchsia-500 to-violet-500 shadow-[0_0_20px_#d946ef]"
            />
          </div>

          {/* Manual Trigger Zones */}
          <div
            className="absolute inset-y-0 left-0 w-1/4 z-10 cursor-w-resize pointer-events-auto"
            onClick={() =>
              setCurrentSlide(
                (prev) =>
                  (prev - 1 + finalHeroSlides.length) % finalHeroSlides.length,
              )
            }
          />
          <div
            className="absolute inset-y-0 right-0 w-1/4 z-10 cursor-e-resize pointer-events-auto"
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % finalHeroSlides.length)
            }
          />
        </div>
      </div>

      {/* SECTION II: CATEGORY TABS & SEARCH */}
      <div className="px-4 md:px-8 max-w-6xl mx-auto mb-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest transition-all backdrop-blur-md border",
                  activeCategory === cat
                    ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10",
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* SEARCH BAR */}
          <div className="relative w-full max-w-2xl">
            <span className="absolute inset-y-0 left-4 flex items-center text-slate-500">
              <Clock size={16} />
            </span>
            <input
              type="text"
              placeholder="Filter signals by keywords... (e.g. 'shuttle', 'recruitment')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-mono text-xs uppercase tracking-wider focus:outline-none focus:border-fuchsia-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* SECTION III: MULTI-DENSITY GRID (BENTO 2.0) */}
      <div className="px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* MAIN FEED (Left Column - 8 Cols ~66%) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {feedItems.length > 0 ? (
              feedItems.map((news) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative h-[320px] md:h-[380px] rounded-[2.5rem] overflow-hidden bg-black/40 backdrop-blur-lg border border-white/10 hover:border-white/30 transition-all duration-300"
                >
                  <img
                    src={news.image}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                    alt={news.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

                  <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-center items-start">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="px-3 py-1 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[9px] font-mono font-bold uppercase tracking-widest">
                        {news.category}
                      </span>
                      <span className="text-slate-400 text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-2">
                        <Clock size={10} /> SIGNAL RECEIVED: {news.signalTime}
                      </span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-clash font-bold text-white mb-4 max-w-xl leading-tight">
                      {news.title}
                    </h3>
                    <p className="text-slate-300 text-base md:text-lg max-w-lg mb-8 line-clamp-2 font-sans">
                      {news.description}
                    </p>

                    <button
                      onClick={() => setSelectedNews(news)}
                      className="px-6 py-3 rounded-xl bg-white text-black font-clash font-bold text-xs uppercase tracking-widest hover:bg-fuchsia-400 hover:scale-105 transition-all flex items-center gap-2"
                    >
                      View Details <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] rounded-[2.5rem] border border-dashed border-white/10 text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">
                <Zap className="mb-4 text-fuchsia-500/20" size={40} />
                No signals found in this frequency.
              </div>
            )}

            {!showAllFeed && mainFeed.length > 3 && (
              <button
                onClick={() => setShowAllFeed(true)}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-mono text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all"
              >
                Load More Signals
              </button>
            )}
          </div>

          {/* SIDEBAR FEED (Right Column - 4 Cols ~33%) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* CAMPUS CALENDAR - Compressed */}
            <div className="p-5 rounded-[2.5rem] bg-white/5 backdrop-blur-lg border border-white/10 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-3 w-full px-1">
                <CalendarDays size={14} className="text-fuchsia-400" />
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">
                  Campus Calendar
                </span>
              </div>

              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-xl border border-white/10 bg-black/40 text-slate-200 p-2 w-full"
              />
            </div>

            {/* QUICK SIGNALS BUNDLE */}
            <div className="rounded-[2.5rem] bg-white/5 backdrop-blur-lg border border-white/10 overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2 bg-white/5">
                <Zap size={14} className="text-fuchsia-500" />
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Quick Signals
                </span>
              </div>

              <div className="flex flex-col">
                {quickUpdates.length > 0 ? (
                  quickUpdates.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className={cn(
                        "p-5 hover:bg-white/5 transition-colors cursor-pointer group",
                        index !== quickUpdates.length - 1 &&
                          "border-b border-white/5",
                      )}
                      onClick={() => {
                        const original = broadcasts.find(
                          (b) => b._id === item.id,
                        );
                        setSelectedNews(original);
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={cn(
                            "text-[9px] font-mono font-bold uppercase tracking-widest",
                            item.category === "CAMPUS ALERT"
                              ? "text-rose-400"
                              : "text-fuchsia-400",
                          )}
                        >
                          {item.category}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">
                          {item.time}
                        </span>
                      </div>
                      <h4 className="text-base font-clash font-medium text-white group-hover:text-fuchsia-200 transition-colors leading-snug">
                        {item.title}
                      </h4>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-10 text-center text-[10px] font-mono text-slate-600 uppercase">
                    Frequency Clear
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedNews && (
          <NewsDetailModal
            news={selectedNews}
            onClose={() => setSelectedNews(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default News;
