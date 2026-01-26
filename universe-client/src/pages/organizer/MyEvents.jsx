import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Clock,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  BarChart2,
  Users,
} from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/events/my-events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      if (response.ok) {
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-neuemontreal font-bold text-white mb-2">
            My Events
          </h1>
          <p className="text-white/40">Manage and monitor your hosted events</p>
        </div>

        <Link
          to="/organizer/create-event"
          className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-full font-medium transition-all shadow-lg shadow-violet-600/20"
        >
          <Plus size={20} /> Create New Event
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/40">Loading your events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <SpotlightCard className="p-12 text-center rounded-[2rem]">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar size={40} className="text-white/20" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
          <p className="text-white/40 mb-8 max-w-sm mx-auto">
            You haven't created any events yet. Start by launching your first
            event!
          </p>
          <Link
            to="/organizer/create-event"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-colors"
          >
            <Plus size={20} /> Create Event
          </Link>
        </SpotlightCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <SpotlightCard
              key={event._id}
              className="p-6 rounded-[1.5rem] group hover:border-violet-500/30 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-1">
                    {new Date(event.date_time).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <h3 className="text-xl font-bold text-white leading-tight group-hover:text-violet-200 transition-colors">
                    {event.title}
                  </h3>
                </div>
                <div className="relative group/menu">
                  <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white">
                    <MoreVertical size={20} />
                  </button>
                  {/* Dropdown Menu - Simple hover implementation for now */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20">
                    <Link
                      to={`/organizer/event/${event._id}/dashboard`}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors first:rounded-t-xl"
                    >
                      <BarChart2 size={16} /> Dashboard
                    </Link>
                    <Link
                      to={`/organizer/event/${event._id}/edit`}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <Edit size={16} /> Edit Details
                    </Link>
                    <button className="flex items-center gap-2 w-full px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors last:rounded-b-xl text-left">
                      <Trash2 size={16} /> Delete Event
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock size={16} className="text-violet-500/50" />
                  {new Date(event.date_time).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin size={16} className="text-violet-500/50" />
                  {event.venue_id?.name || event.location || "TBD"}
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Users size={16} className="text-violet-500/50" />
                  {event.current_attendees || 0} / {event.capacity} Registered
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {/* Placeholder avatars */}
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#0A0A0A] flex items-center justify-center text-xs text-white/50"
                    >
                      ?
                    </div>
                  ))}
                </div>
                <Link
                  to={`/organizer/event/${event._id}/dashboard`}
                  className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Manage &rarr;
                </Link>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
