import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const VenueHeatmap = ({ venue, events = [] }) => {
  // Extract hours from accessHours (e.g., "08:00 - 22:00")
  const [openStr, closeStr] = (venue.accessHours || "08:00 - 22:00").split(
    " - ",
  );
  const openHour = parseInt(openStr.split(":")[0]);
  const closeHour = parseInt(closeStr.split(":")[0]);

  const hours = [];
  for (let h = openHour; h <= closeHour; h++) {
    hours.push(h);
  }

  const isHourBooked = (hour) => {
    const today = new Date();
    today.setHours(hour, 0, 0, 0);
    const hourTime = today.getTime();

    return events.some((event) => {
      const start = new Date(event.date_time).getTime();
      const end = new Date(
        event.end_time ||
          new Date(event.date_time).getTime() +
            (event.duration_minutes || 60) * 60000,
      ).getTime();

      // Check if the hour falls within the event duration
      const slotStart = new Date(today);
      slotStart.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(today);
      slotEnd.setHours(hour + 1, 0, 0, 0);

      return start < slotEnd.getTime() && end > slotStart.getTime();
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] mt-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-clash font-bold text-white uppercase tracking-tight">
            Venue Pulse Registry
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Live density and booking schedule for today
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-fuchsia-500/20 border border-fuchsia-100/10 rounded-sm" />
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Free
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-fuchsia-500 rounded-sm" />
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              Booked
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {hours.map((hour) => {
          const booked = isHourBooked(hour);
          const timeLabel = `${hour.toString().padStart(2, "0")}:00`;

          return (
            <div key={hour} className="group relative">
              <div
                className={cn(
                  "aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-500 border",
                  booked
                    ? "bg-fuchsia-500 border-fuchsia-400/50 shadow-[0_0_15px_rgba(217,70,239,0.3)]"
                    : "bg-white/5 border-white/5 hover:border-white/10",
                )}
              >
                <span
                  className={cn(
                    "text-xs font-mono font-bold",
                    booked ? "text-white" : "text-slate-500",
                  )}
                >
                  {timeLabel}
                </span>
                {booked && (
                  <div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse pointer-events-none" />
                )}
              </div>

              {/* Tooltip-like popup on hover if booked */}
              {booked && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                  <p className="text-[10px] font-bold text-fuchsia-400 uppercase">
                    Venue Occupied
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default VenueHeatmap;
