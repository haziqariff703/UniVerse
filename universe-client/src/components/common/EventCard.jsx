import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Target,
  Award,
  Map,
} from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";

const EventCard = ({ event, index }) => {
  // Determine Theme
  const isFPM =
    event.theme === "cyan" ||
    event.organizer?.name?.includes("FPM") ||
    event.organizer?.name?.includes("IMSA");
  const themeColor = isFPM ? "cyan" : "purple";

  // Spotlight Color
  const spotlightColor = isFPM
    ? "rgba(6, 182, 212, 0.25)" // Cyan
    : "rgba(168, 85, 247, 0.4)"; // Purple

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full relative group"
    >
      <Spotlight
        spotlightColor={spotlightColor}
        className="h-full rounded-2xl border border-slate-800 bg-slate-950/50 backdrop-blur-sm overflow-hidden"
      >
        <Link
          to={`/events/${event.id}`}
          className="block h-full relative z-10 flex flex-col"
        >
          {/* Image Section */}
          <div className="relative h-56 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-90" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {event.target && (
                <span className="px-3 py-1 rounded-full text-xs font-bold font-clash bg-black/50 border border-white/10 text-white backdrop-blur-md flex items-center gap-1.5 w-fit">
                  <Target size={12} className={`text-${themeColor}-400`} />
                  {event.target}
                </span>
              )}
            </div>

            <div className="absolute top-4 right-4">
              {event.benefit && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold font-clash backdrop-blur-md border flex items-center gap-1.5 ${
                    isFPM
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                      : "bg-purple-500/10 border-purple-500/30 text-purple-300"
                  }`}
                >
                  <Award size={12} />
                  {event.benefit}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-grow relative">
            {/* Title */}
            <h3
              className={`text-2xl font-bold font-clash mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300 ${
                isFPM
                  ? "from-cyan-400 to-blue-400"
                  : "from-purple-400 to-pink-400"
              }`}
            >
              {event.title}
            </h3>

            {/* Meta Details */}
            <div className="space-y-3 mb-6 flex-grow">
              <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
                <Calendar size={16} className={`text-${themeColor}-400`} />
                <span className="font-clash text-sm font-medium">
                  {event.date}
                </span>
              </div>

              {/* Venue with Satellite Icon */}
              <div
                className="flex items-center gap-3 text-slate-400 group-hover:text-white transition-colors cursor-pointer"
                title="View on Campus Map"
              >
                <MapPin size={16} className={`text-${themeColor}-400`} />
                <span className="font-clash text-sm font-medium truncate pr-2">
                  {event.venue?.name}
                </span>
                <Map
                  size={14}
                  className="ml-auto opacity-50 group-hover:opacity-100"
                />
              </div>
            </div>

            {/* Action Row */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs font-clash text-slate-500 uppercase tracking-wider">
                {event.organizer?.name}
              </span>

              <div
                className={`flex items-center gap-2 text-sm font-bold font-clash transition-all duration-300 ${
                  isFPM
                    ? "text-cyan-400 group-hover:text-cyan-300"
                    : "text-purple-400 group-hover:text-purple-300"
                }`}
              >
                View Details
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          </div>
        </Link>
      </Spotlight>
    </motion.div>
  );
};

export default EventCard;
