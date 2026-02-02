import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Target,
  Sparkles,
  Map,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const FeaturedEventSlider = ({ events, user, isSmall = false }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  }, [events.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  }, [events.length]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide, isHovered]);

  if (!events || events.length === 0) return null;

  const currentEvent = events[currentIndex];

  return (
    <div
      className={cn(
        "relative w-full rounded-[2.5rem] overflow-hidden group",
        isSmall ? "h-[300px] md:h-[350px]" : "h-[450px] md:h-[500px]",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={currentEvent.image}
              alt={currentEvent.title}
              className="w-full h-full object-cover"
            />
            {/* Dark Cinematic Overlays */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Galaxy Fade: Transparent to Slate-950 */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Theme-based side glow */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-r to-transparent mix-blend-overlay opacity-50",
                currentEvent.theme === "cyan"
                  ? "from-cyan-900/60"
                  : "from-purple-900/60",
              )}
            />
          </div>

          {/* Frosted Glass Content Container */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col justify-end items-start z-10",
              isSmall ? "p-5 md:p-8" : "p-8 md:p-16",
            )}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={cn(
                "backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden",
                isSmall ? "p-5 md:p-6 max-w-2xl" : "p-8 md:p-10 max-w-4xl",
              )}
            >
              {/* Subtle inner glow for the glass card */}
              <div
                className={cn(
                  "absolute -top-24 -left-24 w-48 h-48 blur-[80px] rounded-full opacity-20",
                  currentEvent.theme === "cyan"
                    ? "bg-cyan-400"
                    : "bg-purple-400",
                )}
              />

              {/* Badges Row */}
              <div
                className={cn(
                  "flex flex-wrap gap-2 mb-3 relative z-10",
                  !isSmall && "mb-6 gap-3",
                )}
              >
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] md:text-xs font-bold font-clash tracking-widest uppercase border backdrop-blur-md",
                    !isSmall && "px-4 py-1.5",
                    currentEvent.theme === "cyan"
                      ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-300"
                      : "bg-purple-500/10 border-purple-400/30 text-purple-300",
                  )}
                >
                  <Sparkles className="w-3 h-3 inline mr-1.5 mb-0.5" />
                  Featured
                </span>
                {!isSmall && (
                  <>
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold font-clash bg-white/5 border border-white/10 text-white/80 tracking-widest uppercase backdrop-blur-md">
                      <Target className="w-3.5 h-3.5 inline mr-2 mb-0.5" />
                      {currentEvent.target}
                    </span>
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold font-clash bg-white/5 border border-white/10 text-emerald-400/90 tracking-widest uppercase backdrop-blur-md">
                      {currentEvent.benefit}
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1
                className={cn(
                  "font-bold font-clash text-white leading-tight tracking-tighter relative z-10",
                  isSmall
                    ? "text-2xl md:text-3xl mb-3"
                    : "text-4xl md:text-5xl mb-4",
                )}
              >
                {currentEvent.title}
              </h1>

              {/* Description */}
              {!isSmall && (
                <p className="text-slate-300 text-base md:text-lg font-medium font-clash max-w-2xl mb-6 leading-relaxed relative z-10 opacity-90">
                  {currentEvent.description}
                </p>
              )}

              {/* Details and Action Row */}
              <div
                className={cn(
                  "flex flex-col md:flex-row items-start md:items-center w-full relative z-10",
                  isSmall ? "gap-4" : "gap-8",
                )}
              >
                <div className="flex flex-col gap-2 md:gap-3">
                  <div className="flex items-center gap-2 md:gap-3 text-slate-300">
                    <Calendar
                      className={cn(
                        isSmall ? "w-4 h-4" : "w-5 h-5",
                        currentEvent.theme === "cyan"
                          ? "text-cyan-400"
                          : "text-purple-400",
                      )}
                    />
                    <span
                      className={cn(
                        "font-clash font-semibold",
                        isSmall ? "text-sm md:text-base" : "text-lg",
                      )}
                    >
                      {currentEvent.date}{" "}
                      <span className="mx-1 opacity-30">•</span>{" "}
                      {currentEvent.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-slate-300 group/venue cursor-pointer">
                    <MapPin
                      className={cn(
                        isSmall ? "w-4 h-4" : "w-5 h-5",
                        currentEvent.theme === "cyan"
                          ? "text-cyan-400"
                          : "text-purple-400",
                      )}
                    />
                    <span
                      className={cn(
                        "font-clash group-hover:text-white transition-colors border-b border-transparent group-hover:border-white/20",
                        isSmall ? "text-sm md:text-base" : "text-lg",
                      )}
                    >
                      {currentEvent.venue.name}
                    </span>
                  </div>
                </div>

                <div className="md:ml-auto">
                  <div
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate("/login");
                      }
                    }}
                  >
                    <Link
                      to={user ? `/events/${currentEvent.id}` : "#"}
                      className="block"
                    >
                      <button
                        className={cn(
                          "relative rounded-xl font-bold font-clash transition-all duration-300 overflow-hidden group/btn shadow-2xl",
                          isSmall
                            ? "px-6 py-2.5 text-sm"
                            : "px-8 py-3 text-base md:text-lg",
                          currentEvent.theme === "cyan"
                            ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20"
                            : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20",
                        )}
                      >
                        <span className="relative z-10">
                          {isSmall
                            ? "Details"
                            : currentEvent.isRegistered
                              ? "You're Going"
                              : "Register Interest"}
                        </span>
                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/70 hover:text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-300 opacity-0 group-hover:opacity-100",
          isSmall ? "left-2 md:left-4 p-2" : "left-4 md:left-8 p-4",
          "hidden md:flex items-center justify-center",
        )}
      >
        <ChevronLeft className={isSmall ? "w-4 h-4" : "w-6 h-6"} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 z-30 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/70 hover:text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-300 opacity-0 group-hover:opacity-100",
          isSmall ? "right-2 md:right-4 p-2" : "right-4 md:right-8 p-4",
          "hidden md:flex items-center justify-center",
        )}
      >
        <ChevronRight className={isSmall ? "w-4 h-4" : "w-6 h-6"} />
      </button>

      {/* Navigation Dots */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full bg-black/20 backdrop-blur-md border border-white/5",
          isSmall ? "bottom-5 px-3 py-1.5" : "bottom-10 px-6 py-3",
        )}
      >
        {events.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "rounded-full transition-all duration-500 relative",
              isSmall ? "w-1.5 h-1.5" : "w-2.5 h-2.5",
              currentIndex === idx
                ? cn(
                    isSmall ? "w-5" : "w-8",
                    events[idx].theme === "cyan"
                      ? "bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                      : "bg-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.8)]",
                  )
                : "bg-white/20 hover:bg-white/40",
            )}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedEventSlider;
