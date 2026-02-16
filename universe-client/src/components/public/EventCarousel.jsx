import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventCard from "@/components/common/EventCard";
import { cn } from "@/lib/utils";

const EventCarousel = ({ events }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Tripling the events to ensure a seamless loop
  // The middle third is what we see mostly, and it loops back imperceptibly
  const duplicatedEvents = [...events, ...events, ...events];

  return (
    <div
      className="relative w-full overflow-hidden group/carousel py-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-void to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-void to-transparent z-10 pointer-events-none" />

      {/* Navigation Arrows */}
      <div
        className={cn(
          "absolute left-8 top-1/2 -translate-y-1/2 z-20 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      >
        <button className="p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-lg text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all cursor-pointer">
          <ChevronLeft size={24} />
        </button>
      </div>

      <div
        className={cn(
          "absolute right-8 top-1/2 -translate-y-1/2 z-20 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      >
        <button className="p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-lg text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all cursor-pointer">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="flex overflow-hidden">
        <div
          className="flex gap-8 px-8 animate-marquee"
          style={{
            animationPlayState: isHovered ? "paused" : "running",
            width: "max-content",
          }}
        >
          {duplicatedEvents.map((event, idx) => (
            <div
              key={`${event.id}-${idx}`}
              className="w-[400px] flex-shrink-0 h-[500px] transform transition-transform duration-500 hover:scale-[1.02]"
            >
              <EventCard event={event} index={idx} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
           animation: marquee 60s linear infinite;
           will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default EventCarousel;
