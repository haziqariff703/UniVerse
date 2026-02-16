import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Target, Sparkles, Map } from "lucide-react";
import { Link } from "react-router-dom";

const HeroEventCard = ({ event }) => {
  if (!event) return null;

  return (
    <div className="relative w-full h-[500px] rounded-3xl overflow-hidden group">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />

        {/* Dynamic Glow based on Theme */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${event.theme === "cyan" ? "from-cyan-900/30" : "from-purple-900/30"} to-transparent mix-blend-overlay`}
        />
      </div>

      {/* Content Container */}
      <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end items-start z-10">
        {/* Badges Row */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-bold font-clash tracking-wide border backdrop-blur-md ${
              event.theme === "cyan"
                ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-300"
                : "bg-purple-500/10 border-purple-400/30 text-purple-300"
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Featured Event
          </span>
          <span className="px-4 py-1.5 rounded-full text-sm font-medium font-clash bg-white/10 border border-white/10 text-white backdrop-blur-md">
            <Target className="w-4 h-4 inline mr-2" />
            {event.target}
          </span>
          <span className="px-4 py-1.5 rounded-full text-sm font-medium font-clash bg-white/10 border border-white/10 text-emerald-300 backdrop-blur-md">
            {event.benefit}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold font-clash text-white mb-4 leading-tight max-w-4xl tracking-tight">
          {event.title}
        </h1>

        {/* Description */}
        <p className="text-slate-300 text-lg md:text-xl font-medium font-clash max-w-2xl mb-8 leading-relaxed">
          {event.description}
        </p>

        {/* Details and Action */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full md:w-auto">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-slate-300">
              <Calendar
                className={`w-5 h-5 ${event.theme === "cyan" ? "text-cyan-400" : "text-purple-400"}`}
              />
              <span className="font-clash text-lg">
                {event.date} • {event.time}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 relative group/venue cursor-help">
              <MapPin
                className={`w-5 h-5 ${event.theme === "cyan" ? "text-cyan-400" : "text-purple-400"}`}
              />
              <span className="font-clash text-lg group-hover/venue:text-white transition-colors">
                {event.venue.name}
              </span>
              <Map className="w-4 h-4 ml-1 opacity-0 group-hover/venue:opacity-100 transition-opacity text-slate-400" />
            </div>
          </div>

          <div className="flex-grow md:flex-grow-0 md:ml-auto">
            <Link to={`/events/${event.id}`} className="block">
              <button
                className={`relative px-8 py-4 rounded-xl font-bold font-clash text-lg transition-all duration-300 overflow-hidden group/btn ${
                  event.theme === "cyan"
                    ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                    : "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
                }`}
              >
                <span className="relative z-10">Register Interest</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroEventCard;
