import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      {/* True Minimalist Card - Floating Dark Glass */}
      <div className="group h-full rounded-2xl bg-white/[2%] border border-white/[3%] overflow-hidden transition-all duration-500 hover:bg-white/[5%] hover:border-white/[8%] shadow-[0_0_80px_rgba(0,0,0,0.95)] hover:shadow-[0_0_100px_rgba(168,85,247,0.15)]">
        <Link
          to={`/events/${event._id || event.id}`}
          className="block h-full relative z-10 flex flex-col"
        >
          <div className="relative h-48 overflow-hidden flex-shrink-0">
            {/* Event Image or Placeholder */}
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black/60" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

            <div className="absolute top-4 right-4 bg-white/[5%] backdrop-blur-md px-3 py-1.5 border border-white/[5%] rounded-full">
              <span className="text-xs font-medium text-white/70">
                {category}
              </span>
            </div>
          </div>

          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-lg font-bold mb-3 text-white group-hover:text-purple-300 transition-colors truncate">
              {event.title}
            </h3>
            <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">
              {event.description ||
                "Join us for an amazing experience where we explore the depths of this topic."}
            </p>

            <div className="space-y-3 mb-6 border-l border-white/[5%] pl-4">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Calendar size={14} className="text-purple-400/70" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Clock size={14} className="text-purple-400/70" />
                <span>{formattedTime}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin size={14} className="text-purple-400/70" />
                <span>{event.location || event.venue?.name || "Online"}</span>
              </div>
            </div>

            <div className="w-full py-3 bg-white/[3%] border border-white/[3%] flex items-center justify-center gap-2 text-slate-400 group-hover:text-white group-hover:bg-white/[6%] group-hover:border-white/[6%] transition-all duration-300 rounded-xl">
              <span className="text-sm font-medium">View Details →</span>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;
