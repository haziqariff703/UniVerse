import React from "react";
import { cn } from "@/lib/utils";

const StatCard = ({
  label,
  value,
  progress,
  suffix,
  className,
  icon: Icon,
}) => {
  return (
    <div
      className={cn(
        "bg-card/50 backdrop-blur-md border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[180px] hover:border-primary/30 transition-all duration-300 group",
        className,
      )}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <div className="text-4xl font-black text-foreground group-hover:text-primary transition-colors">
            {value}
            {suffix && (
              <span className="text-xl text-muted-foreground ml-1 font-normal opacity-70">
                {suffix}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </div>

      {progress !== undefined && (
        <div className="w-full mt-4">
          {/* Simple visual bar or circle? Let's do a curved bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* If no progress, maybe a decorative sparkline or just empty space */}
      {progress === undefined && (
        <div className="mt-auto pt-4 flex gap-1">
          <div className="h-1 w-8 bg-primary/20 rounded-full group-hover:bg-primary transition-colors" />
          <div className="h-1 w-2 bg-primary/20 rounded-full group-hover:bg-primary/50 transition-colors delay-75" />
          <div className="h-1 w-2 bg-primary/20 rounded-full group-hover:bg-primary/20 transition-colors delay-150" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
