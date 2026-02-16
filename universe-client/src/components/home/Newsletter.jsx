import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { NoiseBackground } from "@/components/ui/noise-background";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

// Main Newsletter and Identity Card Component
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
      <div className="relative z-10 w-full max-w-6xl mx-auto mb-8 flex flex-col items-center text-center">
        <TypewriterEffectSmooth
          words={[
            {
              text: "Unlock",
              className: "text-white text-4xl md:text-5xl font-clash font-bold",
            },
            {
              text: "Your",
              className: "text-white text-4xl md:text-5xl font-clash font-bold",
            },
            {
              text: "UniVerse",
              className:
                "text-4xl md:text-5xl font-clash font-bold bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent",
            },
            {
              text: "Now",
              className:
                "text-4xl md:text-5xl font-clash font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent",
            },
          ]}
          className="my-0"
          cursorClassName="bg-cyan-400"
        />
        <p className="text-base text-muted-foreground mt-2">
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
            className="flex h-full"
          >
            <NoiseBackground
              gradientColors={[
                "rgb(6, 182, 212)", // Bright Cyan
                "rgb(34, 211, 238)", // Lighter Cyan
                "rgb(59, 130, 246)", // Blue
              ]}
              noiseIntensity={0.2}
              speed={0.18}
              containerClassName="shadow-[0_0_30px_-10px_rgba(6,182,212,0.4)] flex-1"
            >
              <div className="p-10 flex flex-col justify-between h-full min-h-[300px]">
                {!newsletterSubmitted ? (
                  <>
                    {/* Header */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-clash font-bold text-white mb-2">
                        Join the Feed
                      </h3>
                      <p className="text-cyan-100/70 text-sm leading-relaxed max-w-[280px]">
                        Get the latest events, trends, and campus updates
                        delivered to your galaxy.
                      </p>
                    </div>

                    {/* Newsletter Form */}
                    <form
                      onSubmit={handleNewsletterSubmit}
                      className="space-y-5"
                    >
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@uitm.edu.my"
                          className="w-full bg-white/10 border-b-2 border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors duration-300 rounded-t-lg"
                          required
                        />
                        <motion.div
                          className="absolute bottom-0 left-0 h-0.5 bg-white"
                          style={{ width: `${chargingProgress}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${chargingProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-white text-cyan-600 px-6 py-4 rounded-xl font-clash font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-cyan-900/20"
                      >
                        <span>Subscribe Now</span>
                        <Send size={16} />
                      </motion.button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-white font-clash font-bold text-xl mb-2">
                      Transmission Received!
                    </p>
                    <p className="text-cyan-100/70 text-sm">
                      Welcome to the Galaxy, traveler.
                    </p>
                  </div>
                )}
              </div>
            </NoiseBackground>
          </motion.div>

          {/* Right Card: Identity Card (Purple Theme) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex h-full"
          >
            <NoiseBackground
              gradientColors={[
                "rgb(168, 85, 247)", // Bright Purple
                "rgb(236, 72, 153)", // Pink
                "rgb(79, 70, 229)", // Indigo
              ]}
              noiseIntensity={0.2}
              speed={0.18}
              containerClassName="shadow-[0_0_30px_-10px_rgba(168,85,247,0.4)] flex-1 overflow-hidden"
            >
              <div className="p-10 flex flex-col justify-between h-full min-h-[300px] relative group">
                {/* Decorative Elements for Identity Card Feel */}
                <div className="absolute top-4 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                  <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border border-white rounded-full" />
                  </div>
                </div>

                {/* Header */}
                <div className="mb-8 relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 mb-4">
                    <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                      Digital Citizen
                    </span>
                  </div>
                  <h3 className="text-2xl font-clash font-bold text-white mb-2">
                    Create Your Identity
                  </h3>
                  <p className="text-purple-100/70 text-sm leading-relaxed max-w-[280px]">
                    Build your universal profile, track merits, and forge
                    connections across the UniVerse.
                  </p>
                </div>

                {/* Sign Up Section */}
                <div className="space-y-5 relative z-10">
                  <Link to="/signup" className="block">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white text-purple-600 px-6 py-4 rounded-xl font-clash font-bold text-base transition-all shadow-xl shadow-purple-900/20 relative overflow-hidden group"
                    >
                      <span className="relative z-10">Initialize Identity</span>
                      {/* Inner Shine */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </motion.button>
                  </Link>

                  <div className="text-center">
                    <Link
                      to="/login"
                      className="text-xs text-white/50 hover:text-white transition-colors flex items-center justify-center gap-1 group/link"
                    >
                      <span>Already a traveler?</span>
                      <span className="font-bold underline group-hover/link:text-pink-300 transition-colors">
                        Sign In
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Card ID simulation bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20" />
                <div className="absolute bottom-0 left-0 w-1/3 h-1 bg-pink-400" />
              </div>
            </NoiseBackground>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
