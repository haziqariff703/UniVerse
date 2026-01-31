import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Eye,
  User,
  Calendar,
  MapPin,
  Clock,
  RefreshCw,
  ArrowLeft,
  FileText,
  AlertTriangle,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Activity,
  Users,
  Download,
} from "lucide-react";

/**
 * EventApprovals "Command Center"
 * A high-density dashboard for administrators to review, approve, or reject event proposals.
 */
const EventApprovals = ({ onBack }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/admin/events/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch pending events");

      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/events/${id}/approve`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Failed to approve event");

      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/events/${id}/reject`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Failed to reject event");

      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-MY", {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: "Asia/Kuala_Lumpur",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-MY", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kuala_Lumpur",
    });
  };

  // --- KPI Calculations ---
  const totalPending = events.length;
  const highCapacityEvents = events.filter(
    (e) => e.venue_id && e.capacity > e.venue_id.max_capacity,
  ).length;
  const totalCapacityRequested = events.reduce(
    (acc, curr) => acc + (curr.capacity || 0),
    0,
  );
  // Mock 'Urgent' as events happening in the next 7 days
  const urgentEvents = events.filter((e) => {
    const eventDate = new Date(e.date_time);
    const now = new Date();
    const diffTime = eventDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  // --- Filtering ---
  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.organizer_id?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" ||
      (e.tags && e.tags.some((tag) => tag.toLowerCase() === filterCategory));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-starlight/60 hover:text-starlight hover:bg-white/5 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-starlight to-starlight/60">
              Event Command Center
            </h1>
            <p className="text-starlight/40 text-sm">
              Manage and oversee comprehensive event proposals.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPendingEvents}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm text-starlight/70 hover:text-white transition-colors"
          >
            <RefreshCw size={14} /> <span>Refresh</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/10 text-violet-300 text-sm hover:bg-violet-500/20 transition-colors">
            <Download size={14} /> <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Pending Review"
          value={totalPending}
          icon={Clock}
          color="text-amber-400"
          bg="bg-amber-500/10"
          border="border-amber-500/20"
        />
        <KpiCard
          label="Capacity Alerts"
          value={highCapacityEvents}
          icon={AlertTriangle}
          color="text-rose-400"
          bg="bg-rose-500/10"
          border="border-rose-500/20"
        />
        <KpiCard
          label="Urgent (7 Days)"
          value={urgentEvents}
          icon={Activity}
          color="text-cyan-400"
          bg="bg-cyan-500/10"
          border="border-cyan-500/20"
        />
        <KpiCard
          label="Total Pax"
          value={totalCapacityRequested.toLocaleString()}
          icon={Users}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
          border="border-emerald-500/20"
        />
      </div>

      {/* 3. Control Toolbar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-starlight/40"
            size={16}
          />
          <input
            type="text"
            placeholder="Search events, organizers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-starlight focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-starlight/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={16} className="text-starlight/40" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm text-starlight focus:outline-none focus:border-violet-500/50 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="technology">Technology</option>
            <option value="music">Music</option>
            <option value="art">Art</option>
            <option value="sports">Sports</option>
          </select>
        </div>
      </div>

      {/* 4. Main Event List (Data Grid) */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw
              size={32}
              className="mx-auto text-violet-400 animate-spin mb-4"
            />
            <p className="text-starlight/60">Loading pending events...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="text-rose-400 mb-4">{error}</div>
            <button
              onClick={fetchPendingEvents}
              className="px-6 py-2 rounded-xl bg-violet-500 text-white font-bold hover:bg-violet-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Check size={32} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-starlight mb-2">
              All Caught Up!
            </h3>
            <p className="text-starlight/40 max-w-sm mx-auto">
              There are no pending event approvals matching your current
              filters. Great job keeping the queue clean.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider pl-6">
                    Event Details
                  </th>
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider">
                    Logistics
                  </th>
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider">
                    Organizer
                  </th>
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider">
                    Risk / Status
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
                    {/* Event Identity */}
                    <td className="p-4 pl-6 align-top">
                      <div className="flex gap-4">
                        {/* Date Box */}
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center border border-white/10">
                          <span className="text-[10px] uppercase text-rose-400 font-bold">
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

                    {/* Logistics */}
                    <td className="p-4 align-top">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-starlight/70">
                          <Calendar size={12} className="text-violet-400" />
                          <span>
                            {formatDate(event.date_time)} •{" "}
                            {formatTime(event.date_time)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-starlight/70">
                          <MapPin size={12} className="text-cyan-400" />
                          <span
                            className="truncate max-w-[150px]"
                            title={event.venue_id?.name}
                          >
                            {event.venue_id?.name || "No Venue"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-starlight/70">
                          <Clock size={12} className="text-amber-400" />
                          <span>{event.duration_minutes} mins</span>
                        </div>
                      </div>
                    </td>

                    {/* Organizer */}
                    <td className="p-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                          {event.organizer_id?.name?.substring(0, 2) || "U"}
                        </div>
                        <div>
                          <p className="text-sm text-starlight font-medium">
                            {event.organizer_id?.name}
                          </p>
                          <p className="text-xs text-starlight/40">
                            {event.organizer_id?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Risk/Status */}
                    <td className="p-4 align-top">
                      <div className="space-y-2">
                        {/* Capacity Bar */}
                        <div className="w-full max-w-[140px]">
                          <div className="flex justify-between text-[10px] text-starlight/50 mb-1">
                            <span>Capacity</span>
                            <span>
                              {event.capacity} / {event.venue_id?.max_capacity}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                event.venue_id &&
                                event.capacity > event.venue_id.max_capacity
                                  ? "bg-rose-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{
                                width: `${Math.min(
                                  ((event.capacity || 0) /
                                    (event.venue_id?.max_capacity || 100)) *
                                    100,
                                  100,
                                )}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Alerts */}
                        {event.venue_id &&
                          event.capacity > event.venue_id.max_capacity && (
                            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium bg-rose-500/10 px-2 py-1 rounded-md border border-rose-500/20 w-fit">
                              <AlertTriangle size={12} />
                              Over Capacity
                            </div>
                          )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 align-middle text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        {/* Proposal Button */}
                        {event.proposal ? (
                          <a
                            href={`http://localhost:5000/${event.proposal}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
                            title="View Proposal"
                          >
                            <FileText size={16} />
                          </a>
                        ) : (
                          <button
                            disabled
                            className="p-2 rounded-lg bg-white/5 text-starlight/20 cursor-not-allowed"
                          >
                            <FileText size={16} />
                          </button>
                        )}

                        {/* Approve Button */}
                        <button
                          onClick={() => handleApprove(event._id)}
                          disabled={processingId === event._id}
                          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all disabled:opacity-50"
                          title="Approve Event"
                        >
                          <Check size={16} />
                        </button>

                        {/* Reject Button */}
                        <button
                          onClick={() => handleReject(event._id)}
                          disabled={processingId === event._id}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all disabled:opacity-50"
                          title="Reject Event"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const KpiCard = ({ label, value, icon: Icon, color, bg, border }) => (
  <div
    className={`glass-panel p-5 rounded-2xl border ${border} flex items-center justify-between relative overflow-hidden group`}
  >
    <div className={`absolute -right-4 -bottom-4 opacity-10 ${color}`}>
      <Icon size={80} />
    </div>

    <div className="relative z-10">
      <p className="text-starlight/50 text-xs font-medium uppercase tracking-wider mb-1">
        {label}
      </p>
      <h3 className="text-2xl font-bold text-starlight">{value}</h3>
    </div>

    <div
      className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color}`}
    >
      <Icon size={20} />
    </div>
  </div>
);

export default EventApprovals;
