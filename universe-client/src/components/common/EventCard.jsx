import React from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

const EventCard = ({ event, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), {
    stiffness: 150,
    damping: 15,
  });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), {
    stiffness: 150,
    damping: 15,
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 200);
    y.set(yPct * 200);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-panel rounded-2xl overflow-hidden group hover:border-accent/30 transition-all duration-300 relative perspective-1000"
    >
      <Link
        to={`/events/${event._id || event.id}`}
        className="block h-full cursor-pointer"
      >
        <div className="relative h-48 overflow-hidden transform-style-3d">
          {/* Placeholder image related to 'universe' or 'tech' - using a gradient for now as fallback */}
          <div className="absolute inset-0 bg-gradient-to-br from-nebula via-purple-900/40 to-black group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border border-white/10 z-10">
            {event.category || "General"}
          </div>
        </div>

        <div className="p-6 transform-style-3d">
          <h3 className="text-xl font-bold font-neuemontreal mb-2 group-hover:text-accent transition-colors truncate transform-z-20">
            {event.title}
          </h3>
          <p className="text-starlight/60 text-sm mb-4 line-clamp-2 transform-z-10">
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
              <span>{event.location || event.venue?.name || "Online"}</span>
            </div>
          </div>

          <div className="w-full py-3 rounded-xl bg-white/5 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-indigo-600 group-hover:text-white border border-white/10 group-hover:border-violet-500 transition-all duration-300 flex items-center justify-center gap-2 font-medium transform-z-30 shadow-lg shadow-transparent group-hover:shadow-violet-500/25">
            View Details
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
