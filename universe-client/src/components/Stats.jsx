import React from "react";
import { motion } from "framer-motion";
import { Users, Calendar, Globe, Star } from "lucide-react";

const stats = [
  {
    id: 1,
    name: "Active Users",
    value: "10k+",
    icon: Users,
    color: "text-blue-400",
  },
  {
    id: 2,
    name: "Total Events",
    value: "500+",
    icon: Calendar,
    color: "text-purple-400",
  },
  {
    id: 3,
    name: "Planets Reached",
    value: "12",
    icon: Globe,
    color: "text-green-400",
  },
  {
    id: 4,
    name: "5-Star Reviews",
    value: "98%",
    icon: Star,
    color: "text-yellow-400",
  },
];

const Stats = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-panel p-6 rounded-2xl text-center hover:bg-white/5 transition-colors group"
            >
              <div
                className={`flex justify-center mb-4 ${stat.color} group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon size={32} />
              </div>
              <div className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-starlight/70 text-sm uppercase tracking-wider font-medium">
                {stat.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
