import React from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";

const EventCard = ({ event, index }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className="group relative border border-slate-800 bg-white/5 overflow-hidden rounded-sm hover:border-slate-600 transition-colors duration-500"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-sm opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(124, 58, 237, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <Link
        to={`/events/${event._id || event.id}`}
        className="block h-full relative z-10"
      >
        <div className="relative h-48 overflow-hidden bg-black/40">
          {/* Noise/Abstract Placeholder Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />

          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300">
              {event.category || "General"}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-black font-inter mb-3 text-white group-hover:text-purple-400 transition-colors truncate">
            {event.title}
          </h3>
          <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
            {event.description ||
              "Join us for an amazing experience where we explore the depths of this topic."}
          </p>

          <div className="space-y-3 mb-6 border-l-2 border-slate-800 pl-4">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-slate-400">
              <Calendar size={14} className="text-purple-500" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-slate-400">
              <Clock size={14} className="text-purple-500" />
              <span>{event.time || "TBA"}</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-slate-400">
              <MapPin size={14} className="text-purple-500" />
              <span>{event.location || event.venue?.name || "Online"}</span>
            </div>
          </div>

          <div className="w-full py-3 bg-white/5 border border-white/5 flex items-center justify-center gap-2 text-slate-400 group-hover:text-white group-hover:border-purple-500/30 transition-all duration-300">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">
              [ VIEW DETAILS ]
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
