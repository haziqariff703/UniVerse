import React from "react";
import { motion } from "framer-motion";
import { Rocket, Calendar, User, Menu } from "lucide-react";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-3 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 text-2xl font-orbitron font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent-glow"
        >
          <Rocket className="text-accent" />
          UniVerse
        </motion.div>

        <div className="hidden md:flex gap-8 items-center">
          {["Events", "Community", "About"].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              whileHover={{ scale: 1.1, color: "#a78bfa" }}
              className="text-starlight/80 hover:text-white transition-colors font-medium cursor-pointer"
            >
              {item}
            </motion.a>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-accent hover:bg-accent/80 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-lg shadow-accent/20"
          >
            Connect
          </motion.button>
        </div>

        <button className="md:hidden text-starlight">
          <Menu />
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
