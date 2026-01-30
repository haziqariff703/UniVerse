import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./TrueFocus.css";

const TrueFocus = ({
  sentence = "True Focus",
  separator = " ",
  manualMode = false,
  blurAmount = 5,
  borderColor = "green",
  glowColor = "rgba(0, 255, 0, 0.6)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  fontSize = "text-4xl md:text-7xl",
}) => {
  const words = sentence.split(separator);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState(null);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const [focusRect, setFocusRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(
        () => {
          setCurrentIndex((prev) => (prev + 1) % words.length);
        },
        (animationDuration + pauseBetweenAnimations) * 1000,
      );

      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;

    if (!wordRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex].getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = (index) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex);
    }
  };

  return (
    <div
      className="focus-container relative flex gap-4 items-center justify-start flex-wrap outline-none select-none"
      ref={containerRef}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={(el) => (wordRefs.current[index] = el)}
            className={`focus-word relative ${fontSize} font-clash font-bold mb-6 tracking-tighter cursor-pointer transition-all duration-300 outline-none select-none ${manualMode ? "manual" : ""} ${isActive && !manualMode ? "active" : ""} ${word === "Hub" ? "bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-violet-600 drop-shadow-[0_0_15px_rgba(192,38,211,0.5)]" : "text-foreground"}`}
            style={{
              lineHeight: "0.8",
              filter: manualMode
                ? isActive
                  ? `blur(0px)`
                  : `blur(${blurAmount}px)`
                : isActive
                  ? `blur(0px)`
                  : `blur(${blurAmount}px)`,
              "--border-color": borderColor,
              "--glow-color": glowColor,
              transition: `filter ${animationDuration}s ease`,
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        className="focus-frame absolute top-0 left-0 pointer-events-none box-content border-none"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0,
        }}
        transition={{
          duration: animationDuration,
        }}
        style={{
          "--border-color": borderColor,
          "--glow-color": glowColor,
        }}
      >
        <span className="corner top-left absolute w-4 h-4 border-2 border-[var(--border-color)] rounded-tl-md top-[-10px] left-[-10px] border-r-0 border-b-0 drop-shadow-[0_0_4px_var(--border-color)]"></span>
        <span className="corner top-right absolute w-4 h-4 border-2 border-[var(--border-color)] rounded-tr-md top-[-10px] right-[-10px] border-l-0 border-b-0 drop-shadow-[0_0_4px_var(--border-color)]"></span>
        <span className="corner bottom-left absolute w-4 h-4 border-2 border-[var(--border-color)] rounded-bl-md bottom-[-10px] left-[-10px] border-r-0 border-top-0 drop-shadow-[0_0_4px_var(--border-color)]"></span>
        <span className="corner bottom-right absolute w-4 h-4 border-2 border-[var(--border-color)] rounded-br-md bottom-[-10px] right-[-10px] border-l-0 border-top-0 drop-shadow-[0_0_4px_var(--border-color)]"></span>
      </motion.div>
    </div>
  );
};

export default TrueFocus;
