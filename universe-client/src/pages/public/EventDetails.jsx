import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Ticket,
  Activity,
  Zap,
  ChevronRight,
  Info,
  Maximize2,
  Award,
  Utensils,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const API_BASE = "http://localhost:5000";

// Magic UI Simulated Border Beam
const BorderBeam = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,#D946EF_300deg,#8B5CF6_330deg,transparent_360deg)] opacity-40 blur-sm"
    />
  </div>
);

// PHASE 4: SUCCESS PARTICLES (STARDUST)
const SuccessParticles = () => {
  const colors = useMemo(() => ["#d946ef", "#8b5cf6", "#06b6d4"], []);

  // Use a ref to store stable random values
  const [particles] = useState(() =>
    Array.from({ length: 40 }).map((_, i) => ({
      angle: (i / 40) * Math.PI * 2 + Math.random(),
      distance: 100 + Math.random() * 200,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.2,
      rotate: Math.random() * 360,
    })),
  );

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-[100]">
      {particles.map((p, i) => {
        const x = Math.cos(p.angle) * p.distance;
        const y = Math.sin(p.angle) * p.distance;

        return (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [1, 1, 0],
              x,
              y,
              rotate: p.rotate,
            }}
            transition={{
              x: {
                type: "spring",
                stiffness: 100,
                damping: 10,
                delay: p.delay,
              },
              y: {
                type: "spring",
                stiffness: 100,
                damping: 10,
                delay: p.delay,
              },
              scale: { duration: 1.5, times: [0, 0.2, 1], delay: p.delay },
              opacity: { duration: 1.5, times: [0, 0.8, 1], delay: p.delay },
              rotate: { duration: 1.5, delay: p.delay },
            }}
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: "50%",
              position: "absolute",
              boxShadow: `0 0 12px ${p.color}`,
              filter: "blur(1px)",
            }}
          />
        );
      })}
    </div>
  );
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [currentFill, setCurrentFill] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [publicRegs, setPublicRegs] = useState({
    totalCount: 0,
    recentNames: [],
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/events/${id}`);
      if (!res.ok) throw new Error("Event not found");
      const data = await res.json();

      // Map API data to component props
      const mappedEvent = {
        ...data,
        id: data._id,
        image: data.image
          ? data.image.startsWith("http")
            ? data.image
            : `${API_BASE}/${data.image}`
          : "/placeholder-event.jpg",
        date: new Date(data.date_time).toLocaleDateString("en-MY", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: new Date(data.date_time).toLocaleTimeString("en-MY", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        finishDate: data.end_time
          ? new Date(data.end_time).toLocaleDateString("en-MY", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : null,
        finishTime: data.end_time
          ? new Date(data.end_time).toLocaleTimeString("en-MY", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : null,
        venue: {
          name: data.venue_id?.name || data.location || "TBA",
          location: data.venue_id?.location_code || "",
        },
        organizer: data.organizer_id || { name: "UniVerse" },
        meritValue: data.merit_points || 0,
      };

      setEvent(mappedEvent);
      // Calculate capacity percentage
      if (data.capacity > 0) {
        const fill = Math.min(
          100,
          Math.round((data.current_attendees / data.capacity) * 100),
        );
        setCurrentFill(fill);
      }

      const token = localStorage.getItem("token");

      // Check if user is already registered
      if (token) {
        const bookingsRes = await fetch(
          `${API_BASE}/api/registrations/my-bookings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (bookingsRes.ok) {
          const bookings = await bookingsRes.json();
          const alreadyJoined = bookings.some(
            (b) => b.event_id?._id === id || b.event_id === id,
          );
          setIsRegistered(alreadyJoined);
        }
      }

      // Fetch public registration info for social proof
      const regRes = await fetch(
        `${API_BASE}/api/registrations/event/${id}/public`,
      );
      if (regRes.ok) {
        const regData = await regRes.json();
        setPublicRegs(regData);
      }
    } catch (err) {
      console.error("Fetch error", err);
      navigate("/events");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEvent();
  }, [fetchEvent]);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0.2]);

  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isRegistered) return;

    setRegistering(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: event.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setShowSuccess(true);
      setIsRegistered(true);
      // Phase 2: Show Modal after particles travel 50%
      setTimeout(() => setShowModal(true), 400);

      // Phase 3: Cleanup and Status update
      setTimeout(() => {
        setShowSuccess(false);
        setCurrentFill((prev) => Math.min(100, prev + 1));
      }, 2000);

      // Re-fetch event to get updated attendee count
      fetchEvent();
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Registration Failed", {
        description: err.message,
      });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 rounded-full border border-fuchsia-500/50 flex items-center justify-center"
        >
          <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
        </motion.div>
      </div>
    );
  }

  if (!event) return null;

  const fillPercentage = currentFill;

  return (
    <div className="min-h-screen bg-black/20 text-white selection:bg-fuchsia-500/30 font-inter overflow-x-hidden">
      {/* I. NAVIGATION (FLOATING GHOST) */}
      <div className="fixed top-24 left-6 md:left-12 z-50">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Back
          </span>
        </button>
      </div>

      {/* II. FULL-BLEED CINEMATIC HERO */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent z-10" />
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transform-gpu"
          />
        </motion.div>

        {/* Content Overlay */}
        <div className="relative z-20 h-full max-w-[90rem] mx-auto px-6 md:px-12 flex flex-col justify-end pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-400 text-[10px] font-black tracking-widest uppercase backdrop-blur-md">
                {event.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black tracking-widest uppercase backdrop-blur-md">
                {event.status || "Confirmed"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-clash font-bold leading-[0.9] tracking-tighter max-w-4xl">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-fuchsia-400" />
                <span className="text-sm font-bold text-slate-200">
                  {event.date}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-slate-200">
                  {event.venue.name}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* LEFT CONTENT AREA */}
          <div className="lg:w-3/5 space-y-16">
            {/* 1. THE DESCRIPTION */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl md:text-3xl font-clash font-bold text-white mb-5">
                  The Experience
                </h2>
                <p className="text-xl text-slate-200 font-clash leading-snug mb-6">
                  {event.description}
                </p>
                <p className="text-base text-slate-400 leading-relaxed font-inter">
                  {event.longDescription}
                </p>
              </div>

              {/* NEW: PARTICIPANT REWARDS (PHASE 2) */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                  Participant Rewards
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="group p-6 rounded-[2rem] bg-slate-900/60 border border-white/10 hover:border-fuchsia-500/40 transition-all backdrop-blur-xl text-center md:text-left">
                    <div className="w-10 h-10 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400 mb-4 mx-auto md:mx-0 group-hover:shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all">
                      <Zap size={20} fill="currentColor" />
                    </div>
                    <p className="text-base font-clash font-bold text-white leading-none mb-1">
                      +{event.meritValue || 15} Merit
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      University Rank
                    </p>
                  </div>
                  <div className="group p-6 rounded-[2rem] bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 transition-all backdrop-blur-xl text-center md:text-left">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 mx-auto md:mx-0 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
                      <Award size={20} />
                    </div>
                    <p className="text-base font-clash font-bold text-white leading-none mb-1">
                      E-Certificate
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Digital Credential
                    </p>
                  </div>
                  <div className="group p-6 rounded-[2rem] bg-slate-900/60 border border-white/10 hover:border-violet-500/40 transition-all backdrop-blur-xl text-center md:text-left">
                    <div className="w-10 h-10 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-4 mx-auto md:mx-0 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all">
                      <Utensils size={20} />
                    </div>
                    <p className="text-base font-clash font-bold text-white leading-none mb-1">
                      Meal Provided
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Welfare Support
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* 2. TIMELINE */}
            {event.agenda && (
              <section className="space-y-12">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">
                  Timeline
                </h3>
                <div className="space-y-4">
                  {event.agenda.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group flex gap-6 p-6 rounded-[2rem] bg-slate-900/40 hover:bg-slate-900/60 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <span className="text-sm font-black text-fuchsia-500 font-mono pt-1">
                        {item.time}
                      </span>
                      <div>
                        <h4 className="text-lg font-clash font-bold text-white mb-2">
                          {item.title}
                        </h4>
                        <p className="text-slate-500 text-xs leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. FEATURED TALENT (DYNAMIC) */}
            {event.speaker_ids && event.speaker_ids.length > 0 && (
              <section className="space-y-12">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">
                  Featured Talent
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {event.speaker_ids.map((speaker, i) => (
                    <Link
                      key={speaker._id || i}
                      to={`/speakers/${speaker._id}`}
                      className="group relative h-[400px] rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-fuchsia-500/50 transition-all cursor-pointer"
                    >
                      <img
                        src={
                          speaker.image ||
                          "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
                        }
                        alt={speaker.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-all" />

                      <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="space-y-2">
                          <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-fuchsia-300">
                            {speaker.role || "Speaker"}
                          </span>
                          <h4 className="text-2xl font-clash font-bold text-white leading-none">
                            {speaker.name}
                          </h4>
                          <p className="text-sm text-slate-300 line-clamp-2">
                            {speaker.expertise || speaker.bio}
                          </p>
                        </div>
                      </div>

                      <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 border border-white/20">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT SIDEBAR (LAUNCHPAD) */}
          <div className="lg:w-2/5">
            <div className="sticky top-28 space-y-8">
              {/* LAUNCHPAD CARD */}
              <div className="p-8 bg-slate-950/80 backdrop-blur-3xl rounded-[3rem] border border-white/20 relative overflow-hidden shadow-2xl">
                <BorderBeam />

                <div className="relative z-10 space-y-10">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-5">
                      <Ticket size={12} />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] font-clash">
                        {event.ticket_price > 0
                          ? "Paid Entry"
                          : "Free Admission"}
                      </span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-clash font-bold text-white tracking-tighter leading-none mb-2">
                      {event.ticket_price > 0
                        ? `RM ${event.ticket_price}`
                        : "FREE"}
                    </h3>
                  </div>

                  {/* INFO GRID */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-[2rem] hover:border-white/20 transition-all">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900/80 flex items-center justify-center text-fuchsia-400 border border-white/5">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
                          Entry Time
                        </p>
                        <p className="text-base font-bold text-white leading-none">
                          {event.time}
                        </p>
                      </div>
                    </div>

                    {event.finishTime && (
                      <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-[2rem] hover:border-white/20 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900/80 flex items-center justify-center text-rose-400 border border-white/5">
                          <Clock className="w-6 h-6 rotate-180" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
                            Event Finish
                          </p>
                          <p className="text-base font-bold text-white leading-none">
                            {event.finishTime}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-[2rem] hover:border-white/20 transition-all">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900/80 flex items-center justify-center text-cyan-400 border border-white/5">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
                          Campus Hub
                        </p>
                        <p className="text-base font-bold text-white leading-none truncate">
                          {event.venue.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECURE SPOT ACTION */}
                  <div className="space-y-4 pt-4">
                    <motion.button
                      whileHover={
                        !isRegistered
                          ? {
                              scale: 1.02,
                              boxShadow: "0 0 40px rgba(217, 70, 239, 0.4)",
                            }
                          : {}
                      }
                      whileTap={!isRegistered ? { scale: 0.98 } : {}}
                      onClick={handleRegister}
                      disabled={registering || isRegistered}
                      className={cn(
                        "relative w-full group overflow-hidden rounded-[2rem] p-[1.5px] transition-all",
                        isRegistered
                          ? "bg-emerald-500/50"
                          : "bg-gradient-to-r from-fuchsia-600 to-violet-600",
                        !isRegistered && fillPercentage > 80 && "animate-pulse",
                      )}
                    >
                      <div
                        className={cn(
                          "relative transition-all py-6 rounded-[1.9rem] flex items-center justify-center gap-3",
                          isRegistered
                            ? "bg-emerald-950/20"
                            : "bg-black group-hover:bg-transparent",
                        )}
                      >
                        {registering ? (
                          <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin" />
                        ) : isRegistered ? (
                          <>
                            <Activity className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-400">
                              Registered!
                            </span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 text-fuchsia-400 group-hover:text-white" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                              Secure My Spot
                            </span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </div>
                      {showSuccess && <SuccessParticles />}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* SOCIAL PROOF & URGENCY (PHASE 3) */}
              <div className="p-8 bg-slate-950/80 backdrop-blur-2xl rounded-[3rem] border border-white/20 space-y-8">
                {/* Facepile + Count */}
                <div className="flex flex-col items-center gap-4">
                  <div className="flex -space-x-3">
                    {publicRegs.recentNames.length > 0 ? (
                      publicRegs.recentNames.slice(0, 4).map((name, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-slate-950 overflow-hidden ring-4 ring-white/5 bg-slate-900"
                        >
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
                            className="w-full h-full object-cover"
                            alt={name}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-900 flex items-center justify-center text-[10px] font-black ring-4 ring-white/5">
                        <Ticket size={16} />
                      </div>
                    )}
                    {publicRegs.totalCount > 4 && (
                      <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-900 flex items-center justify-center text-[10px] font-black ring-4 ring-white/5 text-fuchsia-400">
                        +{publicRegs.totalCount - 4}
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">
                    {publicRegs.totalCount > 0 ? (
                      <>
                        <span className="text-white">
                          {publicRegs.recentNames
                            .slice(0, 2)
                            .map((n) => n.split(" ")[0])
                            .join(", ")}
                        </span>
                        {publicRegs.totalCount > 2 && (
                          <> and {publicRegs.totalCount - 2} others</>
                        )}
                        {" are going"}
                      </>
                    ) : (
                      "Be the first to secure a spot!"
                    )}
                  </p>
                </div>

                {/* Animated Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Capacity Load
                    </p>
                    <p
                      className={cn(
                        "text-lg font-clash font-bold",
                        fillPercentage > 80 ? "text-rose-500" : "text-white",
                      )}
                    >
                      {fillPercentage}% Filled
                    </p>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${fillPercentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]",
                        fillPercentage > 80
                          ? "bg-gradient-to-r from-rose-500 to-fuchsia-600 shadow-rose-500/40"
                          : "bg-gradient-to-r from-fuchsia-400 to-violet-500",
                      )}
                    />
                  </div>
                  <p className="text-center text-[9px] font-bold text-rose-500/80 animate-pulse tracking-widest uppercase">
                    {fillPercentage > 80
                      ? "Critical: Almost Full — Act Now"
                      : "Plenty of spots"}
                  </p>
                </div>
              </div>

              {/* HOST CARD */}
              <div className="p-6 bg-slate-950/60 hover:bg-slate-900/80 transition-all border border-white/10 rounded-[2.5rem] flex items-center gap-5 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 p-1">
                  <img
                    src={
                      event.organizer.logo ||
                      "https://api.dicebear.com/7.x/shapes/svg?seed=Org"
                    }
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
                    Host Organizer
                  </p>
                  <h4 className="text-sm font-bold text-white group-hover:text-fuchsia-400 transition-colors uppercase font-clash tracking-wide">
                    {event.organizer.name}
                  </h4>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* SUCCESS MODAL OVERLAY */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative max-w-md w-full p-12 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-3xl border border-white/20 shadow-2xl text-center space-y-8 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-cyan-500/10" />

              <div className="relative z-10 w-24 h-24 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(217,70,239,0.2)]">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Zap
                    size={40}
                    className="text-fuchsia-400"
                    fill="currentColor"
                  />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-fuchsia-500/20"
                />
              </div>

              <div className="relative z-10 space-y-4">
                <h2 className="text-3xl md:text-4xl font-clash font-bold text-white tracking-tight">
                  Spot Secured, {user?.name || "Explorer"}!
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed px-4">
                  You've successfully secured your entry. Your digital
                  coordinates and QR ticket have been synced to your dashboard.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="relative z-10 w-full py-4 rounded-2xl bg-white text-black font-clash font-bold text-sm tracking-widest uppercase hover:bg-slate-200 transition-all active:scale-95"
              >
                Got It
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventDetails;
