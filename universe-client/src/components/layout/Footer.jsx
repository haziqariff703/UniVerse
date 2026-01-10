import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-starlight/10 bg-nebula/30 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-neuemontreal font-bold text-white mb-4">
              UniVerse
            </h3>
            <p className="text-starlight/60 max-w-xs">
              Connecting worlds through events. The platform for the next
              generation of explorers and creators.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-starlight/60">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Creators
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 rounded-full bg-white/5 hover:bg-accent hover:text-white transition-all"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-white/5 hover:bg-accent hover:text-white transition-all"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-white/5 hover:bg-accent hover:text-white transition-all"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-starlight/10 text-center text-starlight/40 text-sm">
          © {new Date().getFullYear()} UniVerse. All rights reserved. Built for
          the cosmos.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
