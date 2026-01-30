import React, { useState, useEffect } from "react"; // Fixed imports
import {
  MessageSquare,
  Star,
  Trash2,
  AlertCircle,
  Calendar,
  User,
  RefreshCw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/admin/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews();
      setSelectedReview(null);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${i < rating ? "fill-amber-400 text-amber-400" : "text-starlight/20"}`}
      />
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-starlight to-starlight/60">
              Review Moderation
            </h1>
            <p className="text-starlight/40 text-sm">
              Monitor and manage event reviews and feedback.
            </p>
          </div>
        </div>
        <button
          onClick={fetchReviews}
          className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-starlight/60 hover:text-starlight hover:bg-white/5 transition-all"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-starlight/40">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center text-starlight/40">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <MessageSquare size={32} />
          </div>
          <p>No reviews found to moderate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-6 hover:bg-white/[0.02] transition-colors"
            >
              {/* Review Content */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-xs text-starlight/40 font-mono">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-starlight/90 text-sm leading-relaxed">
                  "{review.comment || "No written comment provided."}"
                </p>

                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2 text-xs text-starlight/50">
                    <User size={12} className="text-violet-400" />
                    <span>{review.user_id?.name || "Anonymous User"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-starlight/50">
                    <Calendar size={12} className="text-pink-400" />
                    <span>{review.event_id?.title || "Unknown Event"}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center md:flex-col justify-center gap-2 border-l border-white/5 pl-4 md:pl-6">
                <button
                  onClick={() => setSelectedReview(review)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-starlight/60 text-xs hover:bg-white/10 hover:text-starlight transition-colors w-full whitespace-nowrap"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="px-4 py-2 rounded-lg bg-rose-500/10 text-rose-400 text-xs hover:bg-rose-500/20 hover:text-rose-300 transition-colors w-full flex items-center justify-center gap-2"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog
        open={!!selectedReview}
        onOpenChange={() => setSelectedReview(null)}
      >
        <DialogContent className="bg-[#050505] border-white/10 text-starlight max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6 pt-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex gap-1 mb-3">
                  {renderStars(selectedReview.rating)}
                </div>
                <p className="text-lg italic text-starlight/90">
                  "{selectedReview.comment}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-xs text-starlight/40 uppercase font-bold">
                    Reviewer
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400">
                      {selectedReview.user_id?.name?.[0] || "U"}
                    </div>
                    <div>
                      <p>{selectedReview.user_id?.name}</p>
                      <p className="text-xs text-starlight/40">
                        {selectedReview.user_id?.student_id}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-starlight/40 uppercase font-bold">
                    Event
                  </label>
                  <p className="mt-1 font-medium">
                    {selectedReview.event_id?.title}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 rounded-lg hover:bg-white/5 text-starlight/60 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDelete(selectedReview._id)}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors"
                >
                  Delete Review
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsList;
