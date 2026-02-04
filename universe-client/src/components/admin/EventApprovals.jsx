import React, { useState, useEffect, useCallback } from "react";
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
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterCategory, setFilterCategory] = useState("all");

  // Rejection Modal State
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingEventId, setRejectingEventId] = useState(null);

  // Details Modal State
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchPendingEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
      });

      const response = await fetch(
        `http://localhost:5000/api/admin/events/pending?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch pending events");

      const data = await response.json();
      setEvents(data.events || []);
      if (data.pagination) setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchPendingEvents();
  }, [fetchPendingEvents]);

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

  const handleReject = async () => {
    if (!rejectingEventId) return;

    setProcessingId(rejectingEventId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/events/${rejectingEventId}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: rejectionReason }),
        },
      );

      if (!response.ok) throw new Error("Failed to reject event");

      setEvents(events.filter((e) => e._id !== rejectingEventId));
      setRejectionModalOpen(false);
      setRejectionReason("");
      setRejectingEventId(null);
      toast.success("Event rejected successfully");
    } catch (err) {
      toast.error(err.message || "Failed to reject event");
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectionModal = (id) => {
    setRejectingEventId(id);
    setRejectionModalOpen(true);
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
          title="Pending Review"
          value={totalPending}
          icon={Clock}
          color="text-amber-400"
          subValue="Manual review required"
          description="Proposals awaiting administrative moderation and platform certification."
        />
        <KpiCard
          title="Capacity Alerts"
          value={highCapacityEvents}
          icon={AlertTriangle}
          color="text-rose-400"
          subValue="Logistics validation"
          description="Events with over 500 requested pax requiring logistics validation."
        />
        <KpiCard
          title="Urgent (7 Days)"
          value={urgentEvents}
          icon={Activity}
          color="text-cyan-400"
          subValue="High priority"
          description="Time-sensitive proposals for events scheduled within the next week."
        />
        <KpiCard
          title="Total Pax"
          value={totalCapacityRequested.toLocaleString()}
          icon={Users}
          color="text-emerald-400"
          subValue="Aggregate capacity"
          description="Combined attendee capacity requested for all pending event proposals."
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
            className="w-full bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-starlight focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-starlight/60"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-starlight/40" />
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm text-starlight focus:outline-none focus:border-violet-500/50 cursor-pointer text-xs font-bold"
            >
              <option value="all">All Categories</option>
              <option value="technology">Technology</option>
              <option value="music">Music</option>
              <option value="art">Art</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border-l border-white/5 pl-4">
            <span className="text-xs font-bold text-starlight/40 uppercase tracking-widest whitespace-nowrap">
              Limit:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm text-starlight focus:outline-none focus:border-violet-500/50 cursor-pointer font-bold text-xs"
            >
              <option value={10}>10 Entries</option>
              <option value={25}>25 Entries</option>
              <option value={50}>50 Entries</option>
              <option value={100}>100 Entries</option>
            </select>
          </div>
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
          <>
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
                              {new Date(event.date_time).toLocaleString(
                                "en-MY",
                                {
                                  month: "short",
                                },
                              )}
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
                                {event.capacity} /{" "}
                                {event.venue_id?.max_capacity}
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
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-2 rounded-xl bg-white/5 text-starlight/40 hover:text-white hover:bg-white/10 transition-all">
                                <MoreVertical size={18} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-56 glass-panel border-white/10"
                            >
                              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-starlight/40">
                                Moderation Ops
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-white/5" />

                              {/* View Details Action */}
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setDetailsModalOpen(true);
                                }}
                                className="flex items-center gap-2 p-3 text-starlight hover:bg-white/5 cursor-pointer rounded-lg transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-all">
                                  <Eye size={16} />
                                </div>
                                <span className="font-bold text-xs uppercase tracking-widest">
                                  View Details
                                </span>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator className="bg-white/5" />

                              {/* Proposal Action */}
                              <DropdownMenuItem
                                disabled={!event.proposal}
                                className="flex items-center gap-2 p-3 text-starlight hover:bg-white/5 cursor-pointer rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {event.proposal ? (
                                  <a
                                    href={`http://localhost:5000/${event.proposal}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 w-full"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                      <FileText size={16} />
                                    </div>
                                    <span className="font-bold text-xs uppercase tracking-widest text-blue-400">
                                      Examine Document
                                    </span>
                                  </a>
                                ) : (
                                  <>
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-starlight/20">
                                      <FileText size={16} />
                                    </div>
                                    <span className="font-bold text-xs uppercase tracking-widest text-starlight/20">
                                      No Document
                                    </span>
                                  </>
                                )}
                              </DropdownMenuItem>

                              <DropdownMenuSeparator className="bg-white/5" />

                              {/* Approval Action */}
                              <DropdownMenuItem
                                onClick={() => handleApprove(event._id)}
                                disabled={processingId === event._id}
                                className="flex items-center gap-2 p-3 text-emerald-400 hover:bg-emerald-500/10 cursor-pointer rounded-lg transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                  <Check size={16} />
                                </div>
                                <span className="font-bold text-xs uppercase tracking-widest">
                                  Authorize Clearance
                                </span>
                              </DropdownMenuItem>

                              {/* Rejection Action */}
                              <DropdownMenuItem
                                onClick={() => openRejectionModal(event._id)}
                                disabled={processingId === event._id}
                                className="flex items-center gap-2 p-3 text-rose-400 hover:bg-rose-500/10 cursor-pointer rounded-lg transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all">
                                  <X size={16} />
                                </div>
                                <span className="font-bold text-xs uppercase tracking-widest">
                                  Deny Proposal
                                </span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Event Details Modal */}
            <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
              <DialogContent className="glass-panel border-white/10 text-starlight max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex flex-col gap-2">
                    <span className="text-sm font-medium text-starlight/60 uppercase tracking-widest">
                      Event Proposal Review
                    </span>
                    {selectedEvent?.title}
                  </DialogTitle>
                </DialogHeader>

                {selectedEvent && (
                  <div className="space-y-6 py-4">
                    {/* Media Cover */}
                    {selectedEvent.image && (
                      <div className="w-full h-48 rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={`http://localhost:5000/${selectedEvent.image}`}
                          alt="Event Cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <span className="text-xs text-starlight/40 uppercase tracking-wider font-bold">
                          Organizer
                        </span>
                        <p className="font-bold text-lg">
                          {selectedEvent.organizer_id?.name}
                        </p>
                        <p className="text-xs text-starlight/60">
                          {selectedEvent.organizer_id?.email}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <span className="text-xs text-starlight/40 uppercase tracking-wider font-bold">
                          Logistics
                        </span>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-violet-400" />
                          <span className="font-medium">
                            {formatDate(selectedEvent.date_time)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-amber-400" />
                          <span className="font-medium">
                            {formatTime(selectedEvent.date_time)} (
                            {selectedEvent.duration_minutes}m)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-starlight/60 uppercase tracking-wider mb-2">
                          Venue & Capacity
                        </h4>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                          <MapPin className="text-cyan-400" size={24} />
                          <div>
                            <p className="font-bold text-white">
                              {selectedEvent.venue_id?.name || "No Venue"}
                            </p>
                            <p className="text-xs text-starlight/60">
                              {selectedEvent.location || "Manual Location"}
                            </p>
                          </div>
                          <div className="ml-auto text-right">
                            <p className="text-2xl font-bold text-starlight">
                              {selectedEvent.capacity}
                            </p>
                            <p className="text-xs text-starlight/40 uppercase tracking-wider">
                              Pax
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-starlight/60 uppercase tracking-wider mb-2">
                          Description
                        </h4>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-starlight/80 leading-relaxed whitespace-pre-wrap">
                          {selectedEvent.description}
                        </div>
                      </div>

                      {/* Documentation Section */}
                      <div>
                        <h4 className="text-sm font-bold text-starlight/60 uppercase tracking-wider mb-2">
                          Required Documentation
                        </h4>
                        {selectedEvent.proposal ? (
                          <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                <FileText size={24} />
                              </div>
                              <div>
                                <p className="font-bold text-blue-400">
                                  Event Proposal.pdf
                                </p>
                                <p className="text-xs text-blue-300/60">
                                  Review this document before approval
                                </p>
                              </div>
                            </div>
                            <a
                              href={`http://localhost:5000/${selectedEvent.proposal}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Eye size={16} />
                              View Document
                            </a>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400">
                            <AlertTriangle size={20} />
                            <span className="font-medium">
                              No documentation uploaded.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter className="gap-2">
                  <button
                    onClick={() => setDetailsModalOpen(false)}
                    className="px-6 py-2 rounded-xl glass-panel text-sm font-bold text-starlight/60 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Close
                  </button>
                  {selectedEvent && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          openRejectionModal(selectedEvent._id);
                          setDetailsModalOpen(false);
                        }}
                        className="px-6 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white text-sm font-bold transition-all"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          handleApprove(selectedEvent._id);
                          setDetailsModalOpen(false);
                        }}
                        className="px-6 py-2 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Rejection Modal */}
            <Dialog
              open={rejectionModalOpen}
              onOpenChange={setRejectionModalOpen}
            >
              <DialogContent className="glass-panel border-white/10 text-starlight max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <AlertTriangle className="text-rose-400" size={20} />
                    Event Rejection Feedback
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <p className="text-sm text-starlight/60 leading-relaxed">
                    Please provide a reason for rejecting this event proposal.
                    This feedback will be sent as a notification to the
                    organizer.
                  </p>
                  <Textarea
                    placeholder="e.g., Missing security plan, venue conflict, etc."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="bg-black/40 border-white/5 min-h-[120px] focus:border-rose-500/50"
                  />
                </div>
                <DialogFooter className="gap-3">
                  <button
                    onClick={() => setRejectionModalOpen(false)}
                    className="px-6 py-2 rounded-xl glass-panel text-sm font-bold text-starlight/60 hover:text-starlight hover:bg-white/5 transition-all"
                  >
                    Wait, Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!rejectionReason.trim() || processingId}
                    className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold transition-all shadow-lg hover:shadow-rose-500/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {processingId ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <X size={14} />
                    )}
                    Confirm Rejection
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-white/5 bg-white/[0.01]">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-starlight/60 hover:text-starlight hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-xs font-medium text-starlight/40 font-jakarta uppercase tracking-widest">
                Page <span className="text-starlight">{currentPage}</span> of{" "}
                {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-starlight/60 hover:text-starlight hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const KpiCard = ({
  title,
  value,
  icon: Icon,
  color,
  subValue,
  trend,
  description,
}) => (
  <div className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-sm">
    <div
      className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}
    >
      {Icon && <Icon size={80} />}
    </div>
    <div className="relative z-10 flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-starlight/60 text-xs font-bold uppercase tracking-wider mb-1">
            {title}
          </h3>
          <div className="text-3xl font-bold text-starlight tracking-tight leading-none">
            {value}
          </div>
        </div>
        <div className={`p-2 rounded-xl bg-white/5 ${color} shrink-0`}>
          {Icon && <Icon size={18} />}
        </div>
      </div>
      {(subValue || trend || description) && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mt-1">
            {trend && <TrendingUp size={10} className="text-emerald-400" />}
            <span className={`text-[10px] font-medium ${color}`}>
              {subValue}
            </span>
          </div>
          {description && (
            <p className="text-[10px] text-starlight/60 mt-2 font-medium leading-relaxed italic border-t border-white/5 pt-2">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  </div>
);

export default EventApprovals;
