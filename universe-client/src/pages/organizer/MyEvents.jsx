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
import ShinyText from "@/components/ui/ShinyText";
import { Tab, TabGroup, TabList } from "@headlessui/react";

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

  // Compute counts for tabs
  const counts = {
    all: events.length,
    live: events.filter(
      (e) =>
        (e.status === "approved" || e.status === "Open") &&
        new Date(e.date_time) >= new Date(),
    ).length,
    pending: events.filter((e) => e.status === "pending").length,
    rejected: events.filter((e) => e.status === "rejected").length,
    past: events.filter(
      (e) => new Date(e.date_time) < new Date() || e.status === "Completed",
    ).length,
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
      filtered = filtered.filter(
        (e) => new Date(e.date_time) < now || e.status === "Completed",
      );
    } else if (activeTab === "live") {
      // Live means upcoming approved events or currently active ones
      filtered = filtered.filter(
        (e) =>
          (e.status === "approved" || e.status === "Open") &&
          new Date(e.date_time) >= now,
      );
    } else if (activeTab === "pending") {
      filtered = filtered.filter((e) => e.status === "pending");
    } else if (activeTab === "rejected") {
      filtered = filtered.filter((e) => e.status === "rejected");
    }

    return filtered;
  };

  const displayedEvents = getFilteredEvents();

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-clash font-bold text-white mb-1">
            Event Management
          </h1>
          <p className="text-sm font-medium text-white/40">Command Center</p>
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
            <div className="flex justify-start pb-1">
              <TabGroup
                selectedIndex={[
                  "all",
                  "live",
                  "pending",
                  "rejected",
                  "past",
                ].indexOf(activeTab)}
                onChange={(index) =>
                  setActiveTab(
                    ["all", "live", "pending", "rejected", "past"][index],
                  )
                }
              >
                <TabList className="flex bg-[#050505] border border-white/10 rounded-full p-1 gap-1 shadow-lg overflow-x-auto max-w-full">
                  {["all", "live", "pending", "rejected", "past"].map((tab) => (
                    <Tab
                      key={tab}
                      className="rounded-full px-5 py-2 text-sm font-neuemontreal font-bold uppercase tracking-wide text-gray-400 focus:outline-none data-[selected]:bg-white/10 data-[selected]:text-white data-[hover]:bg-white/5 transition-all duration-200 border border-transparent whitespace-nowrap flex items-center gap-2"
                    >
                      {({ selected }) => (
                        <>
                          {tab === "live" && selected && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                          )}
                          {/* Dot for Rejected */}
                          {tab === "rejected" &&
                            counts.rejected > 0 &&
                            !selected && (
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                            )}
                          {tab === "pending" &&
                            counts.pending > 0 &&
                            !selected && (
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                            )}
                          <span>{tab}</span>
                          <span
                            className={`text-[10px] uppercase font-clash py-0.5 px-1.5 rounded-full ${selected ? "bg-white text-black font-bold" : "bg-white/10 text-gray-400 font-medium"}`}
                          >
                            {counts[tab]}
                          </span>
                        </>
                      )}
                    </Tab>
                  ))}
                </TabList>
              </TabGroup>
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
          <InsightsPanel
            user={JSON.parse(localStorage.getItem("user") || "{}")}
          />
        </div>
      </div>
    </div>
  );
};

export default MyEvents;
