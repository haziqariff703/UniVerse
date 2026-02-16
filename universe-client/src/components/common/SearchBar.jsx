import { useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = ({ onSearch, placeholder = "Search organizations..." }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full pl-12 pr-12 py-3.5
            bg-slate-950/40 backdrop-blur-xl
            border border-white/5
            rounded-xl
            text-foreground text-sm
            placeholder:text-muted-foreground
            focus:outline-none
            transition-all duration-300
            ${isFocused ? "border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]" : ""}
          `}
        />

        {/* Charging Border Effect */}
        <motion.div
          className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: isFocused ? "100%" : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Clear Button */}
        <AnimatePresence>
          {searchTerm && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 
                p-1.5 rounded-full
                bg-muted hover:bg-purple-500/20
                text-muted-foreground hover:text-purple-300
                transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Search hint */}
      <AnimatePresence>
        {searchTerm && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-xs text-muted-foreground text-center"
          >
            Searching across names, taglines, and tags...
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
