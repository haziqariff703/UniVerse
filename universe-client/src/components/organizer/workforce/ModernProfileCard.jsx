import React from "react";
import {
  Star,
  Trophy,
  Calendar,
  UserCheck,
  MoreHorizontal,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { API_BASE } from '@/config/api';

const ModernProfileCard = ({ member, isOwner, onEdit }) => {
  const { user_id, role, department, status, joined_at } = member;
  const user = user_id || {};
  const { name, avatar, current_merit } = user;

  
  // Resolve avatar URL
  const avatarUrl = avatar
    ? avatar.startsWith("http")
      ? avatar
      : `${API_BASE}${avatar}`
    : null;

  // Visual helper for role colors
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "president":
        return "from-fuchsia-600 to-pink-600";
      case "vice president":
        return "from-violet-600 to-indigo-600";
      case "secretary":
        return "from-blue-500 to-cyan-500";
      case "treasurer":
        return "from-emerald-500 to-teal-500";
      default:
        return "from-slate-700 to-slate-800"; // Default for AJK/Committee
    }
  };

  const roleGradient = getRoleColor(role);

  // Format rating
  const rating = current_merit
    ? (Math.min(current_merit, 500) / 100).toFixed(1)
    : "0.0";

  return (
    <div className="group relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/20">
      {/* Background Ambience */}
      <div
        className={cn(
          "absolute inset-0 opacity-20 bg-gradient-to-b transition-opacity duration-500 group-hover:opacity-30",
          roleGradient,
        )}
      />

      {/* Top Floating Elements */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20">
        {/* Role Badge (Left) */}
        <div className="relative">
          {/* Ribbon-like effect */}
          <div className="absolute -left-8 top-0 bg-white/10 w-8 h-full" />
          <div className="flex flex-col items-start">
            <span className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
              {role || "Member"}
            </span>
            {status === "Approved" && (
              <div className="flex items-center gap-1 mt-1 ml-1">
                <UserCheck className="w-3 h-3 text-emerald-400" />
                <span className="text-[9px] font-bold text-emerald-400 uppercase">
                  Active
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Actions: Rating + Menu */}
        <div className="flex items-center gap-2">
          {/* Rating Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-white text-xs font-bold">{rating}</span>
          </div>

          {/* Three Dot Menu (Owner Only) */}
          {isOwner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all shadow-lg"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layer */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-8">
        {/* Avatar */}
        <div className="relative mb-6 group-hover:scale-105 transition-transform duration-500 ease-out">
          <div
            className={cn(
              "absolute -inset-4 rounded-full bg-gradient-to-br opacity-20 blur-xl animate-pulse",
              roleGradient,
            )}
          />
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-br from-white/20 to-transparent">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#1a1a1a] shadow-2xl relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={cn(
                    "w-full h-full flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-br",
                    roleGradient,
                  )}
                >
                  {name?.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Text Info */}
        <div className="text-center px-4 relative z-20 w-full">
          <h3 className="text-2xl font-bold text-white mb-1 truncate px-2">
            {name || "Unknown User"}
          </h3>
          <p className="text-white/50 text-xs font-medium uppercase tracking-widest">
            {department || "General"}
          </p>
        </div>
      </div>

      {/* Footer / Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent z-20 px-6 pb-6 flex items-end">
        <div className="w-full flex justify-between items-center pt-4 border-t border-white/10">
          {/* Left Stat */}
          <div className="text-left">
            <p className="text-[9px] text-white/40 font-bold uppercase mb-0.5">
              Merit
            </p>
            <p className="text-sm font-bold text-fuchsia-400">
              {current_merit || 0}
            </p>
          </div>

          {/* Center - Empty or minimal decoration */}
          <div className="h-1 w-12 rounded-full bg-white/5 hidden" />

          {/* Right Stat */}
          <div className="text-right">
            <p className="text-[9px] text-white/40 font-bold uppercase mb-0.5">
              Joined
            </p>
            <p className="text-sm font-bold text-white">
              {joined_at ? new Date(joined_at).getFullYear() : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernProfileCard;
