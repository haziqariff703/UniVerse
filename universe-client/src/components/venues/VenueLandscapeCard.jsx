import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
} from "lucide-react";
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

const VenueLandscapeCard = ({ venue, index }) => {
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
    type, // Ensure type is destructured
  } = venue;

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
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="relative p-[1px] rounded-3xl group overflow-hidden">
        <MovingBorderButton
          borderRadius="1rem"
          as="div"
          containerClassName="h-auto w-full rounded-2xl"
          borderClassName={borderGlow}
          duration={index % 2 === 0 ? 3500 : 4500}
          className="bg-slate-950/60 backdrop-blur-2xl border-none flex flex-col md:flex-row overflow-hidden text-left items-stretch rounded-2xl h-auto md:min-h-[16rem]"
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
          </div>

          {/* Right Side: MINIMALIST INFO PANEL */}
          <div className="flex-1 p-5 md:p-6 flex flex-col justify-between gap-4">
            {/* Header Section */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl md:text-3xl font-clash font-semibold text-white group-hover:text-fuchsia-400 transition-colors tracking-tight leading-none">
                  {name}
                </h3>
                {/* Capacity Pille */}
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] font-mono font-medium text-slate-300">
                    {max_capacity}
                  </span>
                </div>
              </div>

              <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-light opacity-80 max-w-2xl font-sans line-clamp-2 md:line-clamp-3 mb-4">
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

              <Link
                to={`/venues/${id}`}
                className="group/btn relative px-6 py-2.5 rounded-xl bg-white text-black font-clash font-bold text-[10px] md:text-xs uppercase tracking-[0.15em] transition-all hover:bg-fuchsia-400 hover:text-white hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] shadow-lg active:scale-95 flex items-center justify-center md:w-auto w-full"
              >
                <span>Experiences</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        </MovingBorderButton>
      </div>
    </motion.div>
  );
};

export default VenueLandscapeCard;
