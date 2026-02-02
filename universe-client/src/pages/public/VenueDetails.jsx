import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Users,
  ArrowLeft,
  ArrowRight,
  Wifi,
  Monitor,
  Mic2,
  Tv,
  Layout,
  Wind,
  CheckCircle2,
  Plug,
  PenTool,
  Lightbulb,
} from "lucide-react";
import useMalaysiaTime from "@/hooks/useMalaysiaTime";

const getIconForFacility = (facility) => {
  const lower = facility.toLowerCase();
  if (lower.includes("wifi")) return <Wifi className="w-4 h-4" />;
  if (lower.includes("projector")) return <Monitor className="w-4 h-4" />;
  if (lower.includes("sound") || lower.includes("mic") || lower.includes("pa"))
    return <Mic2 className="w-4 h-4" />;
  if (lower.includes("tv") || lower.includes("screen"))
    return <Tv className="w-4 h-4" />;
  if (lower.includes("ac") || lower.includes("air"))
    return <Wind className="w-4 h-4" />;
  if (lower.includes("stage")) return <Layout className="w-4 h-4" />;
  if (lower.includes("power")) return <Plug className="w-4 h-4" />;
  if (lower.includes("whiteboard")) return <PenTool className="w-4 h-4" />;
  return <CheckCircle2 className="w-4 h-4" />;
};

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const { time: malaysianTime } = useMalaysiaTime();

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/venues/${id}`);
        if (!res.ok) {
          throw new Error("Venue not found");
        }
        const data = await res.json();

        // Fetch upcoming events for this venue
        const eventsRes = await fetch(`${API_BASE}/api/venues/${id}/events`);
        let events = [];
        if (eventsRes.ok) {
          events = await eventsRes.json();
        }

        setVenue({
          ...data,
          upcomingEvents: events.length > 0 ? events : [], // Use real events or empty
        });
      } catch (err) {
        console.error("Failed to fetch venue:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVenue();
    }
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center text-foreground text-xl">
        <div className="w-16 h-16 border-4 border-fuchsia-500/20 border-t-fuchsia-500 rounded-full animate-spin mb-6" />
        <p className="animate-pulse">Loading Venue...</p>
      </div>
    );

  if (error || !venue)
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center text-foreground text-xl">
        <p className="text-rose-500 mb-6">{error || "Venue not found"}</p>
        <button
          onClick={() => navigate("/venues")}
          className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm"
        >
          Back to Venues
        </button>
      </div>
    );

  const accentGlow =
    venue.glowColor === "cyan" ? "bg-cyan-600/90" : "bg-purple-600/90";

  // --- Live Schedule Logic ---
  const getScheduleSlots = () => {
    // Helper to get consistent Malaysia time parts
    const getMYTimeContext = (dateObj) => {
      const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kuala_Lumpur",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        hour12: false,
      });
      const parts = formatter.formatToParts(dateObj);
      const d = {};
      parts.forEach(({ type, value }) => {
        d[type] = value;
      });
      return {
        dateStr: `${d.year}-${d.month}-${d.day}`, // YYYY-MM-DD
        hour: parseInt(d.hour),
      };
    };

    const nowContext = getMYTimeContext(malaysianTime);
    const slots = [];
    const startHour = 8;
    const endHour = 22;

    // Filter events for "Today" in Malaysia
    const todayEvents = venue.upcomingEvents.filter((event) => {
      const d = event.date_time || event.date;
      if (!d) return false;
      const eventContext = getMYTimeContext(new Date(d));
      return eventContext.dateStr === nowContext.dateStr;
    });

    for (let h = startHour; h <= endHour; h++) {
      const hourStr = h.toString().padStart(2, "0") + ":00";

      const isBooked = todayEvents.some((event) => {
        if (!event.date_time) return false;

        const eventDate = new Date(event.date_time);
        const eventContext = getMYTimeContext(eventDate);
        const duration = event.duration_minutes || 60;
        const startH = eventContext.hour;
        const endH = startH + Math.ceil(duration / 60);

        return h >= startH && h < endH;
      });

      slots.push({ time: hourStr, status: isBooked ? "Booked" : "Free" });
    }
    return slots;
  };

  const scheduleSlots = getScheduleSlots();

  return (
    <div className="min-h-screen pt-6 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/venues")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors font-bold"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Venues
        </button>

        {/* Hero Section */}
        <div className="relative w-full h-[450px] rounded-[2rem] overflow-hidden mb-8 group shadow-2xl shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
          <img
            src={venue.image}
            alt={venue.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full">
            <div className="flex flex-wrap items-center gap-3 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span
                className={`px-4 py-1.5 ${accentGlow} backdrop-blur-md rounded-full text-xs font-mono font-bold text-white border border-white/20 shadow-lg`}
              >
                {venue.location_code}
              </span>
              <span className="flex items-center gap-2 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-white/90 border border-white/10 shadow-lg">
                <Users className="w-3.5 h-3.5" /> {venue.max_capacity} Max
                Capacity
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-clash font-bold text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 tracking-tight">
              {venue.name}
            </h1>
            <p className="text-gray-300 max-w-2xl text-base md:text-lg font-light animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 leading-relaxed font-sans opacity-80">
              {venue.description}
            </p>
          </div>
        </div>

        {/* --- LUMA HYBRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          {/* LEFT COLUMN (Information Stack) - Span 8 */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Amenities (Smart Update) */}
            <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-xl">
              <h3 className="text-2xl font-clash font-bold text-white mb-6 flex items-center gap-2">
                Amenities{" "}
                <span className="text-sm font-mono text-slate-500 font-normal">
                  // Full List
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {venue.facilities.map((facility, idx) => {
                  // Mock Status Generation based on facility name
                  let status = "Active";
                  if (facility.toLowerCase().includes("wifi"))
                    status = "Excellent (5G)";
                  if (facility.toLowerCase().includes("power"))
                    status = "24 Ports Available";
                  if (facility.toLowerCase().includes("projector"))
                    status = "4K Laser";
                  if (facility.toLowerCase().includes("ac"))
                    status = "21°C Climate Control";

                  return (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:border-white/10 group"
                    >
                      <div className="flex items-center gap-3 text-slate-300">
                        <div className="p-2 rounded-xl bg-black/40 border border-white/10 group-hover:text-fuchsia-400 transition-colors">
                          {getIconForFacility(facility)}
                        </div>
                        <span className="font-medium text-sm md:text-base">
                          {facility}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 bg-white/5 px-2 py-1 rounded-md">
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Essential Info (Live Data) */}
            <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-xl">
              <h3 className="text-xl font-clash font-bold text-white mb-6">
                Essential Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">
                    Access Hours
                  </p>
                  <p className="text-lg font-bold text-white">
                    {venue.accessHours || "08:00 - 22:00"}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">
                    Access Level
                  </p>
                  <p className="text-lg font-bold text-white flex items-center gap-2">
                    {venue.accessLevel || "Student ID"}
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">
                    Managed By
                  </p>
                  <p className="text-lg font-bold text-white">
                    {venue.managedBy || "HEP Office"}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Availability Widget (Live Schedule) */}
            <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-clash font-bold text-white">
                  Live Schedule
                </h3>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
                  Live Updates
                </span>
              </div>

              {/* Visual Timeline Strip */}
              <div className="w-full bg-white/5 rounded-xl overflow-hidden flex flex-wrap lg:flex-nowrap border border-white/5">
                {scheduleSlots.map((slot, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 min-w-[3rem] h-12 flex items-center justify-center text-[10px] border-r border-white/5 last:border-r-0 transition-all 
                        ${
                          slot.status === "Booked"
                            ? "bg-rose-500/20 text-rose-400 cursor-not-allowed pattern-diagonal-lines"
                            : "bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                        }`}
                    title={`${slot.time} - ${slot.status}`}
                  >
                    {slot.status === "Booked" ? "BUSY" : slot.time}
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-3 text-xs font-mono text-slate-500">
                <span>08:00</span>
                <span className="uppercase text-fuchsia-400/50">
                  Today:{" "}
                  {malaysianTime.toLocaleDateString("en-MY", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <span>22:00</span>
              </div>
            </div>

            {/* 4. Insider Radar */}
            <div className="glass-panel p-8 rounded-[2.5rem] border border-fuchsia-500/20 bg-fuchsia-500/5 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <Lightbulb size={60} className="text-fuchsia-400" />
              </div>

              <h3 className="text-xl font-clash font-bold text-white mb-6 flex items-center gap-2">
                Student Inside Radar
              </h3>

              <div className="space-y-4">
                {[
                  {
                    txt: "Best Wi-Fi signal is near the north-facing windows.",
                    time: "Verified 2 days ago",
                  },
                  {
                    txt: "Hoodie required: AC is set to a constant 16°C here.",
                    time: "Verified 5 days ago",
                  },
                  {
                    txt: "Peak crowds from 2PM - 4PM daily.",
                    time: "Live Traffic",
                  },
                  {
                    txt: "Hidden power sockets are located behind the back pillars.",
                    time: "Verified 1 week ago",
                  },
                ].map((hack, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex justify-between items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-default"
                  >
                    <div className="flex gap-4">
                      <div className="w-1 h-auto bg-fuchsia-500 rounded-full shrink-0" />
                      <p className="text-sm text-slate-300 leading-relaxed font-sans">
                        {hack.txt}
                      </p>
                    </div>
                    <span className="shrink-0 text-[9px] font-mono text-slate-500 uppercase tracking-wide">
                      {hack.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Sticky Sidebar) - Span 4 */}
          <div className="lg:col-span-4 space-y-8 h-full">
            <div className="sticky top-24 space-y-8 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar pr-1">
              {/* 1. Booking Card (Restricted Access) */}
              {user &&
                (user.is_organizer_approved || user.role === "admin") && (
                  <div
                    className={`glass-panel p-8 rounded-[2.5rem] bg-gradient-to-br transition-all duration-500 ${
                      venue.glowColor === "cyan"
                        ? "from-cyan-900/40 to-indigo-900/40 border-cyan-500/20 shadow-cyan-500/10"
                        : "from-purple-900/40 to-indigo-900/40 border-purple-500/20 shadow-purple-500/10"
                    } border shadow-xl relative overflow-hidden`}
                  >
                    {/* Decorative Blur */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 blur-[50px] rounded-full pointer-events-none" />

                    <h3 className="text-2xl font-clash font-bold text-white mb-2">
                      Ready to Organize?
                    </h3>
                    <p className="text-sm text-slate-300 mb-6 leading-relaxed opacity-90">
                      Secure this venue for your club's next big event. Approval
                      required from HEP.
                    </p>
                    <button
                      onClick={() => navigate("/organizer/create-event")}
                      className="w-full py-4 bg-white text-black rounded-2xl font-bold font-clash transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
                    >
                      Book This Venue <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[10px] text-center text-white/40 mt-3 font-mono">
                      Instant availability check
                    </p>
                  </div>
                )}

              {/* 2. Live Events Stack */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-clash font-bold text-white flex items-center gap-2">
                    Live Events{" "}
                    <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                      LIVE
                    </span>
                  </h3>
                </div>

                <div className="space-y-4">
                  {venue.upcomingEvents.map((event, idx) => (
                    <div
                      key={idx}
                      className="group relative p-5 rounded-[2rem] bg-black/40 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="absolute top-4 right-4 text-[10px] text-slate-500 font-mono">
                        {new Date(event.date_time).toLocaleDateString()}
                      </div>
                      <h4 className="text-lg font-bold text-white font-clash mb-1 group-hover:text-fuchsia-400 transition-colors">
                        {event.title}
                      </h4>
                      <p className="text-sm text-slate-400 mb-4">
                        {new Date(event.date_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <button className="w-full py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider">
                        RSVP Now
                      </button>
                    </div>
                  ))}

                  {venue.upcomingEvents.length === 0 && (
                    <div className="p-8 text-center border border-dashed border-white/10 rounded-[2rem]">
                      <p className="text-slate-500 text-sm">
                        No events scheduled.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
