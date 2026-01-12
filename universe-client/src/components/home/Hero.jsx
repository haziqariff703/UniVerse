import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const StaggeredText = ({ text, className, delay = 0 }) => {
  const words = text.split(" ");
  return (
    <motion.h1 className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.05,
              ease: [0.33, 1, 0.68, 1],
            }}
            className="inline-block mr-2 sm:mr-4"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
};

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
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void/20 z-0" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-accent/20 border border-accent/50 text-accent-glow text-sm font-medium mb-6 backdrop-blur-md">
            Explore the Infinite
          </span>
        </motion.div>

        <div className="mb-6">
          <StaggeredText
            text="Discover Events"
            className="text-5xl md:text-7xl font-neuemontreal font-bold leading-tight"
            delay={0.1}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="text-5xl md:text-7xl font-neuemontreal font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent via-purple-500 to-pink-500 animate-pulse-slow">
              Beyond Boundaries
            </span>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-starlight/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Join the UniVerse community to find, host, and experience stellar
          events across the galaxy. Your journey starts here.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-violet-500/25 transition-all"
          >
            Explore Events
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
            whileTap={{ scale: 0.95 }}
            className="glass-panel px-8 py-4 rounded-full font-bold text-lg hover:border-accent/50 transition-all"
          >
            Create Event
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Decorative floating elements */}
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-10 w-20 h-20 bg-accent/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [20, -20, 20] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
      />
    </section>
  );
};

export default Hero;
