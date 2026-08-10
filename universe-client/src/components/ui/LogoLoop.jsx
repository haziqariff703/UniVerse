import { useRef, useEffect, useState } from "react";
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

    const cssDuration = speed < 30 ? "80s" : speed > 60 ? "20s" : "40s";
    container.style.setProperty("--animation-duration", cssDuration);

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
      aria-label={ariaLabel}
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
