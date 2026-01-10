import React from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel p-10 md:p-16 rounded-3xl text-center relative overflow-hidden"
        >
          {/* Background gradient effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-accent/10 to-purple-500/10 z-0" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-neuemontreal font-bold text-white mb-6">
              Join the Galaxy
            </h2>
            <p className="text-starlight/70 text-lg mb-8 max-w-xl mx-auto">
              Subscribe to our interstellar newsletter to receive updates on new
              events, features, and cosmic gatherings.
            </p>

            <form
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white placeholder-starlight/40 focus:outline-none focus:border-accent transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent/80 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-accent/25 flex items-center justify-center gap-2 group"
              >
                <span>Subscribe</span>
                <Send
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
