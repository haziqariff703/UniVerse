import React from "react";
import { motion } from "framer-motion";
import { Users, ExternalLink, Heart, Star } from "lucide-react";
import GradientText from "@/components/ui/GradientText";

import { Link } from "react-router-dom";

const CommunityCard = ({
  id,
  name,
  category,
  members,
  description,
  image,
  delay,
}) => (
  <Link to={`/communities/${id}`}>
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-white/20 group-hover:border-violet-500 transition-colors">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <button className="p-2 bg-white/5 rounded-full hover:bg-violet-500 hover:text-white text-gray-400 transition-all">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-2">
        <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
          {category}
        </span>
        <h3 className="text-xl font-bold text-white mt-1 group-hover:text-violet-300 transition-colors">
          {name}
        </h3>
      </div>

      <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
        {description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <Users className="w-4 h-4 text-emerald-400" />
          <span>{members} Members</span>
        </div>
        <div className="text-gray-500 hover:text-pink-500 transition-colors">
          <Heart className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  </Link>
);

const Communities = () => {
  const communities = [
    {
      id: 1,
      name: "Tech Innovators Club",
      category: "Technology",
      members: "1.2k",
      description:
        "A community for tech enthusiasts to collaborate on projects, hackathons, and innovative solutions.",
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 2,
      name: "Debate Society",
      category: "Academic",
      members: "500+",
      description:
        "Honing public speaking and critical thinking skills through weekly debates and competitions.",
      image:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 3,
      name: "Green Earth Initiative",
      category: "Environment",
      members: "850",
      description:
        "Dedicated to promoting sustainability and environmental awareness across campus.",
      image:
        "https://images.unsplash.com/photo-1542601906990-24d4c16419d4?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 4,
      name: "Photography Club",
      category: "Arts",
      members: "420",
      description:
        "Capturing moments and exploring the art of photography through workshops and photo walks.",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 5,
      name: "Music Society",
      category: "Arts & Culture",
      members: "900+",
      description:
        "Jam sessions, concerts, and music theory workshops for musicians of all levels.",
      image:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 6,
      name: "Entrepreneurship Cell",
      category: "Business",
      members: "750",
      description:
        "Fostering the spirit of entrepreneurship and nurturing future business leaders.",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=200",
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-neuemontreal font-bold text-white mb-4 flex flex-col md:block">
              Explore{" "}
              <GradientText
                colors={["#7c3aed", "#a78bfa", "#7c3aed", "#a78bfa", "#7c3aed"]}
                animationSpeed={3}
                showBorder={false}
                className="px-0"
              >
                Communities
              </GradientText>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Connect with like-minded students, join clubs, and be part of the
              vibrant campus culture.
            </p>
          </div>

          <button className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg shadow-violet-500/25 flex items-center gap-2">
            <Star className="w-4 h-4" /> Start a Club
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community, index) => (
            <CommunityCard
              key={community.id}
              {...community}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Communities;
