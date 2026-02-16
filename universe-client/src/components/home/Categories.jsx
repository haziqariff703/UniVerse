import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

// Real Puncak Perdana Faculties - Bento Grid Layout
const categories = [
  {
    id: 1,
    name: "Information Science",
    faculty: "IM Faculty",
    gradientFrom: "purple-500",
    gradientTo: "blue-500",
    description: "Records Management, Library Science, and Digital Archives",
    courses: [
      "Records Management",
      "Information Systems",
      "Digital Archives",
      "Data Curation",
    ],
    span: "md:col-span-4", // LARGE
  },
  {
    id: 2,
    name: "Performing Arts & Screen",
    faculty: "FiTA Faculty",
    gradientFrom: "orange-500",
    gradientTo: "pink-500",
    description: "Film Production, Theatre Arts, and Cinematic Storytelling",
    courses: [
      "Film Production",
      "Theatre Arts",
      "Cinematography",
      "Screen Studies",
    ],
    span: "md:col-span-2 md:row-span-2", // TALL
  },
  {
    id: 3,
    name: "Creative Technology",
    faculty: "IM + FiTA",
    gradientFrom: "purple-500",
    gradientTo: "cyan-500",
    description: "Animation, Game Design, and Interactive Media",
    courses: ["Game Development", "3D Animation", "UX Design"],
    span: "md:col-span-2", // STANDARD
  },
  {
    id: 4,
    name: "Digital Content & Writing",
    faculty: "Cross-Faculty",
    gradientFrom: "green-500",
    gradientTo: "teal-500",
    description: "Creative Writing, Content Strategy, and Digital Storytelling",
    courses: ["Creative Writing", "Content Strategy", "Scriptwriting"],
    span: "md:col-span-2", // STANDARD
  },
];

const SpotlightCard = ({ children, className, gradientFrom, gradientTo }) => {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-slate-950/50 backdrop-blur-xl border border-white/5 transition-all duration-500 hover:border-white/10",
        className,
      )}
    >
      {/* Spotlight Border Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useTransform(
            [x, y],
            ([latestX, latestY]) =>
              `radial-gradient(400px circle at ${latestX}px ${latestY}px, rgba(168, 85, 247, 0.15), rgba(6, 182, 212, 0.15), transparent 80%)`,
          ),
        }}
      />

      {/* Abstract Gradient Glow - Top Right */}
      <div className="absolute top-0 right-0 w-48 h-48 -mr-12 -mt-12 opacity-30">
        <div
          className={cn(
            "w-full h-full rounded-full blur-3xl",
            `bg-gradient-to-br from-${gradientFrom}/20 to-${gradientTo}/20`,
          )}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const Categories = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter-plus text-white mb-3">
            Explore by Faculty
          </h2>
          <p className="text-slate-400 text-sm">
            Discover events tailored to your course at Puncak Perdana
          </p>
        </div>

        {/* Bento Grid - Anti-Box Layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={category.span}
            >
              <SpotlightCard
                className="h-full p-8 flex flex-col justify-between min-h-[320px]"
                gradientFrom={category.gradientFrom}
                gradientTo={category.gradientTo}
              >
                {/* Top Section: Title & Description */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                      {category.name}
                    </h3>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-medium">
                      {category.faculty}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                    {category.description}
                  </p>
                </div>

                {/* Bottom Section: Course Tags */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {category.courses.map((course, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-3 py-1.5 rounded-full bg-white/[3%] text-slate-500 border border-white/[5%] uppercase tracking-[0.2em] group-hover:border-purple-500/20 group-hover:text-purple-300 transition-all duration-300"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
