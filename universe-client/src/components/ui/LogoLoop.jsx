import { useRef, useEffect, useState, useMemo } from "react";
import "./LogoLoop.css";

const LogoLoop = ({
  logos,
  speed = 40,
  direction = "left",
  logoHeight = 150,
  gap = 100,
  scaleOnHover = true,
  ariaLabel = "Partner logos",
}) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      // Duplicate content to ensure seamless loop
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      // Calculate duration based on speed prop (simple inversed logic)
      // fast (20s) -> slow (80s).
      // If user passes number, try to map roughly.
      // Current speed is 50. InfiniteCards uses 40s for normal.
      // Let's dynamic calculate:
      const duration = `${10000 / speed}s`; // 50 -> 200s is too slow?
      // InfiniteMovingCards: fast=20s, normal=40s, slow=80s.
      // Our previous speed=50 was decent.
      // Let's stick to simple CSS Duration logic directly.

      const cssDuration = speed < 30 ? "80s" : speed > 60 ? "20s" : "40s";
      containerRef.current.style.setProperty(
        "--animation-duration",
        cssDuration,
      );
    }
  };

  return (
    <div
      ref={containerRef}
      className="logoloop scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]"
    >
      <ul
        ref={scrollerRef}
        className={`flex min-w-full shrink-0 gap-0 py-4 w-max flex-nowrap ${
          start ? "animate-scroll" : ""
        } ${scaleOnHover ? "hover:[animation-play-state:paused]" : ""}`}
        style={{ columnGap: gap }}
      >
        {logos.map((item, idx) => {
          // Determine logo type for glow effect
          const logoClass = item.isFPM ? "fpm-logo" : "campus-logo";

          return (
            <li
              className={`logoloop__item relative shrink-0 ${logoClass}`}
              style={{ height: logoHeight }}
              key={`${item.alt}-${idx}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="h-full w-auto object-contain block select-none pointer-events-none transition-all duration-500"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LogoLoop;
