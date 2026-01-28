import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Users, Calendar } from "lucide-react";
import { getTagColor } from "@/data/clubsData";

export const EnhancedHoverEffect = ({ items, className, onCardClick }) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10",
        className,
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="relative group block p-2 h-full w-full cursor-pointer"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => onCardClick && onCardClick(item)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-purple-500/[0.1] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <ClubCard {...item} />
        </div>
      ))}
    </div>
  );
};

const ClubCard = ({
  title,
  tagline,
  description,
  image,
  tags,
  members,
  founded,
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full overflow-hidden bg-slate-950/40 backdrop-blur-xl border border-white/5 group-hover:border-purple-500/30 relative z-20 transition-all duration-300",
      )}
    >
      {/* Image Header with Gradient Fade */}
      <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-purple-900/40 to-cyan-900/40">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        {/* Gradient fade to card body */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950/90" />
      </div>

      {/* Card Content */}
      <div className="relative z-50 p-6 -mt-6">
        {/* Title */}
        <h4 className="text-zinc-100 font-clash font-bold text-2xl tracking-tight mb-2 group-hover:text-purple-300 transition-colors">
          {title}
        </h4>

        {/* Tagline */}
        <p className="text-purple-300/80 text-xs italic tracking-wide mb-4">
          "{tagline}"
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-medium border",
                getTagColor(tag),
              )}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-6">
          {description}
        </p>

        {/* Metadata Row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-500" />
            <span>{members} Members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-500" />
            <span>Est. {founded}</span>
          </div>
        </div>

        {/* View Details Button */}
        <button
          className="w-full py-2.5 px-4 
            bg-gradient-to-r from-purple-600/20 to-cyan-600/20 
            hover:from-purple-600/30 hover:to-cyan-600/30
            border border-purple-500/30 hover:border-purple-500/50
            rounded-lg
            text-sm font-medium
            text-purple-200 hover:text-white
            transition-all duration-300
            group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          View Details →
        </button>
      </div>
    </div>
  );
};
