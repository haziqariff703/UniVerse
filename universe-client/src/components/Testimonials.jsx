import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Alex Chen",
    role: "Event Organizer",
    content:
      "UniVerse revolutionized how we manage our galactic gatherings. The interface is simply out of this world!",
    avatar: "AC",
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Sarah Miller",
    role: "Space Tourist",
    content:
      "Found the most amazing zero-gravity concert through this platform. Highly recommended for any traveler.",
    avatar: "SM",
    color: "bg-purple-500",
  },
  {
    id: 3,
    name: "Zorgon X",
    role: "Interstellar DJ",
    content:
      "The best way to reach audiences across multiple solar systems. Engagement has increased by 300%.",
    avatar: "ZX",
    color: "bg-green-500",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4">
            Voices from the Void
          </h2>
          <p className="text-starlight/60">
            What our community is saying about their cosmic experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass-panel p-8 rounded-2xl relative"
            >
              <Quote className="absolute top-6 right-6 text-accent/20 w-12 h-12" />
              <p className="text-starlight/80 mb-8 leading-relaxed relative z-10">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center font-bold text-white shadow-lg`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-starlight/50">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
