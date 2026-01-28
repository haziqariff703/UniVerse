import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { NoiseBackground } from "@/components/ui/noise-background";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Charging border effect
  const chargingProgress =
    email.length > 0 ? Math.min((email.length / 20) * 100, 100) : 0;

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setNewsletterSubmitted(true);
      setTimeout(() => {
        setNewsletterSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden py-20 px-6">
      {/* Celestial Gateway Lamp Effect */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full blur-[120px] pointer-events-none"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main Header */}
      <div className="relative z-10 w-full max-w-6xl mx-auto mb-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-clash font-bold text-foreground mb-4"
        >
          Unlock the{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            UniVerse
          </span>
        </motion.h2>
        <p className="text-base text-muted-foreground">
          The definitive hub for student life, events, and community.
        </p>
      </div>

      {/* Dual Command Cards */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Card: Newsletter (Cyan Theme) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <NoiseBackground
              gradientColors={[
                "rgb(6, 182, 212)", // Bright Cyan
                "rgb(34, 211, 238)", // Lighter Cyan
                "rgb(59, 130, 246)", // Blue
              ]}
              noiseIntensity={0.2}
              speed={0.18}
              containerClassName="shadow-[0_0_30px_-10px_rgba(6,182,212,0.4)]"
            >
              <div className="p-8">
                {!newsletterSubmitted ? (
                  <>
                    {/* Header */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-clash font-bold text-white mb-2">
                        Join the Feed
                      </h3>
                      <p className="text-cyan-200/80 text-sm">
                        Get the latest events and updates
                      </p>
                    </div>

                    {/* Newsletter Form */}
                    <form
                      onSubmit={handleNewsletterSubmit}
                      className="space-y-4"
                    >
                      {/* Email Input with Charging Border */}
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@uitm.edu.my"
                          className="w-full bg-white/5 border-b-2 border-white/10 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
                          required
                        />
                        {/* Charging Border Animation */}
                        <motion.div
                          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-600"
                          style={{ width: `${chargingProgress}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${chargingProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>

                      {/* Subscribe Button */}
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-clash font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
                      >
                        <span>Subscribe</span>
                        <Send
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </motion.button>
                    </form>
                  </>
                ) : (
                  /* Success State */
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-cyan-400" />
                    </div>
                    <p className="text-white font-clash font-semibold text-lg">
                      Transmission Received!
                    </p>
                    <p className="text-cyan-200/80 text-sm mt-2">
                      Welcome to the Galaxy.
                    </p>
                  </div>
                )}
              </div>
            </NoiseBackground>
          </motion.div>

          {/* Right Card: Sign Up (Purple Theme) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <NoiseBackground
              gradientColors={[
                "rgb(168, 85, 247)", // Bright Purple
                "rgb(236, 72, 153)", // Pink
                "rgb(217, 70, 239)", // Magenta
              ]}
              noiseIntensity={0.2}
              speed={0.18}
              containerClassName="shadow-[0_0_30px_-10px_rgba(168,85,247,0.4)]"
            >
              <div className="p-8 flex flex-col justify-between min-h-[280px]">
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-clash font-bold text-white mb-2">
                    Create Your Identity
                  </h3>
                  <p className="text-purple-200/80 text-sm">
                    Join thousands of UiTM students
                  </p>
                </div>

                {/* Sign Up Button */}
                <div className="space-y-4">
                  <Link to="/signup" className="block">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-4 rounded-xl font-clash font-bold text-base transition-all shadow-lg shadow-purple-500/30 relative overflow-hidden group"
                    >
                      {/* Shimmer Effect */}
                      <motion.div
                        className="absolute inset-0 w-full h-full"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                        }}
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 2,
                          ease: "linear",
                        }}
                      />

                      {/* Pulsing Live Indicator */}
                      <span className="absolute -right-1 -top-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                      </span>

                      <span className="relative z-10">Initialize Identity</span>
                    </motion.button>
                  </Link>

                  {/* Sign In Link */}
                  <div className="text-center">
                    <Link
                      to="/login"
                      className="text-sm text-purple-200/60 hover:text-purple-200 transition-colors"
                    >
                      Already a traveler?{" "}
                      <span className="underline font-semibold">Sign In</span>
                    </Link>
                  </div>
                </div>
              </div>
            </NoiseBackground>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
