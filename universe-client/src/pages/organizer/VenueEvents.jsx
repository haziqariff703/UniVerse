import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  Search,
  Loader,
  Info,
  Layers,
  Activity,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  Monitor,
} from "lucide-react";
import DecryptedText from "@/components/ui/DecryptedText";

const VenueEvents = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch venue details
        const venueRes = await fetch(`http://localhost:5000/api/admin/venues`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const venueData = await venueRes.json();
        const selectedVenue = venueData.venues?.find((v) => v._id === id);
        setVenue(selectedVenue);

        // Fetch events for this venue
        const eventsRes = await fetch(
          `http://localhost:5000/api/venues/${id}/events`,
        );
        const eventsData = await eventsRes.json();
        setEvents(eventsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent text-white">
        <Loader className="animate-spin text-violet-500" size={32} />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-white px-4 text-center">
        <div className="w-16 h-16 bg-zinc-950 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
          <Info size={24} className="text-slate-500" />
        </div>
        <h2 className="text-xl font-bold uppercase tracking-tight mb-4">
          Venue Not Found
        </h2>
        <Button
          onClick={() => navigate("/organizer/venues")}
          variant="outline"
          className="bg-white text-black hover:bg-slate-200 border-none px-8"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white pt-6 px-8 max-w-[1600px] mx-auto pb-20">
      {/* Dynamic Breadcrumbs - High Contrast */}
      <div className="flex items-center gap-3 mb-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/organizer/venues")}
          className="text-slate-300 hover:text-white p-0 h-auto"
        >
          <ChevronLeft size={18} className="text-violet-500" />
          <span className="text-xs font-bold uppercase tracking-widest ml-2">
            Back to Registry
          </span>
        </Button>
        <span className="text-slate-600">/</span>
        <Badge
          variant="secondary"
          className="bg-violet-500/20 text-violet-300 text-xs font-bold border border-violet-500/30 px-3 py-0.5"
        >
          {venue.location_code}
        </Badge>
      </div>

      {/* Hero Section - Solid Block Aesthetic */}
      <Card className="bg-zinc-950 border-white/10 mb-12 shadow-2xl p-8 lg:p-12">
        <div className="grid grid-cols-12 gap-8 lg:gap-16">
          <div className="col-span-12 lg:col-span-12">
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white m-0">
                  <DecryptedText
                    text={venue.name}
                    speed={80}
                    sequential={true}
                  />
                </h1>
              </div>
              <p className="text-slate-400 text-lg max-w-2xl">
                Operational registry and session management for location{" "}
                <span className="text-white font-mono">
                  {venue.location_code}
                </span>
                .
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 max-w-sm">
              <div className="flex flex-col gap-2 border-l border-white/10 pl-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Max Attendance
                </span>
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-violet-500" />
                  <span className="font-bold text-2xl">
                    {venue.max_capacity}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 border-l border-white/10 pl-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Total Sessions
                </span>
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-violet-500" />
                  <span className="font-bold text-2xl">{events.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Schedule Registry - Solid & Filterable */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Calendar size={24} className="text-violet-500" />
            Session Registry
          </h2>
          <div className="relative group w-full md:w-96">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
            <Input
              placeholder="Search by session title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border-white/10 pl-12 h-11 transition-all focus:border-violet-500"
            />
          </div>
        </div>

        {/* High Density Registry Items */}
        <div className="flex flex-col gap-3">
          {filteredEvents.map((event) => (
            <Card
              key={event._id}
              className="bg-zinc-950 border-white/10 hover:border-white/20 transition-all group overflow-hidden"
            >
              <Link
                to={`/organizer/event/${event._id}/dashboard`}
                className="p-4 flex flex-col md:flex-row items-center gap-6"
              >
                {/* Thumbnail */}
                <div className="w-full md:w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/5 grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img
                    src={
                      event.image ||
                      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=400"
                    }
                    className="w-full h-full object-cover"
                    alt={event.title}
                  />
                </div>

                {/* Information Cluster */}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2.5">
                    <Badge
                      variant="outline"
                      className="text-[10px] font-bold uppercase tracking-widest border-white/20 text-white bg-white/5 h-6 px-2"
                    >
                      {event.tags?.[0] || "General"}
                    </Badge>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      SID: {event._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors truncate">
                    {event.title}
                  </h3>
                </div>

                {/* Technical Overview Cards */}
                <div className="flex items-center gap-12 text-slate-300 pr-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
                      Scheduled
                    </span>
                    <div className="flex items-center gap-2 text-white">
                      <Calendar size={16} className="text-violet-500" />
                      <span className="text-sm font-bold">
                        {new Date(event.date_time).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
                      Lead
                    </span>
                    <div className="flex items-center gap-2 text-white">
                      <UserIcon size={16} className="text-violet-500" />
                      <span className="text-sm font-bold">
                        {event.organizer_id?.name?.split(" ")[0] || "Staff"}
                      </span>
                    </div>
                  </div>
                  <div className="hidden lg:flex flex-col w-28">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
                        Attendance
                      </span>
                      <span className="text-[11px] font-bold text-white">
                        {Math.round(
                          (event.current_attendees / event.capacity) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-violet-500 transition-all duration-500 shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                        style={{
                          width: `${Math.min(100, (event.current_attendees / event.capacity) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Nav Action */}
                <div className="ml-auto flex-shrink-0 flex items-center justify-center w-9 h-9 border border-white/5 bg-white/5 group-hover:bg-violet-500 group-hover:border-violet-400 rounded-full transition-all shadow-sm">
                  <ChevronRight
                    size={16}
                    className="text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            </Card>
          ))}

          {filteredEvents.length === 0 && (
            <div className="py-24 text-center border border-dashed border-white/10 rounded-2xl bg-zinc-950/50">
              <Info size={32} className="mx-auto text-slate-700 mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                No sessions found in this cluster
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueEvents;
