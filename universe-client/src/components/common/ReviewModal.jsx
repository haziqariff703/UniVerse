import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  Upload,
  Trash2,
  Camera,
  Check,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { API_BASE, API_URL } from "@/config/api";

const ATMOS_METRICS = [
  {
    id: "value",
    label: "Merit Value",
    icon: "🎓",
    desc: "Did it help your career?",
  },
  {
    id: "energy",
    label: "Energy Level",
    icon: "🔥",
    desc: "Was the vibe alive?",
  },
  {
    id: "welfare",
    label: "Organization",
    icon: "🍱",
    desc: "Food & Facilities",
  },
  {
    id: "speaker_rating",
    label: "Speaker Impact",
    icon: "🎤",
    desc: "Did they inspire you?",
  },
];

const getVibeLabel = (value) => {
  if (value <= 3) return "Low / Quiet";
  if (value <= 7) return "Mid / Balanced";
  return "High / Hype";
};

const getScoreColor = (score) => {
  if (score >= 8)
    return "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]";
  if (score >= 5)
    return "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]";
  return "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]";
};

const ReviewModal = ({
  isOpen,
  onClose,
  event,
  readOnly = false,
  onSubmit,
}) => {
  // Use event.review if available (backend naming)
  const [ratings, setRatings] = useState({
    value: 5,
    energy: 5,
    welfare: 5,
    speaker_rating: 5,
  });
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState([]); // Array of preview URLs or server URLs
  const [photoFiles, setPhotoFiles] = useState([]); // Array of actual File objects
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync state when modal opens or event changes
  useEffect(() => {
    if (isOpen && event) {
      const reviewData = event.review || event.ratings;
      if (readOnly && reviewData) {
        setRatings({
          value: reviewData.value || 5,
          energy: reviewData.energy || 5,
          welfare: reviewData.welfare || 5,
          speaker_rating: reviewData.speaker_rating || 5,
        });
        setComment(reviewData.comment || "");
        // Map server paths to absolute URLs
        const serverPhotos = (reviewData.photos || []).map((p) => {
          if (p.startsWith("http")) return p;
          if (p.includes(":/") || p.includes(":\\"))
            return "/placeholder-image.jpg"; // Filter out absolute local paths
          const normalizedPath = p.startsWith("/") ? p : `/${p}`;
          return `${API_BASE}${normalizedPath}`;
        });
        setPhotos(serverPhotos);
      } else {
        // Reset for new submission
        setRatings({ value: 5, energy: 5, welfare: 5, speaker_rating: 5 });
        setComment("");
        setPhotos([]);
        setPhotoFiles([]);
      }
    }
  }, [isOpen, event, readOnly]);

  // Actual Photo Selection
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotos([...photos, url].slice(0, 3));
      setPhotoFiles([...photoFiles, file].slice(0, 3));
    }
  };

  const calculateOverall = () => {
    return (
      Math.round(
        ((ratings.value +
          ratings.energy +
          ratings.welfare +
          ratings.speaker_rating) /
          4) *
          10,
      ) / 10
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const avgScore = calculateOverall();
      const finalRating = Math.max(1, Math.min(5, Math.round(avgScore / 2)));

      if (typeof onSubmit === "function") {
        await onSubmit({
          rating: finalRating,
          speaker_rating: ratings.speaker_rating,
          value: ratings.value,
          energy: ratings.energy,
          welfare: ratings.welfare,
          comment,
          photos: photoFiles, // Pass actual files
        });
      } else {
        console.warn("ReviewModal: onSubmit is not a function", onSubmit);
      }

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false); // Reset for next time
      }, 1500);
    } catch (error) {
      console.error("Review submission failed", error);
      alert("Submission Error: " + (error.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const overallScore =
    readOnly && event?.overallScore ? event.overallScore : calculateOverall();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div className="w-full max-w-2xl bg-black/90 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-8 border-b border-white/5 flex justify-between items-start bg-gradient-to-br from-slate-900 to-black">
                <div>
                  <h2 className="text-2xl font-bold font-clash text-white mb-1">
                    {readOnly ? "Participation Record" : "Event Feedback"}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {event?.title || "Event Feedback"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                {/* 1. Atmos Sliders (Staggered Fade-in) */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
                  {ATMOS_METRICS.map((metric) => (
                    <div key={metric.id} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                          <span>{metric.icon}</span>
                          {metric.label}
                        </label>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                            {getVibeLabel(ratings[metric.id])}
                          </span>
                          <span className="text-xs font-mono text-fuchsia-400 font-bold">
                            {ratings[metric.id]}/10
                          </span>
                        </div>
                      </div>
                      <div
                        className={`relative h-2 bg-slate-800 rounded-full overflow-hidden group transition-all ${!readOnly && "hover:h-3 cursor-pointer"}`}
                      >
                        <input
                          type="range"
                          min="1"
                          max="10"
                          disabled={readOnly}
                          value={ratings[metric.id]}
                          onChange={(e) =>
                            setRatings({
                              ...ratings,
                              [metric.id]: parseInt(e.target.value),
                            })
                          }
                          className={`absolute inset-0 w-full opacity-0 z-10 ${readOnly ? "cursor-default" : "cursor-pointer"}`}
                        />
                        {/* Neon Glow Track */}
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-300 shadow-[0_0_10px_rgba(217,70,239,0.5)]"
                          style={{ width: `${ratings[metric.id] * 10}%` }}
                        />
                        {/* Custom Thumb Glow (CSS Trick: Only visible where handle would be) */}
                        {!readOnly && (
                          <div
                            className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] pointer-events-none transition-all duration-300 opacity-0 group-hover:opacity-100"
                            style={{
                              left: `calc(${ratings[metric.id] * 10}% - 8px)`,
                            }}
                          />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        {metric.desc}
                      </p>
                    </div>
                  ))}
                </motion.div>

                {/* 2. Bento Grid: Photos + Notes */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Left: Photos */}
                  <div className="bg-slate-900/30 rounded-3xl p-4 border border-white/5">
                    <label className="block text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-violet-400" />
                      Visual Evidence{" "}
                      <span className="text-slate-600 text-xs">(Max 3)</span>
                    </label>

                    <div className="grid grid-cols-2 gap-3 h-32">
                      {/* Add Button - HIDE IF READONLY */}
                      {!readOnly && photos.length < 3 && (
                        <label className="col-span-1 h-full border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-fuchsia-500/50 hover:bg-fuchsia-500/5 transition-all group">
                          <Upload className="w-5 h-5 text-slate-500 group-hover:text-fuchsia-400 mb-1" />
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest group-hover:text-fuchsia-300">
                            Upload
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                          />
                        </label>
                      )}

                      {/* Photo Previews */}
                      <AnimatePresence mode="popLayout">
                        {photos.map((url, idx) => (
                          <motion.div
                            key={url}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{
                              opacity: 0,
                              scale: 0.8,
                              transition: { duration: 0.2 },
                            }}
                            className="relative col-span-1 h-full rounded-2xl overflow-hidden group"
                          >
                            <img
                              src={url}
                              alt="preview"
                              className="w-full h-full object-cover"
                            />
                            {!readOnly && (
                              <button
                                onClick={() =>
                                  setPhotos(photos.filter((_, i) => i !== idx))
                                }
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Right: Notes */}
                  <div className="bg-slate-900/30 rounded-3xl p-4 border border-white/5 flex flex-col">
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Mission Notes
                    </label>
                    <textarea
                      readOnly={readOnly}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={readOnly ? "No notes added." : "Briefing..."}
                      className={cn(
                        "flex-1 w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-slate-500 focus:outline-none resize-none font-sans",
                        !readOnly && "focus:ring-1 focus:ring-fuchsia-500/50",
                      )}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Footer Actions */}
              <div className="p-8 border-t border-white/5 bg-slate-900/50 backdrop-blur-md flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                    Overall Score
                  </span>
                  <span
                    className={cn(
                      "text-3xl font-bold font-mono transition-colors duration-500",
                      getScoreColor(overallScore),
                    )}
                  >
                    {overallScore}{" "}
                    <span className="text-slate-600 text-sm font-sans">
                      /10
                    </span>
                  </span>
                </div>

                {!readOnly && (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || isSuccess}
                    className={cn(
                      "flex items-center gap-3 px-8 py-3 rounded-xl font-bold font-clash transition-all duration-300 shadow-lg shadow-white/10",
                      isSuccess
                        ? "bg-emerald-500 text-white"
                        : "bg-white text-black hover:bg-slate-200",
                    )}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin text-fuchsia-600" />
                    ) : isSuccess ? (
                      <>
                        <span>Verified Submission</span>
                        <CheckCircle className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        <span>Submit Report</span>
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}

                {readOnly && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-mono uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Verified Submission</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;
