import React, { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { FEATURED_EVENTS, UPCOMING_EVENTS } from "@/data/mockEvents";
import { cn } from "@/lib/utils";

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

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  const event = useMemo(() => {
    const allEvents = [...FEATURED_EVENTS, ...UPCOMING_EVENTS];
    return allEvents.find((e) => e.id === id);
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);

  const handleRegister = () => {
    setRegistering(true);
    setTimeout(() => {
      setRegistering(false);
      alert("Registration secured! Coordinates sent to your profile.");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
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

  return (
    <div className="min-h-screen bg-black text-white selection:bg-fuchsia-500/30 font-inter">
      {/* I. NAVIGATION REFINEMENT (GHOST STYLE) */}
      {/* I. NAVIGATION REFINEMENT (NORMAL FLOW) */}
      <div className="relative z-20 max-w-[90rem] mx-auto px-6 md:px-12 pt-28 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
        >
          <div className="p-2.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="text-sm font-bold tracking-wide uppercase text-slate-500 group-hover:text-white transition-colors">
            Back to Experiences
          </span>
        </button>
      </div>

      {/* II. HERO SECTION (SOFTENED GEOMETRY) */}
      <div className="relative z-10 p-4 md:p-6 lg:p-10 lg:pt-0">
        <div className="relative min-h-[85vh] w-full rounded-[2.5rem] overflow-hidden border border-white/5">
          {/* Parallax Blurred Background */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover blur-3xl scale-125 opacity-40 transform-gpu"
            />
          </motion.div>

          {/* V. BACKGROUND FLOW (Z-0) */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
            {/* This space allows global background lines to be visible through the 'frosted' look */}
          </div>

          {/* Central Portal Content */}
          <div className="relative z-20 h-full w-full max-w-[90rem] mx-auto px-6 md:px-12 flex flex-col justify-end pb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col md:flex-row gap-12 lg:gap-20 items-end"
            >
              {/* Poster Image (Soft Corners) */}
              <div className="w-full md:w-[320px] lg:w-[420px] flex-shrink-0 group">
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>

              {/* Typography Hero */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                    {event.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                    {event.status || "CONFIRMED"}
                  </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-clash font-bold mb-8 leading-[0.9] tracking-tight">
                  {event.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                    <Calendar className="w-4 h-4 text-fuchsia-400" />
                    <span className="text-sm font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium">
                      {event.venue.name}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Narrative & Dashboard */}
      <div className="max-w-[90rem] mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* III. THE 'STORY' FEED & BENTO */}
          <div className="lg:w-3/5 space-y-24">
            {/* The Experience Section - Glass Panel Refinement */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-1 px-1 h-6 bg-fuchsia-500 rounded-full" />
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">
                  The Experience
                </h2>
              </div>

              <div className="relative group p-10 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-fuchsia-500/[0.03] blur-[120px] rounded-full" />
                <p className="text-2xl md:text-3xl font-clash font-medium text-slate-100 leading-tight mb-8">
                  {event.description}
                </p>
                <p className="text-lg text-slate-400 leading-relaxed font-inter">
                  {event.longDescription}
                </p>

                {/* Merit / Tags */}
                <div className="flex flex-wrap gap-3 mt-12">
                  {(event.badges || ["Merit", "Food", "E-Cert"]).map(
                    (badge, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400"
                      >
                        <Zap className="w-3 h-3" />
                        {badge}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </motion.section>

            {/* Timeline */}
            {event.agenda && (
              <section className="space-y-12">
                <div className="flex items-center gap-4">
                  <div className="w-1 px-1 h-6 bg-violet-500 rounded-full" />
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">
                    Timeline
                  </h2>
                </div>
                <div className="space-y-1">
                  {event.agenda.map((item, i) => (
                    <div
                      key={i}
                      className="group flex gap-8 p-6 rounded-3xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                    >
                      <span className="text-sm font-black text-fuchsia-500 font-mono pt-1">
                        {item.time}
                      </span>
                      <div>
                        <h4 className="text-xl font-clash font-bold text-white mb-2">
                          {item.title}
                        </h4>
                        <p className="text-slate-500 text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* IV. THE BENTO GALLERY (SOFT ROUNDED) */}
            <section className="space-y-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-1 px-1 h-6 bg-cyan-500 rounded-full" />
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">
                    Visuals
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[600px]">
                <div className="col-span-2 row-span-2 relative rounded-[2.5rem] overflow-hidden border border-white/10 group">
                  <img
                    src={event.gallery?.[0] || event.image}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors flex items-center gap-2">
                      <Maximize2 className="w-3 h-3" /> Preview Experience
                    </span>
                  </div>
                </div>
                <div className="col-span-1 row-span-1 relative rounded-[2rem] overflow-hidden border border-white/10">
                  <img
                    src={event.gallery?.[1] || event.image}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="col-span-1 row-span-1 relative rounded-[2rem] overflow-hidden border border-white/10">
                  <img
                    src={event.gallery?.[2] || event.image}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* II & III. SIDEBAR ACTION (LAUNCHPAD) */}
          <div className="lg:w-2/5">
            <div className="sticky top-24 space-y-6">
              {/* Glass Action Card */}
              <div className="p-10 bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] border border-white/10 relative overflow-hidden shadow-2xl">
                <BorderBeam />

                <div className="relative z-10 space-y-12">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4 text-center">
                      Reservation Portal
                    </p>
                    <h3 className="text-6xl font-clash font-bold text-white text-center tracking-tighter">
                      FREE
                    </h3>
                  </div>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-5 p-5 bg-white/5 border border-white/5 rounded-3xl group hover:border-white/10 transition-colors">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-fuchsia-400 transition-colors">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div className="font-inter">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Starts At
                        </p>
                        <p className="text-base font-bold text-white">
                          {event.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 p-5 bg-white/5 border border-white/5 rounded-3xl group hover:border-white/10 transition-colors">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="font-inter">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Location
                        </p>
                        <p className="text-base font-bold text-white pr-2 leading-tight">
                          {event.venue.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Registration Button (Tactile Glow) */}
                  <div className="space-y-4">
                    <motion.button
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 0 40px rgba(217, 70, 239, 0.4)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRegister}
                      disabled={registering}
                      className="relative w-full group overflow-hidden rounded-[1.5rem] bg-gradient-to-r from-fuchsia-600 to-violet-600 p-[1.5px]"
                    >
                      <div className="relative bg-black group-hover:bg-transparent transition-colors py-5 rounded-[1.4rem] flex items-center justify-center gap-3">
                        {registering ? (
                          <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Ticket className="w-5 h-5 text-fuchsia-400 group-hover:text-white" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">
                              Secure My Spot
                            </span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </div>
                    </motion.button>
                    <p className="text-center text-[10px] font-bold text-slate-600 tracking-wide uppercase">
                      Limited Capacity • Confirmed Access
                    </p>
                  </div>
                </div>
              </div>

              {/* IV. "SOCIAL SIGNAL" DASHBOARD */}
              <div className="p-8 bg-white/[0.02] backdrop-blur-2xl rounded-[3rem] border border-white/10 flex items-center justify-between text-center relative overflow-hidden group">
                <div className="flex-1 space-y-2">
                  <p className="text-2xl font-clash font-bold text-white">
                    1.2k
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Interested
                  </p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex-1 space-y-2">
                  <p className="text-2xl font-clash font-bold text-fuchsia-400">
                    42
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Remaining
                  </p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex-1 space-y-2">
                  <p className="text-2xl font-clash font-bold text-white">
                    85%
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Filled
                  </p>
                </div>
              </div>

              {/* Organizer Card */}
              <div className="p-6 bg-white/[0.01] hover:bg-white/[0.04] transition-colors border border-white/5 rounded-[2.5rem] flex items-center gap-5 group cursor-pointer">
                <img
                  src={
                    event.organizer.logo ||
                    "https://api.dicebear.com/7.x/shapes/svg?seed=Org"
                  }
                  className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10"
                />
                <div className="flex-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
                    Host Organizer
                  </p>
                  <h4 className="text-sm font-bold text-white group-hover:text-fuchsia-400 transition-colors uppercase">
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
    </div>
  );
};

export default EventDetails;
