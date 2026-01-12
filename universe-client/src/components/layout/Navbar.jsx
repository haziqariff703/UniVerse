import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Rocket, Menu } from "lucide-react";
import GradientText from "@/components/ui/GradientText";

const Navbar = () => {
  const { scrollY } = useScroll();

  // Transition from subtle glass to stronger "veil" as you scroll
  const bgOpacity = useTransform(scrollY, [0, 100], [0.1, 0.8]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0.1, 0.3]);
  const blurValue = useTransform(scrollY, [0, 100], [4, 12]);

  // Dynamic style object for the motion div
  const navStyle = {
    backgroundColor: useTransform(bgOpacity, (v) => `rgba(10, 10, 20, ${v})`),
    borderColor: useTransform(
      borderOpacity,
      (v) => `rgba(255, 255, 255, ${v})`
    ),
    backdropFilter: useTransform(blurValue, (v) => `blur(${v}px)`),
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 px-4 md:px-6 py-4 pointer-events-none"
    >
      {/* 
        We use pointer-events-auto on the inner container so clicks work, 
        but the full-width nav container doesn't block clicks beneath it (on sides of the pill)
      */}
      <motion.div
        style={navStyle}
        className="max-w-7xl mx-auto rounded-2xl px-6 py-3 flex justify-between items-center pointer-events-auto border transition-colors duration-300"
      >
        <Link to="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Rocket className="text-accent" />
            <GradientText
              colors={["#7c3aed", "#a78bfa", "#7c3aed", "#a78bfa", "#7c3aed"]}
              animationSpeed={3}
              showBorder={false}
              className="text-2xl font-neuemontreal font-bold"
            >
              UniVerse
            </GradientText>
          </motion.div>
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          {["Events", "My Bookings", "Admin", "Create Event"].map((item) => {
            const pathMap = {
              Events: "/events",
              "My Bookings": "/my-bookings",
              Admin: "/admin/dashboard",
              "Create Event": "/organizer/create-event",
            };
            return (
              <Link
                key={item}
                to={pathMap[item]}
                className="text-starlight/80 hover:text-white transition-colors font-medium cursor-pointer"
              >
                {item}
              </Link>
            );
          })}
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-2 rounded-full font-medium transition-all shadow-lg shadow-violet-500/25"
            >
              Connect
            </motion.button>
          </Link>
        </div>

        <button className="md:hidden text-starlight hover:text-white transition-colors">
          <Menu />
        </button>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
