import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const MissionLogCard = ({ event, index, onReview }) => {
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
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
            <span className="text-xs font-medium text-emerald-500/80 uppercase tracking-wider">
              Completed
            </span>
          </div>

          {/* Review Button */}
          <button
            onClick={() => onReview(event)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300",
              "bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 hover:border-white/20",
              "group/btn",
            )}
          >
            <MessageSquare className="w-4 h-4 group-hover/btn:text-fuchsia-400 transition-colors" />
            <span>Mission Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionLogCard;
