import React from "react";
import { motion } from "framer-motion";
import { Music, Cpu, Palette, Rocket, Users, BookOpen } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Music Festivals",
    icon: Music,
    color: "from-purple-500 to-pink-500",
    description: "Cosmic beats and stellar melodies",
  },
  {
    id: 2,
    name: "Tech Expos",
    icon: Cpu,
    color: "from-blue-400 to-purple-500",
    description: "Future tech from across the galaxy",
  },
  {
    id: 3,
    name: "Art Galleries",
    icon: Palette,
    color: "from-pink-400 to-red-500",
    description: "Visual masterpieces of the void",
  },
  {
    id: 4,
    name: "Space Workshops",
    icon: Rocket,
    color: "from-orange-400 to-yellow-500",
    description: "Learn to navigate the stars",
  },
  {
    id: 5,
    name: "Community Meetups",
    icon: Users,
    color: "from-green-400 to-teal-500",
    description: "Connect with fellow travelers",
  },
  {
    id: 6,
    name: "Scientific Symposiums",
    icon: BookOpen,
    color: "from-indigo-400 to-blue-500",
    description: "Expanding the boundaries of knowledge",
  },
];

const Categories = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4 tracking-tight">
            Browse by Category
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Find the perfect event that resonates with your interests.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl bg-white/[2%] border border-white/[3%] cursor-pointer hover:bg-white/[5%] hover:border-white/[8%] transition-all duration-500 shadow-[0_0_80px_rgba(0,0,0,0.95)] hover:shadow-[0_0_100px_rgba(168,85,247,0.15)] ${
                index === 0 || index === 5 ? "md:col-span-2" : "md:col-span-1"
              }`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              <div className="relative p-8 h-full flex flex-col justify-between z-10 min-h-[220px]">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[3%] flex items-center justify-center text-white mb-6 group-hover:bg-white/[6%] transition-colors border border-white/[3%]">
                    <category.icon size={20} className="text-white/70" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[5%]">
                  <span className="text-sm font-medium text-slate-500 group-hover:text-white transition-colors">
                    Explore →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
