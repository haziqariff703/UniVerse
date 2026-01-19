import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Share2, MessageCircle } from "lucide-react";

const HeroCarousel = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-3xl"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 text-xs font-semibold bg-violet-600/90 text-white rounded-full backdrop-blur-sm shadow-lg shadow-violet-500/20">
                  {slides[current].category}
                </span>
                <span className="px-3 py-1 text-xs font-semibold bg-white/10 text-white rounded-full backdrop-blur-sm">
                  {slides[current].date}
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {slides[current].title}
              </h2>

              <p className="text-gray-200 text-base md:text-lg mb-8 line-clamp-2 md:line-clamp-none max-w-2xl">
                {slides[current].excerpt}
              </p>

              <div className="flex items-center gap-4">
                <button className="px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors">
                  Read News
                </button>
                <div className="flex gap-2">
                  <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/20 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 border border-white/10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/20 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 border border-white/10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 right-8 flex gap-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === current ? "w-6 bg-violet-500" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
