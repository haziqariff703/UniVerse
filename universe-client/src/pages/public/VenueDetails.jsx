import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Users,
  ArrowLeft,
  Wifi,
  Monitor,
  Mic2,
  Tv,
  Layout,
  Wind,
  CheckCircle2,
  Speaker,
  Plug,
  PenTool,
} from "lucide-react";
import EventCard from "@/components/common/EventCard";
import { MOCK_VENUES } from "@/data/mockVenues";

const UPCOMING_EVENTS_MOCK = [
  {
    id: 101,
    title: "Annual Tech Symposium",
    date: "2026-04-12",
    time: "10:00 AM",
    category: "Tech",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 102,
    title: "Classical Music Night",
    date: "2026-04-20",
    time: "7:00 PM",
    category: "Art",
    image:
      "https://images.unsplash.com/photo-1507838153414-b4b713384ebd?auto=format&fit=crop&q=80&w=400",
  },
];

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

  useEffect(() => {
    // Find venue from shared data
    const foundVenue = MOCK_VENUES.find((v) => v.id === parseInt(id));
    if (foundVenue) {
      // Add fake upcoming events for presentation
      setVenue({ ...foundVenue, upcomingEvents: UPCOMING_EVENTS_MOCK });
    }
  }, [id]);

  if (!venue)
    return (
      <div className="min-h-screen pt-28 flex justify-center text-foreground text-xl">
        Loading Venue...
      </div>
    );

  const accentGlow =
    venue.glowColor === "cyan" ? "bg-cyan-600/90" : "bg-purple-600/90";

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
              {venue.type && (
                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white/90 border border-white/10">
                  {venue.type}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-clash font-bold text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 tracking-tight">
              {venue.name}
            </h1>
            <p className="text-gray-300 max-w-2xl text-base md:text-lg font-light animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 leading-relaxed font-sans opacity-80">
              {venue.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Col: Facilities & Info */}
          <div className="lg:col-span-1 space-y-6 animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
            <div className="glass-panel p-8 rounded-[2rem] border border-border bg-card/50 backdrop-blur-xl">
              <h3 className="text-2xl font-clash font-bold text-card-foreground mb-6 flex items-center gap-2">
                Amenities{" "}
                <span className="text-sm font-mono text-muted-foreground opacity-50 font-normal">
                  // Full List
                </span>
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {venue.facilities.map((facility, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 text-muted-foreground p-4 rounded-2xl bg-muted/50 border border-border transition-colors hover:border-primary/50 group"
                  >
                    <div className="p-2 rounded-xl bg-background border border-border group-hover:text-primary transition-colors">
                      {getIconForFacility(facility)}
                    </div>
                    <span className="font-medium">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`glass-panel p-8 rounded-[2rem] bg-gradient-to-br transition-all duration-500 ${
                venue.glowColor === "cyan"
                  ? "from-cyan-900/40 to-indigo-900/40 border-cyan-500/20 shadow-cyan-500/10"
                  : "from-purple-900/40 to-indigo-900/40 border-purple-500/20 shadow-purple-500/10"
              } border shadow-xl`}
            >
              <h3 className="text-xl font-clash font-bold text-foreground mb-3">
                Ready to Organize?
              </h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                This venue is managed by the UiTM Puncak Perdana management. You
                can request booking when creating an official club event.
              </p>
              <button
                onClick={() => navigate("/organizer/create-event")}
                className="w-full py-4 bg-primary hover:bg-primary/80 text-primary-foreground rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                Book This Venue
              </button>
            </div>
          </div>

          {/* Right Col: Upcoming Events */}
          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 delay-300">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-clash font-bold text-foreground flex items-center gap-3">
                Live Events{" "}
                <span className="text-sm font-mono text-muted-foreground font-normal tracking-tighter">
                  @ {venue.name}
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {venue.upcomingEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="hover:-translate-y-2 transition-transform duration-300"
                >
                  <EventCard
                    event={{ ...event, location: venue.name }}
                    index={idx}
                  />
                </div>
              ))}
            </div>

            {venue.upcomingEvents.length === 0 && (
              <div className="p-16 text-center border-2 border-dashed border-border rounded-[2.5rem] bg-muted/30 text-muted-foreground">
                <div className="text-4xl mb-4">📅</div>
                <p className="text-lg font-medium">
                  No upcoming events scheduled at this venue.
                </p>
                <p className="text-sm">
                  Be the first to organize something great here!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
