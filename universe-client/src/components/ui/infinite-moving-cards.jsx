"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "slow",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const scroller = scrollerRef.current;

    if (!container || !scroller) return undefined;

    const originalItems = Array.from(scroller.children).filter(
      (item) => !item.hasAttribute("data-loop-clone"),
    );

    originalItems.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("data-loop-clone", "true");
      duplicatedItem.setAttribute("aria-hidden", "true");
      scroller.appendChild(duplicatedItem);
    });

    container.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse",
    );

    const duration =
      speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
    container.style.setProperty("--animation-duration", duration);

    const animationFrame = requestAnimationFrame(() => setStart(true));

    return () => {
      cancelAnimationFrame(animationFrame);
      scroller
        .querySelectorAll('[data-loop-clone="true"]')
        .forEach((item) => item.remove());
    };
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => (
          <li
            className="group relative w-[350px] max-w-full shrink-0 rounded-2xl border border-white/5 bg-slate-950/40 backdrop-blur-xl px-8 py-6 md:w-[450px] shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:scale-105 transition-all duration-300"
            key={`${item.name}-${idx}`}
          >
            <blockquote>
              <span className="relative z-20 text-md leading-relaxed font-normal text-white">
                "{item.quote}"
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                  {item.name.charAt(0)}
                </div>

                <span className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-slate-200">
                    {item.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
