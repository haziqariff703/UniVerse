import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight, Zap, Clock, Calendar as CalendarIcon } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import { Calendar } from "@/components/ui/calendar";
import { UPCOMING_EVENTS, PAST_EVENTS } from "@/data/mockEvents";
import { getAllClubs } from "@/data/clubsData";

// --- DATA ADAPTERS ---
// Transform real data into "News" format

const clubs = getAllClubs();

// 1. HERO SLIDES (Mix of Major Events & Club Highlights)
const HERO_SLIDES = [
  {
    id: 2,
    title: "BLOCK 7: RENOVATION COMPLETE",
    urgentTag: "[CAMPUS ALERT: AREA OPEN]",
    subtitle:
      "New holodecks and study pods are now active. Access authorized for all students.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    category: "CAMPUS ALERT",
    date: "NOW",
  },
  // Use a real event for the 3rd slide
  {
    id: 3,
    title: (UPCOMING_EVENTS[0]?.title || "ACADEMIC EXCELLENCE").toUpperCase(),
    urgentTag: "[FEATURED EVENT]",
    subtitle:
      UPCOMING_EVENTS[0]?.description || "Join the academic revolution.",
    image:
      UPCOMING_EVENTS[0]?.image ||
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94",
    category: "ACADEMIC",
    date: "SOON",
  },
];

// 2. MAIN FEED (Top Stories from Events & Clubs)
const MAIN_FEED_NEWS = [
  // Event 1
  {
    id: 101,
    type: "feature",
    title: UPCOMING_EVENTS[1]?.title || "Fiesta Keusahawanan JPK",
    description:
      UPCOMING_EVENTS[1]?.description ||
      "A vibrant food festival featuring student vendors.",
    image:
      UPCOMING_EVENTS[1]?.image ||
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
    category: "EVENT HYPE",
    signalTime: "14:00 | TODAY",
  },
  // Club Spotlight
  {
    id: 102,
    type: "feature",
    title: `New Recruitment Drive: ${clubs[0]?.title || "IMSA"}`,
    description: `${clubs[0]?.tagline} Join the ${clubs[0]?.fullName} today and be part of the legacy.`,
    image:
      clubs[0]?.image ||
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    category: "CLUB NEWS",
    signalTime: "09:30 | YESTERDAY",
  },
  // Past Event Highlight
  {
    id: 103,
    type: "feature",
    title: "Recap: Neon Run Night Edition",
    description:
      "5KM night run with glow sticks and neon paint stations. See the full gallery now.",
    image: PAST_EVENTS[1]?.image?.startsWith("/")
      ? "https://images.unsplash.com/photo-1561912774-20d7ecd1e0ac?q=80&auto=format&fit=crop"
      : PAST_EVENTS[1]?.image, // Fallback for local path if needed, though most are unspash in mock
    category: "LIFESTYLE",
    signalTime: "2 DAYS AGO",
  },
];

// 3. QUICK UPDATES (Mix of Alerts and Minor Events)
const QUICK_UPDATES = [
  {
    id: 201,
    title: "Library Hours Extended for Finals Week",
    category: "CAMPUS ALERT",
    time: "2H AGO",
  },
  {
    id: 202,
    title: `${UPCOMING_EVENTS[2]?.title || "Jasmine Harmony Night"} Registration Open`,
    category: "EVENT HYPE",
    time: "4H AGO",
  },
  {
    id: 203,
    title: "Shuttle Service Delayed (Route B)",
    category: "TRANSPORT",
    time: "5H AGO",
  },
  {
    id: 204,
    title: `${clubs[5]?.title || "CosArt"} Workshop Schedule Released`,
    category: "CLUB NEWS",
    time: "1D AGO",
  },
];

const CATEGORIES = [
  "ALL SIGNALS",
  "OFFICIAL SIGNALS",
  "CLUB NEWS",
  "CAMPUS ALERTS",
];

const News = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("ALL SIGNALS");
  const [date, setDate] = useState(new Date());

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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
                src={HERO_SLIDES[currentSlide].image}
                className="w-full h-full object-cover"
                alt={HERO_SLIDES[currentSlide].title}
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
                  {HERO_SLIDES[currentSlide].urgentTag}
                </span>

                <h2 className="text-4xl md:text-6xl font-clash font-extrabold text-white mb-4 leading-[1.1] tracking-tight drop-shadow-2xl">
                  {HERO_SLIDES[currentSlide].title}
                </h2>

                <p className="text-white/90 text-lg md:text-xl max-w-xl font-sans leading-relaxed text-balance drop-shadow-md">
                  {HERO_SLIDES[currentSlide].subtitle}
                </p>
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
                (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
              )
            }
          />
          <div
            className="absolute inset-y-0 right-0 w-1/4 z-10 cursor-e-resize pointer-events-auto"
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
            }
          />
        </div>
      </div>

      {/* SECTION II: CATEGORY TABS */}
      <div className="px-4 md:px-8 max-w-6xl mx-auto mb-10">
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
      </div>

      {/* SECTION III: MULTI-DENSITY GRID (BENTO 2.0) */}
      <div className="px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* MAIN FEED (Left Column - 8 Cols ~66%) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {MAIN_FEED_NEWS.map((news) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative h-[320px] md:h-[380px] rounded-[2.5rem] overflow-hidden bg-black/40 backdrop-blur-3xl border border-white/10 hover:border-white/30 transition-all duration-300"
              >
                <img
                  src={news.image}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
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

                  <button className="px-6 py-3 rounded-xl bg-white text-black font-clash font-bold text-xs uppercase tracking-widest hover:bg-fuchsia-400 hover:scale-105 transition-all flex items-center gap-2">
                    Read Full Article <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* SIDEBAR FEED (Right Column - 4 Cols ~33%) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* CAMPUS CALENDAR - Compressed */}
            <div className="p-5 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-3 w-full px-1">
                <CalendarIcon size={14} className="text-fuchsia-400" />
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">
                  Campus Calendar
                </span>
              </div>

              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-xl border border-white/10 bg-black/40 text-slate-200 p-2 transform scale-95"
              />
            </div>

            {/* QUICK SIGNALS BUNDLE */}
            <div className="rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2 bg-white/5">
                <Zap size={14} className="text-fuchsia-500" />
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Quick Updates
                </span>
              </div>

              <div className="flex flex-col">
                {QUICK_UPDATES.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={cn(
                      "p-5 hover:bg-white/5 transition-colors cursor-pointer group",
                      index !== QUICK_UPDATES.length - 1 &&
                        "border-b border-white/5",
                    )}
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
