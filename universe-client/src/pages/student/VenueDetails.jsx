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
} from "lucide-react";
import EventCard from "@/components/common/EventCard";

// Mock Data (in a real app, this would be fetched or shared)
const getVenueData = (id) => {
  return {
    id: id,
    name: "Grand Aurora Hall",
    location_code: "GAH-01",
    max_capacity: 1000,
    facilities: [
      "Stage",
      "Projector",
      "Sound System",
      "AC",
      "Backstage",
      "Wifi",
      "Lounge",
    ],
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200",
    description:
      "The Grand Aurora Hall is the university's premier event space, perfect for large-scale conferences, performances, and galas. Featuring state-of-the-art acoustics and lighting.",
    upcomingEvents: [
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
    ],
  };
};

const getIconForFacility = (facility) => {
  const lower = facility.toLowerCase();
  if (lower.includes("wifi")) return <Wifi className="w-4 h-4" />;
  if (lower.includes("projector")) return <Monitor className="w-4 h-4" />;
  if (lower.includes("sound") || lower.includes("mic"))
    return <Mic2 className="w-4 h-4" />;
  if (lower.includes("tv") || lower.includes("screen"))
    return <Tv className="w-4 h-4" />;
  if (lower.includes("ac") || lower.includes("air"))
    return <Wind className="w-4 h-4" />;
  return <Layout className="w-4 h-4" />;
};

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setVenue(getVenueData(id));
    }, 100);
  }, [id]);

  if (!venue)
    return (
      <div className="min-h-screen pt-28 flex justify-center text-foreground text-xl">
        Loading Venue...
      </div>
    );

  return (
    <div className="min-h-screen pt-6 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/venues")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Venues
        </button>

        {/* Hero Section */}
        <div className="relative w-full h-[400px] rounded-3xl overflow-hidden mb-8 group">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          <img
            src={venue.image}
            alt={venue.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20">
            <div className="flex items-center gap-3 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="px-3 py-1 bg-violet-600/90 backdrop-blur-md rounded-full text-xs font-mono text-white border border-white/10">
                {venue.location_code}
              </span>
              <span className="flex items-center gap-1 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium text-white/90 border border-white/10">
                <Users className="w-3 h-3" /> {venue.max_capacity} Capacity
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-neuemontreal font-bold text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              {venue.name}
            </h1>
            <p className="text-gray-300 max-w-2xl text-lg animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              {venue.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Col: Facilities & Info */}
          <div className="lg:col-span-1 space-y-6 animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
            <div className="glass-panel p-6 rounded-2xl border border-border bg-card">
              <h3 className="text-xl font-bold text-card-foreground mb-4">
                Facilities
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {venue.facilities.map((facility, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-muted-foreground p-2 rounded-lg bg-muted border border-border"
                  >
                    {getIconForFacility(facility)}
                    <span>{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-violet-900/20 to-indigo-900/20 border-violet-500/20">
              <h3 className="text-lg font-bold text-foreground mb-2">
                Book This Venue?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Organizers can request this venue when creating an event. Check
                availability in the event creation flow.
              </p>
              <button
                onClick={() => navigate("/organizer/create-event")}
                className="w-full py-2 bg-accent hover:bg-accent/80 text-accent-foreground rounded-lg font-medium transition-colors"
              >
                Create Event Here
              </button>
            </div>
          </div>

          {/* Right Col: Upcoming Events */}
          <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 delay-300">
            <h3 className="text-2xl font-bold text-foreground">
              Upcoming Events at {venue.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {venue.upcomingEvents.map((event, idx) => (
                <EventCard
                  key={idx}
                  event={{ ...event, location: venue.name }}
                  index={idx}
                />
              ))}
            </div>
            {venue.upcomingEvents.length === 0 && (
              <div className="p-8 text-center border border-border rounded-2xl bg-muted border-dashed text-muted-foreground">
                No upcoming events scheduled at this venue.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
