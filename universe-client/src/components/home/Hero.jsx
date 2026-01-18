import React, { useRef, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Spline from "@splinetool/react-spline";

import SplitText from "@/components/ui/SplitText";
import BlurText from "@/components/ui/BlurText";

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex flex-col md:flex-row items-center justify-between overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void/20 z-0" />

      {/* Left Column: Typography & Actions */}
      <motion.div
        style={{ opacity }}
        className="w-full md:w-3/5 pl-6 md:pl-20 py-20 md:py-0 text-center md:text-left relative z-20 flex flex-col justify-center h-full items-center md:items-start"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <span className="text-[10px] font-mono border border-slate-800 px-3 py-1.5 rounded-full text-slate-500 uppercase tracking-[0.3em] font-medium">
            v1.0.4 // Active Network
          </span>
        </motion.div>

        <div className="mb-8 max-w-5xl">
          <SplitText
            text="Direct. Find. Host. Experience."
            className="text-6xl md:text-8xl font-black tracking-[-0.05em] leading-[1.1] text-white"
            splitType="words"
            staggerDelay={0.05}
            from={{ opacity: 0, y: 15 }}
            to={{ opacity: 1, y: 0 }}
          />
        </div>

        <div className="font-mono text-[12px] font-medium text-slate-500 uppercase tracking-[0.2em] max-w-[400px] mb-12 text-center md:text-left">
          UNIFIED ECOSYSTEM // THE ALL-IN-ONE HUB FOR UITM PUNCAK PERDANA
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex gap-4 relative z-20"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative overflow-hidden group bg-white text-black px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] z-10"
          >
            <span className="relative z-10 group-hover:text-black transition-colors">
              Explore Events
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-slate-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#501fce_50%,#E2E8F0_100%)] opacity-0 group-hover:opacity-10 mix-blend-overlay transition-opacity duration-300 pointer-events-none" />
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "#ffffff",
              color: "#000000",
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-widest border border-slate-700 text-starlight hover:border-white transition-all duration-300"
          >
            Create Event
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Right Column: Visual Integration (The Overlap) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        className="w-full md:w-1/2 h-[600px] md:h-[85vh] relative md:absolute md:bottom-0 md:right-0 z-10 flex items-center justify-center pointer-events-auto md:-translate-x-[15%]"
      >
        <Suspense fallback={<div className="w-full h-full bg-transparent" />}>
          <Spline
            scene="https://prod.spline.design/VcfDGBmrN3GYOnOh/scene.splinecode"
            className="w-full h-full"
          />
        </Suspense>
      </motion.div>

      {/* Decorative floating elements (Subtle) */}
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-10 w-20 h-20 bg-accent/10 rounded-full blur-3xl pointer-events-none z-0"
      />
    </section>
  );
};

export default Hero;
