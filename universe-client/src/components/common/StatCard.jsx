import React from "react";
import CountUp from "@/components/ui/CountUp";

const StatCard = ({ label, value, suffix = "", duration = 2, delay = 0 }) => {
  return (
    <div className="bg-card border border-border rounded-sm p-6 flex flex-col items-center justify-center min-h-[160px] group hover:border-primary/50 transition-colors duration-300">
      <div className="flex items-baseline mb-2">
        <CountUp
          to={value}
          duration={duration}
          delay={delay}
          className="text-4xl md:text-5xl font-inter font-black tracking-tighter text-card-foreground tabular-nums"
          startWhen={true}
          separator=","
        />
        {suffix && (
          <span className="text-2xl md:text-3xl font-black text-muted-foreground ml-1">
            {suffix}
          </span>
        )}
      </div>
      <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-muted-foreground group-hover:text-primary transition-colors">
        {label}
      </span>
    </div>
  );
};

export default StatCard;
