import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";

/**
 * Footer
 * A simple global footer for the application.
 */
const Footer = () => {
  return (
    <footer className="w-full py-6 mt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm gap-4">
      <div className="flex items-center gap-4 order-2 md:order-1">
        <span>
          &copy; {new Date().getFullYear()} UniVerse. All rights reserved.
        </span>
      </div>

      <div className="flex items-center gap-6 order-1 md:order-2">
        <a href="#" className="hover:text-violet-400 transition-colors">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-violet-400 transition-colors">
          Terms of Service
        </a>
        <div className="flex items-center gap-4 pl-4 border-l border-white/5">
          <a href="#" className="hover:text-white transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <a href="#" className="hover:text-white transition-colors">
            <Twitter className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
