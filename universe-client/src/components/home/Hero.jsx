import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background overlay for depth */}
      {/* Background overlay for depth - kept subtle and transparent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void/20 z-0" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-accent/20 border border-accent/50 text-accent-glow text-sm font-medium mb-6">
            Explore the Infinite
          </span>
          <h1 className="text-5xl md:text-7xl font-neuemontreal font-bold mb-6 leading-tight">
            Discover Events <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-purple-500 to-pink-500 animate-pulse-slow">
              Beyond Boundaries
            </span>
          </h1>
          <p className="text-starlight/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Join the UniVerse community to find, host, and experience stellar
            events across the galaxy. Your journey starts here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-accent hover:bg-accent/80 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-accent/30 transition-all"
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
          </div>
        </motion.div>
      </div>

      {/* Decorative floating elements */}
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-10 w-20 h-20 bg-accent/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [20, -20, 20] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"
      />
    </section>
  );
};

export default Hero;
