import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const HeroHighlight = ({ children, className }) => {
  return (
    <span className={cn("relative inline-block", className)}>
      <motion.span
        initial={{
          backgroundSize: "0% 100%",
        }}
        animate={{
          backgroundSize: "100% 100%",
        }}
        transition={{
          duration: 1.5,
          ease: "linear",
          delay: 0.5,
        }}
        style={{
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
          display: "inline",
        }}
        className="relative inline-block bg-gradient-to-r from-cyan-400/20 to-cyan-400/20 px-2 rounded-lg"
      >
        <span className="relative z-10">{children}</span>
      </motion.span>
    </span>
  );
};
