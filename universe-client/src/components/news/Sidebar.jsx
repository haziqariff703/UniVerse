import React from "react";
import NewsCard from "./NewsCard";
import { ArrowUpRight } from "lucide-react";

const Sidebar = ({ popularPosts, categories }) => {
  return (
    <div className="space-y-8 sticky top-28">
      {/* Categories Widget */}
      <div className="bg-card backdrop-blur-lg border border-border rounded-2xl p-6">
        <h3 className="text-lg font-bold text-card-foreground mb-4 flex items-center gap-2">
          Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <button
              key={index}
              className="px-3 py-1.5 text-sm bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground rounded-lg border border-border hover:border-primary/30 transition-all duration-300"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Posts Widget */}
      <div className="bg-card backdrop-blur-lg border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-card-foreground">
            Popular Posts
          </h3>
          <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-0.5">
            View All <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-1">
          {popularPosts.map((post, index) => (
            <div key={post.id} className={index !== 0 ? "pt-2" : ""}>
              <NewsCard {...post} compact={true} delay={0.1 * index} />
              {index !== popularPosts.length - 1 && (
                <div className="h-px bg-border my-2 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter / CTA Widget (Optional) */}
      <div className="bg-gradient-to-br from-violet-600/10 to-indigo-600/10 backdrop-blur-lg border border-primary/20 rounded-2xl p-6 text-center">
        <h3 className="text-lg font-bold text-card-foreground mb-2">
          Weekly Digest
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get the latest university updates delivered to your inbox.
        </p>
        <div className="relative">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
          />
          <button className="absolute right-1 top-1 bottom-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-3 text-xs font-semibold transition-colors">
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
