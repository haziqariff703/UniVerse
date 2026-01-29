import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  User,
  Mail,
  FileText,
  RefreshCw,
  Search,
  Filter,
  Briefcase,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
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

const OrganizerApprovals = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [search, setSearch] = useState("");

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
    if (!confirm("Are you sure you want to approve this organizer request?"))
      return;
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
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Are you sure you want to REJECT this organizer request?"))
      return;
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
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredOrganizers = organizers.filter(
    (org) =>
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.email.toLowerCase().includes(search.toLowerCase()) ||
      org.student_id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-starlight to-starlight/60">
            Organizer Approvals
          </h1>
          <p className="text-starlight/40 text-sm">
            Review and approve student requests to become event organizers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPendingOrganizers}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm text-starlight/70 hover:text-white transition-colors"
          >
            <RefreshCw size={14} /> <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards - Simplified for Approval Page */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KpiCard
          title="Pending Approvals"
          value={organizers.length}
          icon={AlertCircle}
          color="text-amber-400"
        />
        <KpiCard
          value={organizers.filter((o) => o.confirmation_letter_url).length}
          icon={FileText}
          color="text-cyan-400"
          title="Proposals to Review"
        />
      </div>

      {/* 3. Controls */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-starlight/40"
            size={16}
          />
          <input
            type="text"
            placeholder="Search pending requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-starlight focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-starlight/20"
          />
        </div>
      </div>

      {/* 4. Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="p-12 text-center text-starlight/40">
            Loading requests...
          </div>
        ) : filteredOrganizers.length === 0 ? (
          <div className="p-12 text-center text-starlight/40">
            No pending requests found. Good job!
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider pl-6">
                    Candidate
                  </th>
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider text-right pr-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrganizers.map((org) => (
                  <tr
                    key={org._id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-4 pl-6 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-sm font-bold text-white uppercase">
                          {org.name?.substring(0, 2) || "U"}
                        </div>
                        <div>
                          <p className="text-starlight font-bold text-sm">
                            {org.name}
                          </p>
                          <span className="text-xs text-starlight/40">
                            Requesting Organizer Access
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-starlight/70">
                          <Mail size={12} className="text-violet-400" />{" "}
                          {org.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-starlight/70">
                          <User size={12} className="text-cyan-400" />{" "}
                          {org.student_id}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex flex-col gap-2">
                        {org.confirmation_letter_url ? (
                          <a
                            href={
                              org.confirmation_letter_url.startsWith("http")
                                ? org.confirmation_letter_url
                                : `http://localhost:5000/${org.confirmation_letter_url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-300 text-xs font-bold hover:bg-violet-500 hover:text-white transition-colors w-fit"
                          >
                            <FileText size={14} />
                            View Proposal Letter
                          </a>
                        ) : (
                          <span className="text-starlight/20 text-xs italic">
                            No proposal uploaded
                          </span>
                        )}

                        {org.id_card_url && (
                          <a
                            href={
                              org.id_card_url.startsWith("http")
                                ? org.id_card_url
                                : `http://localhost:5000/${org.id_card_url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-starlight/60 text-xs font-bold hover:bg-white/10 hover:text-starlight transition-colors w-fit"
                          >
                            <User size={14} />
                            View ID Card
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(org._id)}
                          disabled={processingId === org._id}
                          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                          title="Approve Request"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(org._id)}
                          disabled={processingId === org._id}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                          title="Reject Request"
                        >
                          <X size={18} />
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

export default OrganizerApprovals;
