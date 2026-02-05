import {
  Users,
  MapPin,
  Clock,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Layers,
  Sparkles,
  ArrowLeft,
  Share2,
  Heart,
  Navigation,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { Badge } from "@/components/ui/badge";
import { getVenueStatus } from "@/lib/venueUtils";
import VenueHeatmap from "@/components/venues/VenueHeatmap";
import { cn } from "@/lib/utils";
import { useParams, useNavigate } from "react-router-dom"; // Added useParams, useNavigate
import { useState, useEffect } from "react"; // Added useState, useEffect

const API_BASE = "http://localhost:5000";

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const venueStatus = venue
    ? getVenueStatus(venue.accessHours || "08:00 - 22:00")
    : null;

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        setLoading(true);
        // Step 1: Fetch Venue Info
        const res = await fetch(`${API_BASE}/api/venues/${id}`);
        const data = await res.json();

        if (res.ok) {
          // Step 2: Fetch Upcoming Events for this venue
          const eventsRes = await fetch(`${API_BASE}/api/venues/${id}/events`);
          const eventsData = await eventsRes.json();
          setVenue({ ...data, upcomingEvents: eventsData || [] });
        } else {
          console.error("Venue not found");
        }
      } catch (error) {
        console.error("Error fetching venue details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-fuchsia-500/20 rounded-full animate-ping" />
          <div className="absolute inset-0 w-16 h-16 border-t-2 border-fuchsia-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-white/5 shadow-2xl">
          <Info className="w-10 h-10 text-zinc-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Venue Not Found</h2>
        <p className="text-zinc-500 mb-8 text-center max-w-md">
          The location registry could not find the specified venue ID in our
          current database.
        </p>
        <Button
          onClick={() => navigate("/venues")}
          className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-8 rounded-full h-12"
        >
          Back to Exploratory
        </Button>
      </div>
    );
  }

  const accentColor =
    venue.glowColor === "cyan" ? "text-cyan-400" : "text-fuchsia-400";
  const accentGlow =
    venue.glowColor === "cyan" ? "bg-cyan-500/20" : "bg-fuchsia-500/20";
  const accentBorder =
    venue.glowColor === "cyan" ? "border-cyan-500/30" : "border-fuchsia-500/30";

  return (
    <div className="min-h-screen bg-black/20 text-white selection:bg-fuchsia-500/30">
      {/* 1. CINEMATIC HERO SECTION */}
      <div className="relative h-[65vh] md:h-[75vh] w-full overflow-hidden">
        {/* Background Image with Parallax-esque feel */}
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          src={
            venue.image
              ? venue.image.startsWith("http")
                ? venue.image
                : `${API_BASE}/${venue.image}`
              : "/placeholder-venue.jpg"
          }
          className="absolute inset-0 w-full h-full object-cover grayscale-[20%]"
        />

        {/* Sophisticated Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

        {/* Floating Controls */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-50">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all group"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex gap-3">
            <button className="p-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <Share2 className="w-6 h-6" />
            </button>
            <button className="p-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-fuchsia-500">
              <Heart className="w-6 h-6 fill-fuchsia-500" />
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-16 left-8 right-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span
                className={`px-4 py-1.5 ${accentGlow} backdrop-blur-md rounded-full text-xs font-mono font-bold text-white border border-white/20 shadow-lg`}
              >
                {venue.location_code}
              </span>
              {venueStatus && (
                <span
                  className={`px-4 py-1.5 backdrop-blur-md rounded-full text-xs font-bold border shadow-lg ${
                    venueStatus.isOpen
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                  }`}
                >
                  {venueStatus.status}
                </span>
              )}
              <span className="flex items-center gap-2 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-white/90 border border-white/10 shadow-lg">
                <Users className="w-3.5 h-3.5" /> {venue.max_capacity} Max
                Capacity
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-clash font-bold tracking-tighter mb-6 leading-none">
              {venue.name.split(" ").map((word, i) => (
                <span key={i} className="inline-block mr-4 last:mr-0">
                  {word}
                </span>
              ))}
            </h1>

            <div className="flex flex-wrap items-center gap-8 text-zinc-300">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 ${accentGlow} rounded-lg border ${accentBorder}`}
                >
                  <MapPin className={`w-4 h-4 ${accentColor}`} />
                </div>
                <span className="text-sm font-medium tracking-wide">
                  Level {venue.location_code.split("-")[1] || "G"} • Main Wing
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 ${accentGlow} rounded-lg border ${accentBorder}`}
                >
                  <Clock className={`w-4 h-4 ${accentColor}`} />
                </div>
                <span className="text-sm font-medium tracking-wide">
                  Available Today until{" "}
                  {venue.accessHours?.split("-")[1] || "22:00"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. CORE SPECIFICATIONS GRID */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-12 gap-12">
          {/* LEFT COLUMN (Details) */}
          <div className="col-span-12 lg:col-span-8 space-y-16">
            {/* Description Block */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-[1px] bg-fuchsia-500" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-fuchsia-500">
                  Strategic Brief
                </h2>
              </div>
              <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed font-light">
                {venue.description}
              </p>
            </section>

            {/* Smart Facilities Matrix */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-[1px] bg-sky-500" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-sky-500">
                  Utility Matrix
                </h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {venue.facilities.map((fac, idx) => (
                  <SpotlightCard
                    key={idx}
                    className="bg-zinc-900/40 border-white/5 p-6 group hover:border-sky-500/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-zinc-800 rounded-2xl group-hover:bg-sky-500/10 transition-colors">
                        <Sparkles className="w-5 h-5 text-sky-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-wider">
                          {fac}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono">
                          Verified
                        </p>
                      </div>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </section>

            {/* 3. LIVE EVENTS STACK */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-amber-500" />
                  <h2 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-amber-500">
                    Live Events Stack
                  </h2>
                </div>
                {venue.upcomingEvents?.length > 0 && (
                  <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                    {venue.upcomingEvents.length} Active Sessions
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                {venue.upcomingEvents && venue.upcomingEvents.length > 0 ? (
                  venue.upcomingEvents.map((event, idx) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group bg-zinc-900/40 hover:bg-zinc-900/60 border border-white/5 hover:border-amber-500/30 p-5 rounded-[2rem] flex flex-col md:flex-row md:items-center gap-6 transition-all cursor-pointer"
                      onClick={() => navigate(`/events/${event._id}`)}
                    >
                      {/* Event Mini Thumb */}
                      <div className="w-full md:w-32 h-20 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                        <img
                          src={
                            event.image
                              ? event.image.startsWith("http")
                                ? event.image
                                : `${API_BASE}/${event.image}`
                              : "/placeholder-event.jpg"
                          }
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>

                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500 font-medium">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />{" "}
                            {new Date(event.date_time).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5 uppercase tracking-widest text-[10px] text-zinc-600">
                            • {event.tags?.[0] || "General"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 md:w-48">
                        <div className="text-right">
                          <p className="text-xs text-zinc-500 font-mono">
                            Attendance
                          </p>
                          <p className="text-sm font-bold text-white">
                            {event.current_attendees} / {event.capacity}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 text-center border border-dashed border-white/10 rounded-[2.5rem]">
                    <div className="w-16 h-16 bg-zinc-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                      <Calendar className="w-8 h-8 text-zinc-600" />
                    </div>
                    <p className="text-zinc-500 font-medium font-clash">
                      No events currently scheduled.
                    </p>
                    <p className="text-zinc-600 text-xs mt-1">
                      Check back later for updated availability.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN (Sticky Side Panel) */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="sticky top-8 space-y-8">
              {/* 4. Insider Radar */}
              <div className="glass-panel p-8 rounded-[2.5rem] bg-zinc-900/10 border border-white/5 relative overflow-hidden group">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 blur-3xl rounded-full" />

                <div className="relative z-10">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-8 border-b border-white/5 pb-4">
                    Inside Track
                  </h3>

                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-fuchsia-500/10 rounded-xl border border-fuchsia-500/20">
                        <ShieldCheck className="w-5 h-5 text-fuchsia-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-1">
                          Access Policy
                        </p>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                          {venue.accessLevel ||
                            "Requires valid student or member credentials for entry."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-sky-500/10 rounded-xl border border-sky-500/20">
                        <Layers className="w-5 h-5 text-sky-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-1">
                          Best For
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {venue.bestFor?.map((item, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-zinc-800 rounded-lg text-[10px] font-bold text-zinc-400 border border-white/5 uppercase"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <Users className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white mb-1">
                          Management
                        </p>
                        <p className="text-xs text-zinc-500 font-medium">
                          {venue.managedBy}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
                    <Button
                      onClick={() => setShowHeatmap(!showHeatmap)}
                      className={cn(
                        "w-full h-14 rounded-2xl font-clash font-bold text-sm uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]",
                        showHeatmap
                          ? "bg-fuchsia-600 text-white hover:bg-fuchsia-500"
                          : "bg-white text-black hover:bg-zinc-200",
                      )}
                    >
                      {showHeatmap ? "Hide Live Density" : "Check Live Density"}
                    </Button>
                    <button className="w-full h-14 bg-zinc-900 text-white border border-white/10 hover:bg-zinc-800 rounded-2xl font-clash font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                      <Navigation className="w-4 h-4 text-fuchsia-500" />
                      Point Navigation
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Banner */}
              <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Verified Safe Zone • Security Monitored
                </p>
              </div>

              {/* Heatmap Overlay Integration */}
              <AnimatePresence>
                {showHeatmap && (
                  <VenueHeatmap venue={venue} events={venue.upcomingEvents} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
