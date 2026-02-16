import React from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  Linkedin,
  Twitter,
  ArrowRight,
  Rocket,
  Layers,
} from "lucide-react";
import TechStackTicker from "./TechStackTicker";

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Venues", path: "/venues" },
    { name: "About Universe", path: "/about" },
  ];

  const information = [
    { name: "Terms of Service", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Cookies Settings", path: "/cookies" },
    { name: "Help Center", path: "/help" },
  ];

  return (
    <footer className="relative z-0 bg-[#050505] border-t border-white/5 pt-0 pb-12 overflow-hidden">
      {/* Top Section: Tech Stack Loop */}
      <TechStackTicker />

      <div className="w-full px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 pb-20">
          {/* Left Column: Vision & CTAs */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">
                  UniVerse
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight max-w-md">
                Let's Discuss Your Vision.{" "}
                <span className="text-slate-500">With Us</span>
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="group relative px-8 py-4 bg-white text-black rounded-2xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Join Now</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/organizer/my-events"
                className="group relative px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold overflow-hidden transition-all hover:bg-white/10 active:scale-95 flex items-center justify-center gap-2"
              >
                <Layers className="w-5 h-5 text-violet-400" />
                <span>Manage Event</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16 lg:gap-24">
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Quick Links
              </h3>
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-slate-400 hover:text-white transition-all text-sm font-medium hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Information
              </h3>
              <ul className="space-y-4">
                {information.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-slate-400 hover:text-white transition-all text-sm font-medium hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Social */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-xs text-slate-500 font-mono tracking-wider">
              © {new Date().getFullYear()} UNIVERSE. ALL RIGHTS RESERVED.
            </p>
            <p className="text-[10px] text-slate-700 uppercase tracking-[0.3em] font-medium">
              Designed for UiTM Puncak Perdana
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="p-2 bg-white/5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all hover:-translate-y-1"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 bg-white/5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all hover:-translate-y-1"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 bg-white/5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all hover:-translate-y-1"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
