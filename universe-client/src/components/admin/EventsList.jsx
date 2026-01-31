import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  CalendarCheck,
  CalendarX,
  Layout,
  FileText,
  Users,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const KpiCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
    <div
      className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}
    >
      <Icon size={80} />
    </div>
    <div className="relative z-10 flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-starlight/60 text-xs font-bold uppercase tracking-wider mb-1">
            {title}
          </h3>
          <div className="text-3xl font-bold text-starlight">{value}</div>
        </div>
        <div className={`p-2 rounded-xl bg-white/5 ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-emerald-400 font-bold">{trend}</span>
          <span className="text-starlight/40">vs last month</span>
        </div>
      )}
    </div>
  </div>
);

/**
 * EventsList "Command Center"
 * A high-density dashboard for administrators to view ALL events.
 */
const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
    registrations: 0,
  });
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(search && { search }),
      });

      const response = await fetch(
        `http://localhost:5000/api/admin/events?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();
      setEvents(data.events);
      setTotalPages(data.pagination.totalPages);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEvents();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle size={12} /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle size={12} /> Rejected
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle size={12} /> Pending
          </span>
        );
      case "completed":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CheckCircle size={12} /> Completed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-white/5 text-starlight/60 border border-white/10">
            {status}
          </span>
        );
    }
  };

  // Client-side filtering for status since API doesn't support it yet
  const filteredEvents =
    statusFilter === "all"
      ? events
      : events.filter((e) => e.status === statusFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-starlight to-starlight/60">
            All Events
          </h1>
          <p className="text-starlight/40 text-sm">
            Comprehensive list of all platform events.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCurrentPage(1);
              fetchEvents();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm text-starlight/70 hover:text-white transition-colors"
          >
            <RefreshCw size={14} /> <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Events"
          value={stats.total}
          icon={Layout}
          color="text-violet-400"
        />
        <KpiCard
          title="Approved"
          value={stats.approved}
          icon={CalendarCheck}
          color="text-emerald-400"
        />
        <KpiCard
          title="Pending"
          value={stats.pending}
          icon={AlertCircle}
          color="text-amber-400"
        />
        <KpiCard
          title="Total Registrations"
          value={stats.registrations}
          icon={Users}
          color="text-cyan-400"
        />
      </div>

      {/* 3. Controls */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-starlight/40"
            size={16}
          />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-starlight focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-starlight/20"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={16} className="text-starlight/40" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm text-starlight focus:outline-none focus:border-violet-500/50 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* 4. Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="p-12 text-center text-starlight/40">
            Loading events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-starlight/40">
            No events found.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider pl-6">
                    Event
                  </th>
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider">
                    Logistics
                  </th>
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider">
                    Organizer
                  </th>
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider text-right">
                    Registrations
                  </th>
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider text-right pr-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEvents.map((event) => (
                  <tr
                    key={event._id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-4 pl-6 align-top">
                      <div className="flex gap-4">
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center border border-white/10">
                          <span className="text-[10px] uppercase text-violet-400 font-bold">
                            {new Date(event.date_time).toLocaleString("en-MY", {
                              month: "short",
                            })}
                          </span>
                          <span className="text-lg font-bold text-starlight leading-none">
                            {new Date(event.date_time).getDate()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-starlight font-bold text-sm mb-1 group-hover:text-violet-300 transition-colors">
                            {event.title}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {event.tags?.slice(0, 2).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-starlight/60 border border-white/5"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-starlight/70">
                          <Calendar size={12} className="text-violet-400" />
                          <span>
                            {new Date(event.date_time).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-starlight/70">
                          <MapPin size={12} className="text-cyan-400" />
                          <span className="truncate max-w-[150px]">
                            {event.venue_id?.name || "No Venue"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                          {event.organizer_id?.name?.substring(0, 2) || "U"}
                        </div>
                        <div>
                          <p className="text-sm text-starlight font-medium">
                            {event.organizer_id?.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      {getStatusBadge(event.status)}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2 text-starlight font-bold">
                        <BarChart3 size={16} className="text-violet-400" />
                        {event.registrationCount || 0}
                      </div>
                    </td>
                    <td className="p-4 align-middle text-right pr-6">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="p-2 rounded-lg bg-white/5 text-starlight hover:bg-violet-500 hover:text-white transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      <Dialog
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      >
        <DialogContent className="max-w-2xl bg-[#0e0e12] border-white/10 text-starlight p-0 overflow-hidden">
          {selectedEvent && (
            <>
              {/* Header Image */}
              <div className="w-full h-48 bg-white/5 relative">
                {selectedEvent.image && (
                  <img
                    src={`http://localhost:5000/${selectedEvent.image}`}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e12] to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                  <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
                  <p className="text-starlight/60">{selectedEvent.category}</p>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-bold text-starlight/40 uppercase tracking-wider mb-2">
                    Description
                  </h3>
                  <p className="text-starlight/80 leading-relaxed text-sm">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="text-violet-400" size={18} />
                      <span className="text-sm font-bold text-starlight/80">
                        Date & Time
                      </span>
                    </div>
                    <p className="text-sm text-starlight ml-8">
                      {new Date(selectedEvent.date_time).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="text-cyan-400" size={18} />
                      <span className="text-sm font-bold text-starlight/80">
                        Venue
                      </span>
                    </div>
                    <p className="text-sm text-starlight ml-8">
                      {selectedEvent.venue_id?.name || "Not Specified"}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="text-emerald-400" size={18} />
                      <span className="text-sm font-bold text-starlight/80">
                        Organizer
                      </span>
                    </div>
                    <p className="text-sm text-starlight ml-8">
                      {selectedEvent.organizer_id?.name}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      <BarChart3 className="text-amber-400" size={18} />
                      <span className="text-sm font-bold text-starlight/80">
                        Registrations
                      </span>
                    </div>
                    <p className="text-sm text-starlight ml-8">
                      {selectedEvent.registrationCount || 0} Pax
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h3 className="text-sm font-bold text-starlight/40 uppercase tracking-wider mb-2">
                    Current Status
                  </h3>
                  {getStatusBadge(selectedEvent.status)}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default EventsList;
