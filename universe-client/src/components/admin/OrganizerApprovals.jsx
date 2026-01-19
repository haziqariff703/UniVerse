import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  User,
  Mail,
  FileText,
  RefreshCw,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

const OrganizerApprovals = ({ onBack }) => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPendingOrganizers();
  }, []);

  const fetchPendingOrganizers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/admin/organizers/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch pending organizers");

      const data = await response.json();
      setOrganizers(data.users || []);
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
        `http://localhost:5000/api/admin/organizers/${id}/approve`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Failed to approve organizer");

      setOrganizers(organizers.filter((o) => o._id !== id));
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
        `http://localhost:5000/api/admin/organizers/${id}/reject`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Failed to reject organizer");

      setOrganizers(organizers.filter((o) => o._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center">
        <RefreshCw
          size={32}
          className="mx-auto text-violet-400 animate-spin mb-4"
        />
        <p className="text-starlight/60">Loading pending organizers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center">
        <div className="text-rose-400 mb-4">{error}</div>
        <button
          onClick={fetchPendingOrganizers}
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
              Organizer Approvals
            </h2>
            <p className="text-starlight/40 text-sm">
              {organizers.length} request{organizers.length !== 1 ? "s" : ""}{" "}
              pending
            </p>
          </div>
        </div>
        <button
          onClick={fetchPendingOrganizers}
          className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-starlight/60 hover:text-starlight transition-colors"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Organizers List */}
      {organizers.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center">
          <User size={48} className="mx-auto text-starlight/20 mb-4" />
          <h3 className="text-xl font-bold text-starlight mb-2">All Clear!</h3>
          <p className="text-starlight/40">No organizer requests pending.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {organizers.map((org) => (
            <div
              key={org._id}
              className="glass-panel rounded-2xl p-6 border border-starlight/5 hover:border-violet-500/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-xl font-bold text-white shrink-0">
                  {org.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-starlight truncate">
                    {org.name}
                  </h3>
                  <div className="flex items-center gap-2 text-starlight/50 text-sm mt-1">
                    <Mail size={14} />
                    <span className="truncate">{org.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-starlight/50 text-sm mt-1">
                    <User size={14} />
                    <span>{org.student_id}</span>
                  </div>

                  {/* Document Links */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {org.id_card_url && (
                      <a
                        href={org.id_card_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold hover:bg-blue-500/20 transition-colors"
                      >
                        <FileText size={12} />
                        ID Card
                        <ExternalLink size={10} />
                      </a>
                    )}
                    {org.confirmation_letter_url && (
                      <a
                        href={org.confirmation_letter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold hover:bg-blue-500/20 transition-colors"
                      >
                        <FileText size={12} />
                        Confirmation
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-starlight/5">
                <button
                  onClick={() => handleApprove(org._id)}
                  disabled={processingId === org._id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                >
                  <Check size={16} />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(org._id)}
                  disabled={processingId === org._id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 font-bold hover:bg-rose-500/20 transition-colors disabled:opacity-50"
                >
                  <X size={16} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerApprovals;
