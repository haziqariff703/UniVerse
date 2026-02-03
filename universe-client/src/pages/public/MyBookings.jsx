import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReviewModal from "@/components/common/ReviewModal";
import {
  Calendar,
  MapPin,
  Tag,
  ChevronRight,
  Filter,
  ArrowRight,
  Clock,
  CreditCard,
  Ticket,
  CheckCircle2,
  XCircle,
  Clock4,
} from "lucide-react";
import { Link } from "react-router-dom";
import TrueFocus from "@/components/ui/TrueFocus";
import { cn } from "@/lib/utils";
import QRCode from "react-qr-code";

const API_BASE = "http://localhost:5000";

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  // Review System State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewEvent, setReviewEvent] = useState(null);

  const handleOpenReview = (booking) => {
    // Only allow reviewing checked-in events
    if (booking.status === "CheckedIn") {
      setReviewEvent({
        id: booking.eventId, // Ensure this maps correctly from your data
        title: booking.title,
      });
      setShowReviewModal(true);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    if (!reviewEvent?.id) {
      alert("Error: Missing Event ID. Data: " + JSON.stringify(reviewEvent));
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log(
        "Submitting to:",
        `${API_BASE}/api/events/${reviewEvent.id}/reviews`,
      );

      const formData = new FormData();
      formData.append("rating", reviewData.rating);
      formData.append("value", reviewData.value);
      formData.append("energy", reviewData.energy);
      formData.append("welfare", reviewData.welfare);
      formData.append("comment", reviewData.comment);

      if (reviewData.photos && reviewData.photos.length > 0) {
        reviewData.photos.forEach((file) => {
          formData.append("photos", file);
        });
      }

      const res = await fetch(
        `${API_BASE}/api/events/${reviewEvent.id}/reviews`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        data = { message: await res.text() };
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      console.log("Review submitted successfully:", data);
    } catch (err) {
      console.error("Review submission error:", err);
      alert("Booking Page Error: " + err.message);
      throw err; // Re-throw so ReviewModal knows it failed
    }
  };

  // Fetch bookings on mount - read token directly from localStorage
  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No auth token found, skipping fetch");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/registrations/my-bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch bookings:", res.status);
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log("Bookings data received:", data);

        const mapped = Array.isArray(data)
          ? data.map((reg) => ({
              id: reg._id,
              eventId: reg.event_id?._id || reg.event_snapshot?._id,
              title:
                reg.event_snapshot?.title ||
                reg.event_id?.title ||
                "Unknown Event",
              date: new Date(
                reg.event_snapshot?.date_time || reg.event_id?.date_time,
              ).toLocaleDateString("en-MY", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              time: new Date(
                reg.event_snapshot?.date_time || reg.event_id?.date_time,
              ).toLocaleTimeString("en-MY", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              location:
                reg.event_id?.venue_id?.name ||
                reg.event_snapshot?.venue ||
                "TBA",
              status: reg.status,
              category: reg.event_id?.category || "Community",
              price:
                reg.status === "CheckedIn"
                  ? "Verified"
                  : reg.event_id?.ticket_price > 0
                    ? `RM ${reg.event_id.ticket_price}`
                    : "Free (+Merit)",
              image: reg.event_id?.image
                ? `${API_BASE}/${reg.event_id.image}`
                : "/placeholder-event.jpg",
              qr_code: reg.qr_code_string,
            }))
          : [];

        setBookings(mapped);
      } catch (err) {
        console.error("Fetch bookings error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []); // Run once on mount

  const TABS = [
    { id: "all", label: "All Passes" },
    { id: "confirmed", label: "Scheduled" },
    { id: "checkedin", label: "Completed" },
    { id: "cancelled", label: "Canceled" },
  ];

  const filteredBookings =
    activeTab === "all"
      ? bookings
      : bookings.filter(
          (b) => b.status.toLowerCase() === activeTab.toLowerCase(),
        );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" />
            Confirmed
          </div>
        );
      case "CheckedIn":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/10 border border-white/5 text-slate-400 text-[10px] font-bold font-mono uppercase tracking-wider">
            <Clock4 className="w-3 h-3" />
            Verified Access
          </div>
        );
      case "Cancelled":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold font-mono uppercase tracking-wider">
            <XCircle className="w-3 h-3" />
            Voided
          </div>
        );
      default:
        return null;
    }
  };

  // Helper to check if reviewable
  const canReview = (status) => status === "CheckedIn";

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
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen pt-0 pb-20 px-4 md:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-8">
          <div>
            <TrueFocus
              sentence="My Bookings"
              manualMode={false}
              blurAmount={10}
              borderColor="#D946EF" // Fuchsia-500
              animationDuration={0.8}
              pauseBetweenAnimations={1}
              fontSize="text-4xl md:text-7xl"
            />
            <p className="text-slate-400 font-clash text-lg md:text-xl max-w-xl mt-4 leading-relaxed">
              Manage your{" "}
              <span className="text-white italic">digital passes</span> and
              upcoming event schedule.
            </p>
          </div>

          {/* SLIDING TAB SWITCHER */}
          <div className="relative flex p-1.5 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] self-start md:self-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative px-6 py-2.5 rounded-[1.5rem] text-xs font-bold font-clash transition-colors z-10",
                  activeTab === tab.id
                    ? "text-black"
                    : "text-slate-400 hover:text-white",
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-white rounded-[1.5rem] shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FEED SECTION */}
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-8"
        >
          {loading ? (
            <div className="grid grid-cols-1 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-[2.5rem] bg-slate-900/40 animate-pulse border border-white/5"
                />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((pass) => (
                  <motion.div
                    key={pass.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="group relative flex flex-col lg:flex-row items-stretch rounded-[2.5rem] bg-black/40 backdrop-blur-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-500 shadow-2xl"
                  >
                    {/* MAIN SECTION (70%) */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center min-w-0">
                      {/* Event Thumbnail */}
                      <div className="relative w-full md:w-56 h-48 rounded-[1.5rem] overflow-hidden shrink-0 border border-white/5">
                        <img
                          src={pass.image}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          alt={pass.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <span className="px-2 py-0.5 rounded bg-white/10 backdrop-blur-md border border-white/10 text-[8px] font-black text-white uppercase tracking-widest">
                            {pass.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 py-2">
                        <p className="text-[10px] font-mono font-bold text-fuchsia-400 uppercase tracking-[0.3em] mb-3">
                          Entry Pass ID: {pass.id}
                        </p>
                        <h3 className="text-xl md:text-2xl font-bold font-clash text-white mb-6 group-hover:text-fuchsia-400 transition-colors tracking-tight">
                          {pass.title}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-white/5 text-slate-400">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-mono text-slate-300">
                              {pass.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-white/5 text-slate-400">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-mono text-slate-300 truncate">
                              {pass.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* TICKET PERFORATION EFFECT */}
                    <div className="hidden lg:flex flex-col items-center justify-between py-2 relative">
                      <div className="w-8 h-8 rounded-full bg-[#030712] absolute top-[-16px] border-b border-white/10 shadow-inner" />
                      <div className="flex-1 w-[1.5px] border-l border-dashed border-white/20 my-4" />
                      <div className="w-8 h-8 rounded-full bg-[#030712] absolute bottom-[-16px] border-t border-white/10 shadow-inner" />
                    </div>

                    {/* STUB SECTION (30%) */}
                    <div className="w-full lg:w-80 p-8 flex flex-col justify-between items-center lg:items-end border-t lg:border-t-0 border-white/5 bg-white/[0.02]">
                      <div className="flex flex-col items-center lg:items-end gap-2 mb-8 md:mb-0">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                          Pricing Model
                        </span>
                        <p className="text-3xl font-bold font-mono text-white tracking-tighter">
                          {pass.price}
                        </p>
                      </div>

                      <div className="flex flex-col items-center lg:items-end gap-6 w-full mt-auto">
                        {getStatusBadge(pass.status)}

                        {/* Review Button for Completed Events */}
                        {canReview(pass.status) && (
                          <button
                            onClick={() => handleOpenReview(pass)}
                            className="w-full relative group/btn px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-clash font-bold text-xs uppercase tracking-[0.2em] transition-all hover:bg-fuchsia-500/10 hover:border-fuchsia-500/30 mb-3"
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-fuchsia-400 transition-colors">
                              Rate Event <Ticket className="w-4 h-4" />
                            </span>
                          </button>
                        )}

                        {pass.status !== "Canceled" && (
                          <button
                            onClick={() => {
                              setSelectedBooking(pass);
                              setShowQRModal(true);
                            }}
                            className="w-full relative group/btn px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-clash font-bold text-xs uppercase tracking-[0.2em] transition-all hover:bg-white/10 active:scale-95 mb-3"
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              Show Entry Pass <Ticket className="w-4 h-4" />
                            </span>
                          </button>
                        )}

                        <Link
                          to={`/events/${pass.eventId}`}
                          className="w-full relative group/btn px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-2xl text-white font-clash font-bold text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] overflow-hidden text-center"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            View Details{" "}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                          </span>
                          {/* Inner Shimmer */}
                          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-32 rounded-[2.5rem] border border-dashed border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Ticket size={40} className="text-slate-600" />
                  </div>
                  <h3 className="text-2xl font-bold font-clash text-white mb-2">
                    Pass Vault Empty
                  </h3>
                  <p className="text-slate-500 font-clash">
                    Try adjusting your filters or browse new events.
                  </p>
                  <button
                    onClick={() => setActiveTab("all")}
                    className="mt-8 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold font-mono text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Reset Vault
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      {/* QR MODAL */}
      <AnimatePresence>
        {showQRModal && selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQRModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 flex flex-col items-center">
                <div className="w-16 h-1 bg-white/10 rounded-full mb-8" />

                <h3 className="text-xl font-bold text-white mb-2 text-center font-clash">
                  Your Digital Pass
                </h3>
                <p className="text-slate-500 text-xs mb-8 text-center uppercase tracking-widest font-mono">
                  {selectedBooking.title}
                </p>

                <div className="p-6 bg-white rounded-3xl mb-8">
                  <QRCode
                    value={selectedBooking.qr_code || "INVALID"}
                    size={200}
                    level="H"
                  />
                </div>

                <div className="w-full space-y-4">
                  <div className="flex justify-between items-center py-3 border-t border-white/5">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                      Pass ID
                    </span>
                    <span className="text-xs font-mono text-white">
                      {selectedBooking.id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t border-white/5">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                      Status
                    </span>
                    <span className="text-xs font-mono text-emerald-400">
                      Verified Access
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowQRModal(false)}
                  className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Close Pass
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REVIEW MODAL */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        event={reviewEvent}
        onSubmit={handleSubmitReview}
      />

      {/* Global CSS for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default MyBookings;
