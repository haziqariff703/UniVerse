import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";

const EventCard = ({ event, index }) => {
  // Handle both API schema (date_time) and mock data (date)
  const eventDate = event.date_time || event.date;
  const dateObj = eventDate ? new Date(eventDate) : null;
  const formattedDate =
    dateObj && !isNaN(dateObj)
      ? dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "TBA";
  const formattedTime =
    dateObj && !isNaN(dateObj)
      ? dateObj.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : event.time || "TBA";

  // Handle both tags array and category string
  const category = event.tags?.[0] || event.category || "General";

  // Determine faculty-based spotlight color
  const isTechEvent =
    category.toLowerCase().includes("tech") ||
    category.toLowerCase().includes("workshop") ||
    category.toLowerCase().includes("seminar");

  const isFiTAEvent =
    category.toLowerCase().includes("music") ||
    category.toLowerCase().includes("art") ||
    category.toLowerCase().includes("performance") ||
    category.toLowerCase().includes("theater") ||
    category.toLowerCase().includes("film");

  const spotlightColor = isTechEvent
    ? "rgba(6, 182, 212, 0.4)" // Cyan for Tech/FPM
    : isFiTAEvent
      ? "rgba(168, 85, 247, 0.4)" // Purple for FiTA
      : "rgba(139, 92, 246, 0.4)"; // Default violet

  const accentColor = isTechEvent ? "cyan" : isFiTAEvent ? "purple" : "violet";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <Spotlight spotlightColor={spotlightColor} className="group h-full">
        <Link
          to={`/events/${event._id || event.id}`}
          className="block h-full relative z-10 flex flex-col p-6"
        >
          {/* Image Section */}
          <div className="relative h-48 rounded-2xl overflow-hidden mb-6 flex-shrink-0">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  isTechEvent
                    ? "from-cyan-900/30 to-blue-900/30"
                    : isFiTAEvent
                      ? "from-purple-900/30 to-pink-900/30"
                      : "from-violet-900/30 to-indigo-900/30"
                }`}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

            {/* Category Badge */}
            <div
              className={`absolute top-4 right-4 bg-${accentColor}-500/20 backdrop-blur-md px-3 py-1.5 border border-${accentColor}-400/30 rounded-full`}
            >
              <span
                className={`text-xs font-clash font-semibold text-${accentColor}-200`}
              >
                {category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-grow">
            <h3 className="text-2xl font-clash font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
              {event.title}
            </h3>

            <p className="text-slate-300 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">
              {event.description ||
                "Join us for an amazing experience where we explore the depths of this topic."}
            </p>

            {/* Event Details */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Calendar size={16} className={`text-${accentColor}-400/80`} />
                <span className="font-clash">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Clock size={16} className={`text-${accentColor}-400/80`} />
                <span className="font-clash">{formattedTime}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin size={16} className={`text-${accentColor}-400/80`} />
                <span className="font-clash">
                  {event.location || event.venue?.name || "Online"}
                </span>
              </div>
            </div>

            {/* Ghost Button with Glow on Spotlight */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`w-full py-3 border rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                isTechEvent
                  ? "border-cyan-500/30 text-cyan-300 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  : isFiTAEvent
                    ? "border-purple-500/30 text-purple-300 group-hover:border-purple-400 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                    : "border-violet-500/30 text-violet-300 group-hover:border-violet-400 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              }`}
            >
              <span className="text-sm font-clash font-bold">View Details</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </motion.div>
          </div>
        </Link>
      </Spotlight>
    </motion.div>
  );
};

export default EventCard;
