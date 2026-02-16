import React from "react";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

const SearchFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onSearch,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card/80 backdrop-blur-md border border-border p-2 rounded-2xl flex flex-col md:flex-row gap-4 items-center sticky top-24 z-30 mb-8 shadow-sm"
    >
      {/* Search Input */}
      <div className="relative flex-grow w-full md:w-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search news, events, and updates..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-muted/50 text-foreground pl-12 pr-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary/50 focus:bg-background transition-all placeholder:text-muted-foreground"
        />
      </div>

      {/* Categories Scrollable Area */}
      <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0 px-2 md:px-0">
        <button
          onClick={() => onSelectCategory("All")}
          className={`flex-shrink-0 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            selectedCategory === "All"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`flex-shrink-0 px-6 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              selectedCategory === category
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchFilter;
