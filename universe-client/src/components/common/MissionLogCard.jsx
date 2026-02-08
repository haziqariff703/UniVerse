import React from "react";
import { Calendar, MapPin, Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const MissionLogCard = ({ event, onReview }) => {
  return (
    <div className="group relative w-full bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-white/10 transition-all duration-300">
      {/* 1. Image Section (Desaturated) */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-105"
        />

        {/* Date Badge */}
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span className="text-xs font-mono text-slate-300">{event.date}</span>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-6 relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold font-clash text-slate-300 group-hover:text-white transition-colors mb-1">
              {event.title}
            </h3>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{event.venue.name}</span>
            </div>
          </div>
        </div>

        {/* 3. Action Rail */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
          {/* Status Indicator & Rating */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
              <span className="text-xs font-medium text-emerald-500/80 uppercase tracking-wider">
                Completed
              </span>
            </div>
            {event.review && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3 h-3",
                        i < event.review.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-600",
                      )}
                    />
                  ))}
                </div>
                {/* Visual Evidence Preview */}
                {event.review.photos && event.review.photos.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {event.review.photos.slice(0, 3).map((photo, idx) => {
                      const baseUrl = "http://localhost:5000";
                      const fullUrl = photo.startsWith("http")
                        ? photo
                        : `${baseUrl}${photo.startsWith("/") ? photo : "/" + photo}`;
                      return (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded-lg overflow-hidden border border-white/10"
                        >
                          <img
                            src={fullUrl}
                            alt="Visual Evidence"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Review Button */}
          <button
            onClick={() => onReview(event)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300",
              event.review
                ? "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 hover:bg-fuchsia-500/20"
                : "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 hover:border-white/20",
              "group/btn",
            )}
          >
            <MessageSquare
              className={cn(
                "w-4 h-4 transition-colors",
                event.review
                  ? "text-fuchsia-400"
                  : "group-hover/btn:text-fuchsia-400",
              )}
            />
            <span>{event.review ? "View Report" : "Mission Report"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionLogCard;
