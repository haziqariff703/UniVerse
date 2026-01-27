import React from "react";
import CountUp from "@/components/ui/CountUp";

const StatCard = ({ label, value, suffix = "", duration = 2, delay = 0 }) => {
  return (
    <div className="bg-white/[2%] border border-white/[3%] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[160px] group hover:border-white/[8%] hover:bg-white/[5%] transition-all duration-300 shadow-[0_0_80px_rgba(0,0,0,0.95)]">
      <div className="flex items-baseline mb-2">
        <CountUp
          to={value}
          duration={duration}
          delay={delay}
          className="text-4xl md:text-5xl font-bold tracking-tight text-white tabular-nums"
          startWhen={true}
          separator=","
        />
        {suffix && (
          <span className="text-2xl md:text-3xl font-bold text-white/60 ml-1">
            {suffix}
          </span>
        )}
      </div>
      <span className="text-xs uppercase tracking-widest text-slate-500 group-hover:text-slate-400 transition-colors">
        {label}
      </span>
    </div>
  );
};

export default StatCard;
