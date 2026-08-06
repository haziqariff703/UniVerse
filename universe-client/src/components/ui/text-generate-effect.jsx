"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  staggerDelay = 0.4,
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = typeof words === "string" ? words.split(" ") : words;

  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration || 1,
        delay: stagger(staggerDelay),
      },
    );
  }, [animate, duration, filter, staggerDelay]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          const text = typeof word === "string" ? word : word.text;
          const wordClassName = typeof word === "string" ? "" : word.className;

          return (
            <motion.span
              key={text + idx}
              className={cn("opacity-0", wordClassName)}
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {text}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="leading-snug tracking-wide">{renderWords()}</div>
      </div>
    </div>
  );
};
