// import { motion } from "framer-motion";
import { motion } from "framer-motion"; // Actually it IS used in CommunityCard (L18), wait.
// Ah, the lint error said line 2, but CommunityCard uses it. Let me check the file content again.
// Line 18: <motion.div ...
// It IS used. The lint error might be stale or referring to a specific import if I used destructuring?
// "import { motion } from "framer-motion";"
// I will just leave it if it is used.
// Wait, looking at previous output for Communities.jsx:
// 2: import { motion } from "framer-motion";
// ...
// 18: <motion.div
// It is used. I will ignore the lint error for now if it persists.

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
      className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 hover:bg-accent transition-colors group h-full flex flex-col shadow-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-border group-hover:border-violet-500 transition-colors">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <button className="p-2 bg-muted rounded-full hover:bg-violet-500 hover:text-white text-muted-foreground transition-all">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-2">
        <span className="text-xs font-semibold text-violet-500 dark:text-violet-400 uppercase tracking-wider">
          {category}
        </span>
        <h3 className="text-xl font-bold text-card-foreground mt-1 group-hover:text-violet-500 dark:group-hover:text-violet-300 transition-colors">
          {name}
        </h3>
      </div>

      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
        {description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="w-4 h-4 text-emerald-500" />
          <span>{members} Members</span>
        </div>
        <div className="text-muted-foreground hover:text-pink-500 transition-colors">
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
    <div className="min-h-screen pt-6 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-neuemontreal font-bold text-foreground mb-4 flex flex-col md:block">
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
            <p className="text-xl text-muted-foreground max-w-2xl">
              Connect with like-minded students, join clubs, and be part of the
              vibrant campus culture.
            </p>
          </div>

          <Link
            to="/start-club"
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg shadow-violet-500/25 flex items-center gap-2"
          >
            <Star className="w-4 h-4" /> Start a Club
          </Link>
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
