import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BackgroundGradient } from "@/components/ui/shadcn-io/background-gradient";
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
      <BackgroundGradient className="rounded-[22px] h-full bg-card border border-border overflow-hidden p-0">
        <Link
          to={`/events/${event._id || event.id}`}
          className="block h-full relative z-10 flex flex-col"
        >
          <div className="relative h-48 overflow-hidden bg-muted flex-shrink-0">
            {/* Event Image or Placeholder */}
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />

            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1.5 border border-border shadow-sm rounded-full">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                {category}
              </span>
            </div>
          </div>

          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-lg font-black font-inter mb-3 text-card-foreground group-hover:text-primary transition-colors truncate">
              {event.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">
              {event.description ||
                "Join us for an amazing experience where we explore the depths of this topic."}
            </p>

            <div className="space-y-3 mb-6 border-l-2 border-border pl-4">
              <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-muted-foreground/80">
                <Calendar size={14} className="text-primary" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-muted-foreground/80">
                <Clock size={14} className="text-primary" />
                <span>{formattedTime}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-muted-foreground/80">
                <MapPin size={14} className="text-primary" />
                <span>{event.location || event.venue?.name || "Online"}</span>
              </div>
            </div>

            <div className="w-full py-3 bg-muted/50 border border-border flex items-center justify-center gap-2 text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-all duration-300 rounded-lg">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">
                [ VIEW DETAILS ]
              </span>
            </div>
          </div>
        </Link>
      </BackgroundGradient>
    </motion.div>
  );
};

export default EventCard;
