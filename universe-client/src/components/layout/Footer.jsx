import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";

/**
 * Footer
 * A simple global footer for the application.
 */
const Footer = () => {
  return (
    <footer className="w-full py-3 mt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-gray-500 text-xs gap-2">
      <div className="flex items-center gap-2 order-2 md:order-1">
        <span>&copy; {new Date().getFullYear()} UniVerse</span>
      </div>

      <div className="flex items-center gap-4 order-1 md:order-2">
        <a href="#" className="hover:text-violet-400 transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-violet-400 transition-colors">
          Terms
        </a>
        <div className="flex items-center gap-3 pl-3 border-l border-white/5">
          <a href="#" className="hover:text-white transition-colors">
            <Github className="w-3.5 h-3.5" />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <Twitter className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
