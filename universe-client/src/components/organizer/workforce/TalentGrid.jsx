import React from "react";
import { Mic2, User, Linkedin, Twitter } from "lucide-react";

const TalentGrid = ({ talent }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Mic2 className="text-violet-400" size={20} />
          Speakers & VIPs
        </h2>
        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all">
          + Add Speaker
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {talent.map((person) => (
          <div
            key={person._id}
            className="group relative bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden hover:border-violet-500/30 transition-all duration-300"
          >
            <div className="h-24 bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 group-hover:from-violet-900/40 transition-colors" />
            <div className="absolute top-12 left-6">
              <div className="w-20 h-20 rounded-2xl bg-[#1a1a1a] border-2 border-[#0A0A0A] flex items-center justify-center overflow-hidden shadow-xl">
                <User size={32} className="text-white/20" />
              </div>
            </div>
            <div className="pt-12 px-6 pb-6 mt-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {person.user_id.name}
                  </h3>
                  <p className="text-sm text-violet-400 font-medium">
                    {person.role}
                  </p>
                </div>
                <div
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    person.status === "accepted"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {person.status}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex gap-3">
                <button className="p-2 bg-white/5 rounded-lg hover:bg-[#0077b5] hover:text-white text-gray-400 transition-colors">
                  <Linkedin size={16} />
                </button>
                <button className="p-2 bg-white/5 rounded-lg hover:bg-[#1DA1F2] hover:text-white text-gray-400 transition-colors">
                  <Twitter size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TalentGrid;
