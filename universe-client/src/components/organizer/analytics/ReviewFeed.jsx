import React from "react";
import { Star, MessageSquare } from "lucide-react";

const ReviewFeed = ({ reviews }) => {
  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="p-4 bg-[#0A0A0A] border border-white/5 rounded-xl hover:border-violet-500/20 transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white">
                {review.user_initials}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {review.user_name}
                </h4>
                <p className="text-xs text-gray-500">{review.event_title}</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 bg-white/5 px-2 py-1 rounded-lg">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-white">
                {review.rating}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            "{review.comment}"
          </p>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-bold tracking-wider">
            <span>{review.date}</span>
            <span>•</span>
            <span
              className={
                review.sentiment === "positive"
                  ? "text-emerald-400"
                  : "text-rose-400"
              }
            >
              {review.sentiment}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewFeed;
