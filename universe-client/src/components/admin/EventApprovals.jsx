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
} from "lucide-react";

const EventApprovals = ({ onBack }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

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
        }
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
        }
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
        }
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
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center">
        <RefreshCw
          size={32}
          className="mx-auto text-violet-400 animate-spin mb-4"
        />
        <p className="text-starlight/60">Loading pending events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center">
        <div className="text-rose-400 mb-4">{error}</div>
        <button
          onClick={fetchPendingEvents}
          className="px-6 py-3 rounded-xl bg-violet-500 text-white font-bold hover:bg-violet-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-starlight/60 hover:text-starlight transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-starlight">
              Event Approvals
            </h2>
            <p className="text-starlight/40 text-sm">
              {events.length} event{events.length !== 1 ? "s" : ""} pending
              review
            </p>
          </div>
        </div>
        <button
          onClick={fetchPendingEvents}
          className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-starlight/60 hover:text-starlight transition-colors"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center">
          <Calendar size={48} className="mx-auto text-starlight/20 mb-4" />
          <h3 className="text-xl font-bold text-starlight mb-2">All Clear!</h3>
          <p className="text-starlight/40">No events pending approval.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="glass-panel rounded-2xl p-6 border border-starlight/5 hover:border-violet-500/30 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-starlight">
                      {event.title}
                    </h3>
                    <p className="text-starlight/50 text-sm line-clamp-2">
                      {event.description || "No description provided"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-starlight/60">
                      <User size={14} />
                      <span>{event.organizer_id?.name || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-starlight/60">
                      <Calendar size={14} />
                      <span>{formatDate(event.date_time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-starlight/60">
                      <MapPin size={14} />
                      <span>
                        {event.venue_id?.name || "No venue"} (
                        {event.venue_id?.location_code || "N/A"})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-starlight/60">
                      <Clock size={14} />
                      <span>{event.duration_minutes} mins</span>
                    </div>
                  </div>

                  {event.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleApprove(event._id)}
                    disabled={processingId === event._id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                  >
                    <Check size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(event._id)}
                    disabled={processingId === event._id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 font-bold hover:bg-rose-500/20 transition-colors disabled:opacity-50"
                  >
                    <X size={16} />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventApprovals;
