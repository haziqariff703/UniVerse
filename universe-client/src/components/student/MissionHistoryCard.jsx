import React from "react";
import { motion } from "framer-motion";
import { Calendar, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const MissionHistoryCard = ({ event, onClick }) => {
  // Score color logic (matching ReviewModal)
  const getScoreColor = (score) => {
    if (score >= 8)
      return "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]";
    if (score >= 5)
      return "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]";
    return "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]";
  };

  const score = event.overallScore || 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(event)}
      className="group relative p-5 rounded-[2rem] bg-black/60 border border-white/5 hover:border-white/10 backdrop-blur-3xl cursor-pointer transition-all overflow-hidden"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Participation History
            </span>
            <span className="text-white/10 text-[10px]">•</span>
            <span className="text-[10px] font-mono text-slate-400">
              {event.date}
            </span>
          </div>
          <h3 className="text-sm font-bold text-white truncate group-hover:text-fuchsia-400 transition-colors">
            {event.title}
          </h3>
        </div>

        {/* Score Badge */}
        <div className="flex flex-col items-end">
          <span
            className={cn("text-xl font-bold font-mono", getScoreColor(score))}
          >
            {score}
          </span>
          <span className="text-[10px] text-slate-600">Overall</span>
        </div>
      </div>

      {/* Hover Reveal Arrow */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
        <ArrowRight className="w-4 h-4 text-white/50" />
      </div>

      {/* Background Glow */}
      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-fuchsia-500/10 blur-[40px] group-hover:bg-fuchsia-500/20 transition-colors pointer-events-none" />
    </motion.div>
  );
};

export default MissionHistoryCard;
