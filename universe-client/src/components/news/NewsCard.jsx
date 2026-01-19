import React from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, Share2, MessageCircle } from "lucide-react";

const NewsCard = ({
  title,
  date,
  category,
  excerpt,
  image,
  delay = 0,
  compact = false,
}) => {
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="flex gap-4 group cursor-pointer hover:bg-muted/50 p-3 rounded-xl transition-colors border border-transparent hover:border-border"
      >
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-xs text-primary mb-1 font-medium">
            {category}
          </span>
          <h4 className="text-foreground text-sm font-semibold line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {title}
          </h4>
          <span className="text-xs text-muted-foreground mt-2">{date}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative bg-card backdrop-blur-lg border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 flex flex-col h-full"
    >
      <div className="aspect-video overflow-hidden relative">
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

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{date}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="text-muted-foreground mb-6 text-sm leading-relaxed line-clamp-3">
          {excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
          <button className="text-sm font-medium text-foreground hover:text-primary flex items-center gap-1 transition-colors">
            Read More <ChevronRight className="w-4 h-4" />
          </button>
          <div className="flex gap-3">
            <button className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;
