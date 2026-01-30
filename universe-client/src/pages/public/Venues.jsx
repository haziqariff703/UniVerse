import React, { useState } from "react";
import VenueLandscapeCard from "@/components/venues/VenueLandscapeCard";
import { MOCK_VENUES } from "@/data/mockVenues";
import {
  Filter,
  ChevronDown,
  Check,
  LayoutGrid,
  GraduationCap,
  Home,
  Tent,
  Users,
} from "lucide-react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import TrueFocus from "@/components/ui/TrueFocus";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CATEGORIES = ["All", "Academic", "Residential", "Social", "Outdoor"];

// Animation variants for staggered list
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Venues = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredVenues = MOCK_VENUES.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location_code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || venue.type === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const placeholders = [
    "Search for Academic Block...",
    "Looking for a hall with AC?",
    "Find spots for Exhibitions",
    "Search for Surau Ar-Razzaq",
    "Where is the Library?",
    "Best venues for Formal Dinners",
  ];

  return (
    <div className="min-h-screen pt-12 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Cinema Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="mb-6">
            <TrueFocus
              sentence="Venues Hub"
              manualMode={false}
              blurAmount={10}
              borderColor="#D946EF" // Fuchsia-500
              animationDuration={0.8}
              pauseBetweenAnimations={1}
              fontSize="text-4xl md:text-7xl"
            />
          </div>
          <p className="text-xl md:text-2xl text-slate-400 font-clash max-w-3xl leading-relaxed">
            Discover the perfect architecture for your next event at{" "}
            <span className="text-white border-b-2 border-fuchsia-500/50 pb-1">
              UiTM Puncak Perdana
            </span>
            .
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="flex justify-center mb-14 relative z-[100]">
          <div className="w-full max-w-3xl">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSubmit={(e) => e.preventDefault()}
              value={searchTerm}
            />
          </div>
        </div>

        {/* Tabs Section (MATCHING COMMUNITIES) - Dark Glassmorphism */}
        <div className="mb-20">
          <Tabs
            value={activeCategory.toLowerCase()}
            onValueChange={(val) => {
              // Strict case check for categories
              const found = CATEGORIES.find((c) => c.toLowerCase() === val);
              if (found) setActiveCategory(found);
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-slate-950/40 backdrop-blur-xl border border-white/5 p-1.5 rounded-2xl h-auto">
              {CATEGORIES.map((cat) => {
                const Icon =
                  {
                    All: LayoutGrid,
                    Academic: GraduationCap,
                    Residential: Home,
                    Social: Users,
                    Outdoor: Tent,
                  }[cat] || Filter;

                return (
                  <TabsTrigger
                    key={cat}
                    value={cat.toLowerCase()}
                    className="data-[state=active]:bg-fuchsia-500/20 data-[state=active]:text-fuchsia-300 transition-all flex items-center justify-center gap-3 py-4 rounded-xl font-clash text-xs font-bold uppercase tracking-widest"
                  >
                    <Icon className="w-4 h-4" />
                    {cat}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Vertical Feed */}
        <motion.div
          className="flex flex-col gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {filteredVenues.map((venue, idx) => (
              <motion.div
                key={venue.id}
                layout
                variants={itemVariants}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  transition: { duration: 0.2 },
                }}
              >
                <VenueLandscapeCard venue={venue} index={idx} />
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredVenues.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-40 border border-white/5 rounded-[3rem] bg-slate-900/20 backdrop-blur-sm"
            >
              <div className="text-7xl mb-8 opacity-40 text-fuchsia-500">
                🔍
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 font-clash tracking-tight">
                No scenes found in this galaxy
              </h3>
              <p className="text-slate-400 text-lg font-clash max-w-md mx-auto">
                Try searching for a different area or switching categories.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveCategory("All");
                }}
                className="mt-12 px-10 py-4 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                Reset Radar
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
export default Venues;
