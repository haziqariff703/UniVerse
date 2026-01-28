import { motion } from "framer-motion";
import { Users, Orbit } from "lucide-react";
import { Link } from "react-router-dom";

const CampusLifeInMotion = () => {
  const timestamps = [
    { time: "00:27", label: "FPM - Faculty of Information Management" },
    { time: "01:15", label: "Student Activity Spaces" },
    { time: "02:03", label: "Campus Facilities" },
    { time: "02:45", label: "Recreational Areas" },
  ];

  return (
    <section className="relative py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Grid Layout: 60% Video | 40% Info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Video Player - 60% (col-span-3) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-950/40 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.15),0_0_80px_rgba(168,85,247,0.1)]">
              {/* Video Container */}
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/wIqrceknPEk?autoplay=0&mute=0"
                  title="UiTM Puncak Perdana Campus Tour"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Gradient Overlay at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Info Column - 40% (col-span-2) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Section Header */}
            <div>
              <h2 className="text-4xl md:text-5xl font-clash font-bold text-foreground mb-4">
                Campus Life in{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Motion
                </span>
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Discover the architecture of your journey. From the high-tech
                halls of FPM to the heart of Puncak Perdana—this is the
                UniVerse.
              </p>
            </div>

            {/* Timestamps */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-3">
                Quick Navigation
              </p>
              <div className="space-y-1.5">
                {timestamps.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    <span className="font-mono text-xs text-cyan-500/70">
                      {item.time}
                    </span>
                    <span className="text-xs">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons - Proper Hierarchy */}
            <div className="flex flex-col gap-3 pt-4">
              {/* Primary Button: Browse Communities */}
              <Link to="/communities">
                <button
                  className="w-full py-3.5 px-6
                    bg-gradient-to-r from-purple-600 to-cyan-600
                    hover:from-purple-700 hover:to-cyan-700
                    rounded-xl
                    font-clash font-semibold text-base
                    text-white
                    flex items-center justify-center gap-2
                    transition-all duration-300
                    shadow-[0_0_30px_rgba(168,85,247,0.3)]
                    hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]"
                >
                  <Users className="w-5 h-5" />
                  Browse Communities
                </button>
              </Link>

              {/* Secondary Button: Initialize Satellite View */}
              <a
                href="https://www.google.com/maps/@3.1315,101.4925,300m/data=!3m1!1e3"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className="w-full py-3.5 px-6
                    bg-white/5 backdrop-blur-xl
                    border border-cyan-500/50 hover:border-purple-500/70
                    rounded-xl
                    font-clash font-medium text-base
                    text-cyan-300 hover:text-purple-200
                    flex items-center justify-center gap-2
                    transition-all duration-500
                    relative
                    group"
                >
                  {/* Pulsing Dot Animation */}
                  <span className="absolute -right-1 -top-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                  </span>
                  <Orbit className="w-5 h-5 animate-spin-slow group-hover:text-purple-400 transition-colors duration-500" />
                  Initialize Satellite View
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CampusLifeInMotion;
