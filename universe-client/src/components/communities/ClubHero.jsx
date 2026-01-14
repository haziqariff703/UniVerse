import React from "react";
import { Users, MapPin, Calendar, Lock } from "lucide-react";

const ClubHero = ({ club, onJoinClick }) => {
  return (
    <div className="relative w-full h-[500px] mb-8 group overflow-hidden rounded-3xl">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src={club.image}
          alt={club.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-3 py-1 bg-violet-600/90 backdrop-blur-md rounded-full text-xs font-semibold text-white uppercase tracking-wider">
              {club.category}
            </span>
            {club.isOpen ? (
              <span className="px-3 py-1 bg-emerald-500/90 backdrop-blur-md rounded-full text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1">
                Open for Membership
              </span>
            ) : (
              <span className="px-3 py-1 bg-red-500/90 backdrop-blur-md rounded-full text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3" /> Membership Closed
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-neuemontreal font-bold text-white mb-2">
            {club.name}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-300 md:text-lg mb-8">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-400" />
              <span>{club.members} Members</span>
            </div>
            {/* Placeholder for location or established date if needed */}
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-violet-400" />
              <span>Student Center</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onJoinClick}
              disabled={!club.isOpen}
              className={`px-8 py-3 rounded-full font-bold text-lg transition-all shadow-lg flex items-center gap-2
                ${
                  club.isOpen
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white cursor-pointer shadow-violet-500/25"
                    : "bg-white/10 text-gray-400 cursor-not-allowed border border-white/5"
                }`}
            >
              {club.isOpen ? "Be a Member" : "Registration Closed"}
            </button>
            <button className="px-8 py-3 rounded-full font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-colors">
              View Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubHero;
