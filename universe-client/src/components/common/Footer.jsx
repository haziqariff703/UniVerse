import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const footerLinks = {
    Orbit: [
      { name: "Home", path: "/" },
      { name: "Events", path: "/events" },
      { name: "Venues", path: "/venues" },
    ],
    Connect: [
      { name: "About", path: "/about" },
      { name: "Map", path: "/map" },
      { name: "Feedback", path: "/feedback" },
    ],
    Signals: [
      { name: "Instagram", path: "https://instagram.com", external: true },
      { name: "GitHub", path: "https://github.com", external: true },
      { name: "Email", path: "mailto:hello@universe.com", external: true },
    ],
  };

  return (
    <footer className="relative z-0 bg-slate-950 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
                {section}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors text-sm group"
                      >
                        <span className="bg-left-bottom bg-gradient-to-r from-purple-500 to-cyan-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-300">
                          {link.name}
                        </span>
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-slate-400 hover:text-white transition-colors text-sm group"
                      >
                        <span className="bg-left-bottom bg-gradient-to-r from-purple-500 to-cyan-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-300">
                          {link.name}
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Signature */}
        <motion.div
          className="text-center pt-8 border-t border-white/5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.p
            className="text-[10px] tracking-[0.3em] uppercase text-slate-700 hover:text-purple-500 transition-colors duration-300 cursor-default"
            whileHover={{ scale: 1.05 }}
          >
            Designed for UiTM Puncak Perdana
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
