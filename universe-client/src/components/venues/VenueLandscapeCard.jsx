import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  ArrowRight,
  Wind,
  Wifi,
  Monitor,
  Mic2,
  MapPin,
  Layout,
  CheckCircle2,
  Plug,
  PenTool,
  Speaker,
  Heart,
  Navigation,
} from "lucide-react";
import { getLiveVenueStatus } from "@/data/liveVenueStatus";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { cn } from "@/lib/utils";

const facilityIconMap = {
  AC: <Wind className="w-3.5 h-3.5" />,
  Wifi: <Wifi className="w-3.5 h-3.5" />,
  Projector: <Monitor className="w-3.5 h-3.5" />,
  "PA System": <Mic2 className="w-3.5 h-3.5" />,
  Stage: <Layout className="w-3.5 h-3.5" />,
  "Sound System": <Speaker className="w-3.5 h-3.5" />,
  "Power Outlets": <Plug className="w-3.5 h-3.5" />,
  Whiteboard: <PenTool className="w-3.5 h-3.5" />,
  default: <CheckCircle2 className="w-3.5 h-3.5" />,
};

const VenueLandscapeCard = ({ venue, index, user }) => {
  const {
    id,
    name,
    location_code,
    max_capacity,
    image,
    facilities,
    description,
    bestFor,
    glowColor,
    type,
    occupancyStatus = "Available", // Default for safety
    liveOccupancy = 0,
    nextAvailable = "Now",
  } = venue;

  const [isFavorited, setIsFavorited] = React.useState(false);
  const [showMap, setShowMap] = useState(false);
  const liveStatus = React.useMemo(() => getLiveVenueStatus(venue), [venue]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const favorites = JSON.parse(
      localStorage.getItem("user_favorites") || "[]",
    );
    setIsFavorited(favorites.includes(id));
  }, [id]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const favorites = JSON.parse(
      localStorage.getItem("user_favorites") || "[]",
    );
    let newFavorites;
    if (favorites.includes(id)) {
      newFavorites = favorites.filter((fid) => fid !== id);
    } else {
      newFavorites = [...favorites, id];
    }
    localStorage.setItem("user_favorites", JSON.stringify(newFavorites));
    setIsFavorited(!isFavorited);
  };

  // Calculate capacity percentage for the gauge
  const capacityPercentage = Math.min((max_capacity / 1000) * 100, 100);

  const accentColor = glowColor === "cyan" ? "bg-cyan-500" : "bg-purple-500";
  const glowShadow =
    glowColor === "cyan"
      ? "shadow-[0_0_15px_rgba(6,182,212,0.5)]"
      : "shadow-[0_0_15px_rgba(168,85,247,0.5)]";
  const borderGlow =
    glowColor === "cyan"
      ? "h-[1.5px] w-[1.5px] bg-cyan-400"
      : "h-[1.5px] w-[1.5px] bg-purple-400";

  return (
    <div className="group relative">
      <div className="relative p-[1px] rounded-[2.5rem] group overflow-hidden">
        <MovingBorderButton
          borderRadius="2.5rem"
          as="div"
          containerClassName="h-auto w-full rounded-[2.5rem]"
          borderClassName={borderGlow}
          duration={index % 2 === 0 ? 3500 : 4500}
          className="bg-slate-950/60 backdrop-blur-2xl border-none flex flex-col md:flex-row overflow-hidden text-left items-stretch rounded-[2.5rem] h-auto md:min-h-[16rem]"
        >
          {/* Left Side: COMPACT CINEMA IMAGE */}
          <div className="relative w-full md:w-[35%] aspect-[16/9] md:aspect-auto md:h-auto z-10 overflow-hidden bg-zinc-900 border-r border-white/5">
            {/* IMAGE */}
            <img
              src={image}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Elegant Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-[20]" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-[21]" />

            {/* Location Badge - Floating Top Left */}
            <div className="absolute top-4 left-4 z-[30]">
              <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 shadow-xl flex items-center gap-2">
                <MapPin className="w-3 h-3 text-fuchsia-400" />
                <span className="text-[10px] font-mono font-bold text-white tracking-wider">
                  {location_code}
                </span>
              </div>
            </div>

            {/* Type Badge - Floating Bottom Left */}
            <div className="absolute bottom-4 left-4 z-[30]">
              <span className="text-[10px] font-clash font-bold text-white/90 bg-fuchsia-500/80 px-2 py-0.5 rounded shadow-lg uppercase tracking-widest">
                {type}
              </span>
            </div>

            {/* FAVORITE HEART */}
            <button
              onClick={toggleFavorite}
              className="absolute top-4 right-16 z-[30] p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 hover:bg-white/10 transition-all group/heart"
            >
              <motion.div animate={isFavorited ? { scale: [1, 1.4, 1] } : {}}>
                <Heart
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isFavorited
                      ? "fill-fuchsia-500 text-fuchsia-500"
                      : "text-white group-hover/heart:text-fuchsia-400",
                  )}
                />
              </motion.div>
            </button>

            {/* LIVE STATUS - Floating Top Right */}
            <div className="absolute top-4 right-4 z-[30]">
              <div className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-full border border-white/10 shadow-xl flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    liveStatus.isOccupied ? "bg-rose-500" : "bg-emerald-500",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-mono font-bold tracking-wider uppercase",
                    liveStatus.isOccupied
                      ? "text-rose-400"
                      : "text-emerald-400",
                  )}
                >
                  {liveStatus.status}
                </span>
              </div>
            </div>

            {/* SMART TIMER OVERLAY (NASA STYLE) */}
            <div className="absolute bottom-4 right-4 z-[30]">
              <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex flex-col items-end">
                <span className="text-[8px] font-black uppercase tracking-tighter text-slate-500 font-mono">
                  {liveStatus.timerLabel}
                </span>
                <span className="text-xs font-mono font-bold text-white tabular-nums">
                  {liveStatus.timeRemaining}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: MINIMALIST INFO PANEL */}
          <div className="flex-1 p-5 md:p-6 flex flex-col justify-between gap-4">
            {/* Header Section */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl md:text-3xl font-clash font-semibold text-white group-hover:text-fuchsia-400 transition-colors tracking-tight leading-none">
                  {name}
                </h3>

                {/* CROWD DENSITY BAR */}
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">
                      Live Vibe
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-mono font-bold",
                        liveStatus.occupancy > 70
                          ? "text-rose-400"
                          : "text-emerald-400",
                      )}
                    >
                      {liveStatus.occupancy}% Full
                    </span>
                  </div>
                  <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${liveStatus.occupancy}%` }}
                      className={cn(
                        "h-full",
                        liveStatus.occupancy > 70
                          ? "bg-gradient-to-r from-orange-500 to-rose-500"
                          : "bg-gradient-to-r from-emerald-500 to-cyan-500",
                      )}
                    />
                  </div>
                </div>
              </div>

              <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-light opacity-80 max-w-2xl font-sans line-clamp-1 md:line-clamp-2 mt-2">
                {description}
              </p>
            </div>

            {/* Footer Section: Amenities & Action */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-auto border-t border-white/5 pt-4">
              {/* Amenities - Condensed Grid */}
              <div className="flex flex-wrap gap-2 md:max-w-[65%]">
                {facilities.slice(0, 5).map((facility, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default"
                  >
                    <div
                      className={cn(
                        "text-slate-500",
                        glowColor === "cyan"
                          ? "text-cyan-400"
                          : "text-fuchsia-400",
                      )}
                    >
                      {React.cloneElement(
                        facilityIconMap[facility] || facilityIconMap.default,
                        { className: "w-3 h-3" },
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-medium font-clash">
                      {facility}
                    </span>
                  </div>
                ))}
                {facilities.length > 5 && (
                  <div className="px-2 py-1 rounded bg-white/5 border border-white/5">
                    <span className="text-[9px] text-slate-500 font-medium">
                      +{facilities.length - 5}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={() => setShowMap(true)}
                  className="group/nav relative px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-clash font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center flex-1"
                >
                  <Navigation className="w-3.5 h-3.5 mr-2 group-hover/nav:rotate-12 transition-transform" />
                  <span>Navigate</span>
                </button>

                <div
                  onClick={(e) => {
                    // RESTRICTION: Redirect public users to login
                    if (!user) {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate("/login");
                    }
                  }}
                  className="flex-1"
                >
                  <Link
                    to={user ? `/venues/${id}` : "#"}
                    className="group/btn relative px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 border border-white/20 text-white font-clash font-bold text-[10px] md:text-xs uppercase tracking-[0.15em] transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] flex items-center justify-center w-full"
                  >
                    <span>Check Availability</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    {/* Border Beam Effect */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </MovingBorderButton>
      </div>

      {/* NAVIGATION MODAL (2D MAP) */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowMap(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-[2rem] p-2 max-w-lg w-full shadow-2xl overflow-hidden relative"
            >
              <div className="relative aspect-video rounded-[1.5rem] overflow-hidden group/map">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800"
                  className="w-full h-full object-cover grayscale opacity-50 group-hover/map:opacity-80 transition-all duration-700"
                  alt="Campus Map"
                />
                {/* Pulse Beacon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-fuchsia-500 rounded-full animate-ping opacity-75" />
                  <div className="absolute inset-0 m-auto w-3 h-3 bg-fuchsia-400 rounded-full shadow-[0_0_20px_rgba(217,70,239,1)]" />
                </div>
                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <p className="text-white font-clash font-bold text-sm">
                    Target: {name}
                  </p>
                  <p className="text-slate-400 text-xs font-mono">
                    {liveStatus.timeRemaining
                      ? `Arrival in 5 mins`
                      : `Standard Route`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMap(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <ArrowRight className="w-5 h-5 rotate-45" />{" "}
                {/* Close/Exit Icon style */}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VenueLandscapeCard;
