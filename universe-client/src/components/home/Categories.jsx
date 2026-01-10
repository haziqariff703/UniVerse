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
          <span className="text-accent tracking-widest uppercase text-sm font-semibold">
            Discover
          </span>
          <h2 className="text-4xl md:text-5xl font-neuemontreal font-bold text-white mt-2 mb-4">
            Browse by Category
          </h2>
          <p className="text-starlight/60 max-w-2xl mx-auto">
            Find the perfect event that resonates with your frequency.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl glass-panel p-1 cursor-pointer"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />
              <div className="relative p-6 h-full flex items-start gap-4 z-10">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${category.color} bg-opacity-20 text-white shadow-lg`}
                >
                  <category.icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-starlight/60 mb-4">
                    {category.description}
                  </p>
                  <span className="text-xs font-semibold uppercase tracking-wider text-starlight/40 group-hover:text-accent transition-colors flex items-center gap-1">
                    Explore <span className="text-lg leading-none">&rarr;</span>
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
