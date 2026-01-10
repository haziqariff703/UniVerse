import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

const EventCard = ({ event, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="glass-panel rounded-2xl overflow-hidden group hover:border-accent/30 transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        {/* Placeholder image related to 'universe' or 'tech' - using a gradient for now as fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-nebula via-purple-900/40 to-black group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border border-white/10">
          {event.category || "General"}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold font-neuemontreal mb-2 group-hover:text-accent transition-colors truncate">
          {event.title}
        </h3>
        <p className="text-starlight/60 text-sm mb-4 line-clamp-2">
          {event.description ||
            "Join us for an amazing experience where we explore the depths of this topic."}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-starlight/80">
            <Calendar size={16} className="text-accent" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-starlight/80">
            <Clock size={16} className="text-accent" />
            <span>{event.time || "TBA"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-starlight/80">
            <MapPin size={16} className="text-accent" />
            <span>{event.location || "Online"}</span>
          </div>
        </div>

        <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-accent hover:text-white border border-white/10 hover:border-accent transition-all duration-300 flex items-center justify-center gap-2 font-medium">
          View Details
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </motion.div>
  );
};

export default EventCard;
