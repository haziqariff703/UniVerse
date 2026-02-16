import React from "react";
import { motion } from "framer-motion";

const TechStackTicker = () => {
  const techStack = [
    {
      name: "React",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    },
    {
      name: "Node.js",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    },
    {
      name: "MongoDB",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    },
    {
      name: "Express",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    },
    {
      name: "Tailwind CSS",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
    },
    {
      name: "Framer Motion",
      logo: "https://cdn.worldvectorlogo.com/logos/framer-motion.svg",
    },
    {
      name: "Vite",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg",
    },
    {
      name: "JavaScript",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    },
  ];

  // Duplicate the list to create a seamless loop
  const duplicatedTech = [...techStack, ...techStack, ...techStack];

  return (
    <div className="w-full overflow-hidden bg-white/[0.02] border-y border-white/5 py-6 mb-16 relative">
      <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-slate-950 to-transparent z-10" />
      <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-slate-950 to-transparent z-10" />

      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicatedTech.map((tech, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 group px-4 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-default"
          >
            <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-white/20 transition-all shadow-inner flex items-center justify-center w-10 h-10">
              <img
                src={tech.logo}
                alt={tech.name}
                className="w-6 h-6 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
            <span className="text-slate-400 font-mono font-bold text-sm tracking-wider group-hover:text-white transition-colors uppercase">
              {tech.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default TechStackTicker;
