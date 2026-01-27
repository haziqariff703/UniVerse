import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const subscribeButtonRef = useRef(null);
  const signupButtonRef = useRef(null);

  // Magnetic effect for Subscribe button
  const subscribeMouseX = useMotionValue(0);
  const subscribeMouseY = useMotionValue(0);
  const subscribeX = useSpring(subscribeMouseX, {
    damping: 25,
    stiffness: 300,
  });
  const subscribeY = useSpring(subscribeMouseY, {
    damping: 25,
    stiffness: 300,
  });

  // Magnetic effect for Sign Up button
  const signupMouseX = useMotionValue(0);
  const signupMouseY = useMotionValue(0);
  const signupX = useSpring(signupMouseX, { damping: 25, stiffness: 300 });
  const signupY = useSpring(signupMouseY, { damping: 25, stiffness: 300 });

  // Charging border effect
  const chargingProgress =
    email.length > 0 ? Math.min((email.length / 20) * 100, 100) : 0;

  const handleMagneticEffect = (e, buttonRef, mouseX, mouseY) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < 150) {
      const pullStrength = 0.3;
      mouseX.set(distanceX * pullStrength);
      mouseY.set(distanceY * pullStrength);
    } else {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const handleMouseLeave = (mouseX, mouseY) => {
    mouseX.set(0);
    mouseY.set(0);
  };

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
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden py-20 px-6">
      {/* Celestial Gateway Lamp Effect */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full blur-[120px] pointer-events-none"
        animate={{
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main Content Container - Clean & Organized */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Unlock the UniVerse. Your Puncak Perdana Pass Awaits.
            </span>
          </h2>
          <p className="text-slate-400 leading-relaxed">
            The definitive hub for student life, events, and community.
          </p>
        </motion.div>

        {/* Dual CTA - Clean Layout */}
        {!newsletterSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="flex flex-col md:flex-row gap-6 items-stretch max-w-3xl mx-auto">
              {/* Newsletter Form - 60% */}
              <div className="flex-[6] bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex flex-col h-full"
                >
                  <label className="text-xs text-slate-400 uppercase tracking-widest mb-4 block">
                    Join the Newsletter
                  </label>

                  <div className="relative mb-4 flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-transparent border-b-2 border-white/10 px-0 py-3 text-white placeholder-slate-500 focus:outline-none text-sm"
                      required
                    />
                    {/* Charging Border */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500"
                      style={{ width: `${chargingProgress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${chargingProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Subscribe Button */}
                  <motion.button
                    ref={subscribeButtonRef}
                    type="submit"
                    style={{ x: subscribeX, y: subscribeY }}
                    onMouseMove={(e) =>
                      handleMagneticEffect(
                        e,
                        subscribeButtonRef,
                        subscribeMouseX,
                        subscribeMouseY,
                      )
                    }
                    onMouseLeave={() =>
                      handleMouseLeave(subscribeMouseX, subscribeMouseY)
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>Subscribe</span>
                    <Send
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </motion.button>
                </form>
              </div>

              {/* Sign Up Button - 40% */}
              <div className="flex-[4] flex items-stretch">
                <Link to="/signup" className="w-full">
                  <motion.button
                    ref={signupButtonRef}
                    style={{ x: signupX, y: signupY }}
                    onMouseMove={(e) =>
                      handleMagneticEffect(
                        e,
                        signupButtonRef,
                        signupMouseX,
                        signupMouseY,
                      )
                    }
                    onMouseLeave={() =>
                      handleMouseLeave(signupMouseX, signupMouseY)
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full h-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-purple-500/25 overflow-hidden flex items-center justify-center min-h-[140px]"
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
                    <span className="relative z-10">Create Your Identity</span>
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Sign In Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-6"
            >
              <Link
                to="/login"
                className="text-sm text-slate-500 hover:text-purple-400 transition-colors"
              >
                Already a traveler? <span className="underline">Sign In</span>
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          /* Newsletter Success */
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl max-w-md mx-auto"
          >
            <p className="text-white font-semibold text-lg">
              ✓ Transmission Received!
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Welcome to the Galaxy.
            </p>
          </motion.div>
        )}
      </div>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </section>
  );
};

export default Newsletter;
