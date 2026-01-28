import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  LayoutGrid,
  Calendar as CalendarIcon,
} from "lucide-react";
import EventCardCompact from "@/components/cards/EventCardCompact";
import EventRoadmap from "@/components/organizer/EventRoadmap";
import {
  DashboardStats,
  InsightsPanel,
} from "@/components/organizer/event-dashboard";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'live', 'pending', 'past'
  const [viewMode, setViewMode] = useState("grid"); // 'grid', 'roadmap'

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

  const getFilteredEvents = () => {
    let filtered = events;

    // Search Filter
    if (searchTerm) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Tab Filter
    const now = new Date();
    if (activeTab === "past") {
      filtered = filtered.filter((e) => new Date(e.date_time) < now);
    } else if (activeTab === "live") {
      // Assuming 'live' means currently happening or strictly upcoming for this context?
      // Let's interpret 'live' as upcoming for now, or maybe 'published' if we had that status
      filtered = filtered.filter((e) => new Date(e.date_time) >= now);
    }
    // 'pending' would require a status field like 'draft' or 'approval_pending' which we might not have yet.
    // We'll leave it as just 'all' for the other cases or implement basic time-based logic.

    return filtered;
  };

  const displayedEvents = getFilteredEvents();

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-neuemontreal font-bold text-white mb-1">
            Event Management
          </h1>
          <p className="text-white/40 text-sm">Command Center</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Centered Icon-based Search */}
          <div className="relative group flex-1 md:w-64">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-400 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#050505] border border-white/10 rounded-full pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-gray-600 shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* View Toggle */}
          <div className="flex bg-[#050505] border border-white/10 rounded-full p-1 shadow-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-full transition-all ${
                viewMode === "grid"
                  ? "bg-violet-600 text-white shadow-lg"
                  : "text-gray-500 hover:text-white"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("roadmap")}
              className={`p-2 rounded-full transition-all ${
                viewMode === "roadmap"
                  ? "bg-violet-600 text-white shadow-lg"
                  : "text-gray-500 hover:text-white"
              }`}
              title="Roadmap View"
            >
              <CalendarIcon size={18} />
            </button>
          </div>

          <Link
            to="/organizer/create-event"
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-violet-600/20 whitespace-nowrap"
          >
            <Plus size={18} /> Create Event
          </Link>
        </div>
      </div>

      {/* Stats Ribbon */}
      <DashboardStats events={events} />

      {/* Main Content Grid (70/30) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (70%) - Event List or Roadmap */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Tabs - Only show in Grid Mode */}
          {viewMode === "grid" && (
            <div className="flex gap-2 border-b border-white/10 pb-1 overflow-x-auto no-scrollbar">
              {["all", "live", "pending", "past"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-t-lg text-sm font-bold uppercase tracking-wide transition-all ${
                    activeTab === tab
                      ? "text-violet-400 border-b-2 border-violet-500 bg-violet-500/5"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          {/* Content Area */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/40">Loading your events...</p>
            </div>
          ) : viewMode === "roadmap" ? (
            <EventRoadmap events={events} />
          ) : displayedEvents.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
              <p className="text-white/40">No events found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedEvents.map((event) => (
                <EventCardCompact key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column (30%) - Insights Panel */}
        <div className="lg:col-span-4 space-y-6">
          <InsightsPanel />
        </div>
      </div>
    </div>
  );
};

export default MyEvents;
