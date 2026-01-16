import React from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, Share2, MessageCircle } from "lucide-react";
import GradientText from "@/components/ui/GradientText";

const NewsCard = ({ title, date, category, excerpt, image, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/10"
  >
    <div className="aspect-video overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 text-xs font-semibold bg-violet-600/90 text-white rounded-full backdrop-blur-sm">
          {category}
        </span>
      </div>
    </div>

    <div className="p-6">
      <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-violet-400" />
          <span>{date}</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">
        {title}
      </h3>

      <p className="text-gray-400 mb-6 text-sm leading-relaxed">{excerpt}</p>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <button className="text-sm font-medium text-white hover:text-violet-300 flex items-center gap-1 transition-colors">
          Read More <ChevronRight className="w-4 h-4" />
        </button>
        <div className="flex gap-3">
          <button className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const News = () => {
  const newsItems = [
    {
      id: 1,
      title: "University Announces New AI Research Center",
      date: "March 15, 2026",
      category: "Academic",
      excerpt:
        "A state-of-the-art facility dedicated to advancing artificial intelligence research and development has been approved for construction.",
      image:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      title: "Annual Sports Gala Registration Open",
      date: "March 12, 2026",
      category: "Sports",
      excerpt:
        "Join us for the biggest sporting event of the year. Competitions include football, basketball, athletics, and e-sports.",
      image:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba0111?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      title: "Student Startup Expo 2026 Winners",
      date: "March 10, 2026",
      category: "Innovation",
      excerpt:
        "Three student-led startups have secured seed funding after an intense pitch competition judged by industry leaders.",
      image:
        "https://images.unsplash.com/photo-1559136555-9303dff5a98b?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 4,
      title: "Library Hours Extended for Finals",
      date: "March 08, 2026",
      category: "Campus Life",
      excerpt:
        "Starting next week, the central library will remain open 24/7 to support students preparing for end-of-semester examinations.",
      image:
        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 5,
      title: "Global Cultural Festival Highlights",
      date: "March 05, 2026",
      category: "Events",
      excerpt:
        "Students from over 50 countries showcased their traditions, food, and music in a vibrant celebration of diversity.",
      image:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 6,
      title: "New Sustainable Energy Initiative",
      date: "March 01, 2026",
      category: "Sustainability",
      excerpt:
        "The campus is going green with the installation of solar panels and a new recycling program aimed at reducing carbon footprint.",
      image:
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-neuemontreal font-bold text-white mb-6 flex flex-col md:block items-center">
            Campus{" "}
            <GradientText
              colors={["#7c3aed", "#a78bfa", "#7c3aed", "#a78bfa", "#7c3aed"]}
              animationSpeed={3}
              showBorder={false}
              className="px-0"
            >
              News
            </GradientText>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Stay updated with the latest happenings, achievements, and
            announcements from around the university.
          </p>
        </motion.div>

        {/* Featured News / Hero Section could go here if requested, keeping it simple grid for now */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <NewsCard key={item.id} {...item} delay={index * 0.1} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-full font-medium transition-colors border border-white/10 hover:border-violet-500/50">
            Load More Stories
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default News;
