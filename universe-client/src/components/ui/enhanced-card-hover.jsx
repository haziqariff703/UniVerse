import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  Users,
  Calendar,
  Activity,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { getTagColor } from "@/data/clubsData";

export const EnhancedHoverEffect = ({
  items,
  className,
  onCardClick,
  user,
}) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4",
        className,
      )}
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative group block p-2 h-full w-full cursor-pointer"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onCardClick && onCardClick(item)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-slate-800/[0.8] block rounded-[2.5rem]"
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
            <ClubCard
              {...item}
              user={user}
              isMember={user?.memberClubIds?.includes(item.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
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
  isMember,
  meritYield = "High",
  friends = [],
  lastActive = "2h ago",
  user,
}) => {
  return (
    <div
      className={cn(
        "rounded-[2.5rem] h-full w-full overflow-hidden bg-slate-950/40 backdrop-blur-xl border border-white/10 group-hover:border-slate-700 relative z-20 transition-all duration-500 flex flex-col",
        !isMember && "group-hover:scale-[1.02]",
      )}
    >
      {/* Image Header */}
      <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-purple-900/40 to-cyan-900/40 shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950/90" />

        {/* Dynamic Badge: Member vs Merit */}
        <div className="absolute top-4 left-4">
          {isMember ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 backdrop-blur-md text-[10px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <CheckCircle className="w-3 h-3 fill-cyan-500/20" />
              Member
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-md text-[10px] font-black uppercase tracking-wider">
              <Activity className="w-3 h-3" />
              {meritYield} Merit Yield
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="relative z-5 p-6 -mt-6 flex flex-col flex-1">
        <h4 className="text-zinc-100 font-clash font-bold text-2xl tracking-tight mb-2 transition-colors group-hover:text-white">
          {title}
        </h4>

        <p className="text-slate-400 text-xs italic tracking-wide mb-4">
          "{tagline}"
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
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

        <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">
          {description}
        </p>

        {/* Dynamic Footer: Last Active vs Social Signal */}
        <div className="pt-4 border-t border-white/5 mb-4 min-h-[40px] flex items-center">
          {isMember ? (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Active {lastActive}</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* RESTRICTION: Hide friends/users info for public users */}
              {user && friends && friends.length > 0 ? (
                <>
                  <div className="flex -space-x-2">
                    {friends.slice(0, 3).map((f, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border border-black bg-slate-800 overflow-hidden"
                        title={f.name}
                      >
                        <img
                          src={
                            f.avatar || `https://i.pravatar.cc/150?u=${f.id}`
                          }
                          alt="Friend"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {friends.length > 3 && (
                      <div className="w-6 h-6 rounded-full border border-black bg-slate-700 flex items-center justify-center text-[9px] text-white">
                        +{friends.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">friends joined</span>
                </>
              ) : (
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Users className="w-3 h-3" /> {members} members
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Action Button */}
        <button
          className={cn(
            "w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 border",
            isMember
              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              : "bg-purple-600/10 text-purple-300 border-purple-500/30 hover:bg-purple-600 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]",
          )}
        >
          {isMember ? (
            <>
              ENTER HUB <ArrowRight className="w-4 h-4 ml-1" />
            </>
          ) : (
            <>VIEW DETAILS</>
          )}
        </button>
      </div>
    </div>
  );
};
