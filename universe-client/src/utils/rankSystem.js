import { Shield, Radar, Rocket, Zap, Crown, Atom } from "lucide-react";

export const RANK_SYSTEM = [
  {
    name: "CADET",
    minXp: 0,
    icon: Shield,
    color: "text-slate-400",
    glow: "shadow-slate-400/50",
    border: "border-slate-500/20",
    bg: "bg-slate-500/10",
    perk: "BASIC ACCESS",
  },
  {
    name: "SCOUT",
    minXp: 200,
    icon: Radar,
    color: "text-emerald-400",
    glow: "shadow-emerald-400/50",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/10",
    perk: "EVENT DISCOVERY",
  },
  {
    name: "VOYAGER",
    minXp: 500,
    icon: Rocket,
    color: "text-cyan-400",
    glow: "shadow-cyan-400/50",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/10",
    perk: "EARLY REGISTRATION",
  },
  {
    name: "RISING STAR",
    minXp: 1000,
    icon: Zap,
    color: "text-yellow-400",
    glow: "shadow-yellow-400/50",
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/10",
    perk: "VIP LOUNGE ACCESS",
  },
  {
    name: "COSMIC ELITE",
    minXp: 2000,
    icon: Crown,
    color: "text-fuchsia-500",
    glow: "shadow-fuchsia-500/50",
    border: "border-fuchsia-500/20",
    bg: "bg-fuchsia-500/10",
    perk: "MENTORSHIP PROGRAM",
  },
  {
    name: "GALACTIC LEGEND",
    minXp: 5000,
    icon: Atom,
    color: "text-rose-500",
    glow: "shadow-rose-500/50",
    border: "border-rose-500/20",
    bg: "bg-rose-500/10",
    perk: "HALL OF FAME ENTRY",
  },
];

export const calculateRank = (currentXP) => {
  // Determine current rank based on XP
  const currentRankIndex =
    [...RANK_SYSTEM].reverse().findIndex((rank) => currentXP >= rank.minXp) ===
    -1
      ? 0
      : RANK_SYSTEM.length -
        1 -
        [...RANK_SYSTEM].reverse().findIndex((rank) => currentXP >= rank.minXp);

  const currentRank = RANK_SYSTEM[currentRankIndex];
  const nextRank = RANK_SYSTEM[currentRankIndex + 1];

  // Calculate progress
  let progress = 0;
  if (nextRank) {
    const range = nextRank.minXp - currentRank.minXp;
    const gained = currentXP - currentRank.minXp;
    progress = Math.min((gained / range) * 100, 100);
  } else {
    progress = 100;
  }

  return {
    currentRank,
    nextRank,
    progress,
    currentRankIndex,
  };
};
