import React, { useRef, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Spline from "@splinetool/react-spline";
import { Link } from "react-router-dom";

import { FlipWords } from "@/components/ui/flip-words";
import { NoiseBackground } from "@/components/ui/noise-background";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Simplified to 2 high-impact words
  const flipWords = ["Programs", "Events"];

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex flex-col md:flex-row items-center justify-between overflow-hidden"
    >
      {/* Left Column: Typography & Actions */}
      <motion.div
        style={{ opacity }}
        className="w-full md:w-3/5 pl-6 md:pl-20 pr-6 md:pr-32 py-20 md:py-0 text-center md:text-left relative z-30 flex flex-col justify-center h-full items-center md:items-start"
      >
        {/* Headline with Clash Display + Flip Words */}
        <div className="mb-8 max-w-4xl drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <h1 className="text-5xl md:text-7xl font-clash font-bold tracking-tighter leading-tight text-white">
            Connect Your{" "}
            <span className="relative inline-block overflow-hidden min-w-[260px] md:min-w-[320px]">
              <FlipWords
                words={flipWords}
                className="text-purple-400 font-clash"
              />
            </span>
            <br />
            UniVerse.
          </h1>
        </div>

        {/* Description - Using Site Default Font (Plus Jakarta Sans / Inter) */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-slate-400 leading-relaxed max-w-md mb-12 text-center md:text-left text-base"
        >
          The definitive hub for student engagement and campus life.
        </motion.p>

        {/* Buttons - Using Site Default Font */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex gap-4 relative z-20 flex-col sm:flex-row"
        >
          {/* Primary: Enter the Galaxy - Aceternity Noise Style */}
          <Link to="/signup">
            <NoiseBackground
              gradientColors={[
                "rgb(168, 85, 247)", // Bright Purple
                "rgb(6, 182, 212)", // Bright Cyan
                "rgb(236, 72, 153)", // Pink accent
              ]}
              noiseIntensity={0.2}
              speed={0.2}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-3.5 font-clash font-bold tracking-tight text-base text-white"
              >
                Enter the Galaxy
              </motion.button>
            </NoiseBackground>
          </Link>

          {/* Secondary: Explore Events - Moving Border */}
          <Link to="/events">
            <MovingBorderButton
              borderRadius="1rem"
              containerClassName="h-auto w-auto"
              className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 font-clash font-bold tracking-tight text-base px-8 py-3.5"
              borderClassName="h-12 w-12 bg-[radial-gradient(circle,#06b6d4_20%,#a855f7_60%,transparent_90%)] opacity-100"
              duration={3000}
            >
              Explore Events
            </MovingBorderButton>
          </Link>
        </motion.div>
      </motion.div>

      {/* Right Column: Spline 3D Scene - Original Size (1.0x) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{
          opacity: 1,
          x: 0,
          scale: [1.0, 1.02, 1.0], // Reduced to original size with subtle breathing
        }}
        transition={{
          opacity: { duration: 1, delay: 0.5, ease: "easeOut" },
          x: { duration: 1, delay: 0.5, ease: "easeOut" },
          scale: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="w-full md:w-1/2 h-[600px] md:h-[85vh] relative md:absolute md:bottom-0 md:right-0 md:-mr-12 z-10 flex items-center justify-center pointer-events-auto"
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
