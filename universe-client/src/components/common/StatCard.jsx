import React from "react";
import CountUp from "@/components/ui/CountUp";

const StatCard = ({ label, value, suffix = "", duration = 2, delay = 0 }) => {
  return (
    <div className="bg-[#0A0A0A] border border-slate-800 rounded-sm p-6 flex flex-col items-center justify-center min-h-[160px] group hover:border-slate-600 transition-colors duration-300">
      <div className="flex items-baseline mb-2">
        <CountUp
          to={value}
          duration={duration}
          delay={delay}
          className="text-4xl md:text-5xl font-inter font-black tracking-tighter text-white tabular-nums"
          startWhen={true}
          separator=","
        />
        {suffix && (
          <span className="text-2xl md:text-3xl font-black text-slate-500 ml-1">
            {suffix}
          </span>
        )}
      </div>
      <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
        {label}
      </span>
    </div>
  );
};

export default StatCard;
