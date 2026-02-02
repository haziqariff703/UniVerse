import React, { useState, useEffect, useCallback } from "react";
import { X, Filter, Star, MessageSquare, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ReviewsModal = ({ isOpen, onClose, events }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState("");

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = selectedEventId
        ? `http://localhost:5000/api/events/organizer/reviews?event_id=${selectedEventId}`
        : `http://localhost:5000/api/events/organizer/reviews`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen, fetchReviews]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-[#050505] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 rounded-lg">
              <MessageSquare size={20} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-none mb-1">
                Feedback Explorer
              </h2>
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">
                Deep dive into event quality
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-zinc-900/30 border-b border-white/5 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-wider">
            <Filter size={14} />
            <span>Filter by Event:</span>
          </div>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-500/50 flex-1 min-w-[250px]"
          >
            <option value="">All Events</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>

        {/* Reviews List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-white/40 font-medium">
                Analyzing feedback data...
              </p>
            </div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-white/10 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-violet-500/20">
                      {review.user_initials}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">
                        {review.user_name}
                      </h4>
                      <div className="flex items-center gap-2 text-white/40 text-xs font-medium">
                        <Calendar size={12} />
                        <span>
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="text-violet-400 font-bold">
                          {review.event_title}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                    <Star
                      size={14}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    <span className="text-sm font-bold text-white">
                      {review.rating}
                    </span>
                  </div>
                </div>
                <p className="text-white/80 text-sm leading-relaxed italic bg-black/20 p-4 rounded-xl border border-white/5">
                  "{review.comment || "No comment provided."}"
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div
                    className={`text-[10px] uppercase font-black tracking-tighter px-2 py-0.5 rounded ${
                      review.sentiment === "positive"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : review.sentiment === "negative"
                          ? "bg-rose-500/10 text-rose-400"
                          : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {review.sentiment} sentiment
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={32} className="text-white/20" />
              </div>
              <p className="text-white/40 font-medium">
                No reviews found for this selection.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewsModal;
