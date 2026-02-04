import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RANK_SYSTEM, calculateRank } from "@/utils/rankSystem";

// RANK_SYSTEM removed (imported from utils)

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

const RankAscension = ({ currentXP, className, children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use calculation logic from utility
  const { currentRank, nextRank, progress, currentRankIndex } =
    calculateRank(currentXP);
  const RankIcon = currentRank.icon;

  const ModalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsModalOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-white/5">
          <h2 className="text-xl font-clash font-bold text-white text-center">
            Ascension Map
          </h2>
          <p className="text-center text-xs text-white/40 font-mono mt-1">
            CURRENT AUTHORIZATION LEVEL: {currentRank.name}
          </p>
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white/40 hover:text-white"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Scrollable Timeline */}
        <motion.div
          className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {RANK_SYSTEM.map((rank, idx) => {
            const isCompleted = idx < currentRankIndex;
            const isCurrent = idx === currentRankIndex;
            const isLocked = idx > currentRankIndex;
            const Icon = rank.icon;

            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={cn(
                  "relative flex items-center gap-4 transition-all duration-300",
                  isLocked ? "opacity-40 grayscale" : "opacity-100",
                )}
              >
                {/* Connector Line - Energy Beam */}
                {idx !== RANK_SYSTEM.length - 1 && (
                  <div className="absolute left-[23px] top-12 w-0.5 h-6 bg-gradient-to-b from-white/20 to-transparent" />
                )}

                {/* Rank Icon */}
                <div
                  className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-xl border transition-all relative",
                    isCurrent
                      ? `bg-black border-${rank.color.split("-")[1]}-500 shadow-[0_0_20px_rgba(0,0,0,0.5)]`
                      : isCompleted
                        ? "bg-white/5 border-white/10"
                        : "bg-transparent border-white/5 dashed",
                    isCurrent && rank.color.replace("text-", "border-"),
                  )}
                >
                  {isCurrent && (
                    <div
                      className={cn(
                        "absolute inset-0 rounded-xl bg-current opacity-20 blur-md animate-pulse",
                        rank.color,
                      )}
                    />
                  )}
                  <Icon
                    className={cn(
                      "w-6 h-6 z-10",
                      isCurrent
                        ? rank.color
                        : isCompleted
                          ? "text-white/60"
                          : "text-white/20",
                    )}
                  />
                </div>

                {/* Rank Details */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={cn(
                        "font-bold text-sm tracking-wide",
                        isCurrent ? "text-white" : "text-white/60",
                      )}
                    >
                      {rank.name}
                    </h4>
                    {isCompleted && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    )}
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        ACTIVE
                      </span>
                    )}
                    {isLocked && <Lock className="w-3 h-3 text-white/20" />}
                  </div>
                  <div className="text-[10px] font-mono text-white/40 mt-1 flex items-center gap-2">
                    <span>
                      {isLocked
                        ? `REQUIRES ${rank.minXp} XP`
                        : `CLEARED • ${rank.minXp}+ XP`}
                    </span>
                  </div>
                  {/* Loot System: Perk Display */}
                  {isLocked && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-geist text-white/40 uppercase tracking-widest">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Reward: {rank.perk}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );

  return (
    <>
      {children ? (
        <div onClick={() => setIsModalOpen(true)} className="cursor-pointer">
          {children}
        </div>
      ) : (
        /* --- HERO RANK CARD --- */
        <div
          className={cn(
            "relative w-72 h-24 rounded-2xl overflow-hidden border transition-all duration-300 group",
            "bg-black/40 backdrop-blur-xl",
            currentRank.border,
            "hover:border-white/20 hover:bg-black/60",
            className,
          )}
        >
          {/* Glow Element */}
          <div
            className={cn(
              "absolute -left-10 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-[50px] opacity-20 transition-opacity duration-500 group-hover:opacity-40",
              currentRank.bg.replace("bg-", "bg-").replace("/10", ""),
            )}
          />

          <div className="relative h-full flex items-center px-5 gap-5">
            {/* Left: Neon Construct Icon */}
            <div className="relative flex-shrink-0">
              <div
                className={cn(
                  "w-12 h-12 flex items-center justify-center rounded-xl bg-black/50 border border-white/5",
                  `shadow-[0_0_15px_rgba(0,0,0,0.5)]`,
                  currentRank.glow.replace("shadow-", "drop-shadow-"),
                )}
              >
                <RankIcon
                  className={cn(
                    "w-7 h-7 transition-all duration-300",
                    currentRank.color,
                  )}
                  strokeWidth={1.5}
                />
              </div>
              {/* Pulsing Ring for Active State */}
              <div
                className={cn(
                  "absolute inset-0 rounded-xl border opacity-30 animate-pulse",
                  currentRank.color.replace("text-", "border-"),
                )}
              />
            </div>

            {/* Middle: Rank Data */}
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  "font-clash font-bold text-lg leading-none tracking-wide truncate",
                  currentRank.color,
                )}
              >
                {currentRank.name}
              </h3>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-end text-[10px] font-mono font-medium text-white/50">
                  <span>LVL {Math.floor(currentXP / 100)}</span>
                  <span className={currentRank.color}>
                    {currentXP} / {nextRank ? nextRank.minXp : "MAX"} XP
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full shadow-[0_0_8px_currentColor]",
                      currentRank.color.replace("text-", "bg-"),
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Right: Info Trigger */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-2 right-2 p-1.5 text-white/20 hover:text-white transition-colors group/info"
            >
              <Info className="w-4 h-4" />

              {/* Tooltip */}
              <span className="absolute right-0 translate-x-2 top-full mt-2 w-max px-2 py-1 bg-black/80 border border-white/10 rounded text-[10px] text-white opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none backdrop-blur-md">
                View Clearance Levels
              </span>
            </button>
          </div>
        </div>
      )}

      {/* --- ASCENSION MAP MODAL (PORTAL) --- */}
      {isModalOpen &&
        createPortal(
          <AnimatePresence>{ModalContent}</AnimatePresence>,
          document.body,
        )}
    </>
  );
};

export default RankAscension;
