import React, { useRef, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Spline from "@splinetool/react-spline";

import SplitText from "@/components/ui/SplitText";

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex flex-col md:flex-row items-center justify-between overflow-hidden overflow-x-hidden"
    >
      {/* Left Column: Typography & Actions */}
      <motion.div
        style={{ opacity }}
        className="w-full md:w-3/5 pl-6 md:pl-20 py-20 md:py-0 text-center md:text-left relative z-30 flex flex-col justify-center h-full items-center md:items-start"
      >
        <div className="mb-8 max-w-5xl drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <SplitText
            text="Connect Your Universe."
            className="text-6xl md:text-8xl font-semibold tracking-tighter-plus leading-tight text-white"
            splitType="words"
            staggerDelay={0.05}
            from={{ opacity: 0, y: 15 }}
            to={{ opacity: 1, y: 0 }}
          />
        </div>

        <div className="text-slate-400 font-normal leading-relaxed max-w-[420px] mb-12 text-center md:text-left text-lg">
          The definitive hub for student engagement and campus life.
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
            className="relative overflow-hidden group bg-white text-black px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] z-10"
          >
            <span className="relative z-10">Explore Events</span>
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full font-semibold text-sm border border-white/20 text-white hover:border-white/40 transition-all duration-300 backdrop-blur-sm"
          >
            Create Event
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Right Column: Spline 3D Scene - Breathing Animation with Overlap */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{
          opacity: 1,
          x: 0,
          scale: [1, 1.04, 1], // Subtle breathing scale
        }}
        transition={{
          opacity: { duration: 1, delay: 0.5, ease: "easeOut" },
          x: { duration: 1, delay: 0.5, ease: "easeOut" },
          scale: {
            duration: 8, // Slow and cinematic
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="w-full md:w-1/2 h-[600px] md:h-[85vh] relative md:absolute md:bottom-0 md:right-0 md:-mr-24 z-0 flex items-center justify-center pointer-events-auto md:translate-x-[5%]"
      >
        <Suspense fallback={<div className="w-full h-full bg-transparent" />}>
          <Spline
            scene="https://prod.spline.design/VcfDGBmrN3GYOnOh/scene.splinecode"
            className="w-full h-full"
          />
        </Suspense>
      </motion.div>

      {/* Subtle ambient glow */}
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none z-0"
      />
    </section>
  );
};

export default Hero;
