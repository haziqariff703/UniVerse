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
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mic,
  Award,
} from "lucide-react";

/**
 * KPI Card Component
 */
const KpiCard = ({ title, value, icon: Icon, color }) => {
  if (!Icon) return null;
  return (
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
      </div>
    </div>
  );
};

const SpeakerApprovals = () => {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPendingSpeakers();
  }, []);

  const fetchPendingSpeakers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/admin/speakers/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch pending speakers");

      const data = await response.json();
      setSpeakers(data.speakers || []);
    } catch (err) {
      // Error is displayed via the state if needed, here we just log it
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    const message =
      action === "approve"
        ? "Are you sure you want to APPROVE and promote this speaker to the global registry?"
        : "Are you sure you want to REJECT and delete this speaker proposal?";

    if (!confirm(message)) return;

    setProcessingId(id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/speakers/${id}/verify`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action }),
        },
      );

      if (!response.ok) throw new Error(`Failed to ${action} speaker`);

      setSpeakers(speakers.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredSpeakers = speakers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.expertise?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-starlight to-starlight/60">
            Speaker Verification Center
          </h1>
          <p className="text-starlight/40 text-sm">
            Review and certify organizer-proposed talent for the global
            registry.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPendingSpeakers}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm text-starlight/70 hover:text-white transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />{" "}
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          title="Pending Certifications"
          value={speakers.length}
          icon={Mic}
          color="text-violet-400"
        />
        <KpiCard
          title="Awaiting Review"
          value={speakers.filter((s) => s.proposal_url).length}
          icon={FileText}
          color="text-cyan-400"
        />
        <KpiCard
          title="System Breadth"
          value={new Set(speakers.map((s) => s.expertise)).size}
          icon={Award}
          color="text-emerald-400"
        />
      </div>

      {/* 3. Search Bar */}
      <div className="glass-panel p-4 rounded-2xl">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-starlight/40"
            size={16}
          />
          <input
            type="text"
            placeholder="Search candidate name or expertise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-starlight focus:outline-none focus:border-violet-500/50 transition-all"
          />
        </div>
      </div>

      {/* 4. Registry Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="p-20 text-center">
            <RefreshCw
              size={40}
              className="mx-auto text-violet-500/20 animate-spin mb-4"
            />
            <p className="text-starlight/40 animate-pulse font-medium">
              Scanning Proposal Queue...
            </p>
          </div>
        ) : filteredSpeakers.length === 0 ? (
          <div className="p-20 text-center">
            <Mic size={40} className="mx-auto text-starlight/10 mb-4" />
            <p className="text-starlight/40 font-medium">
              No pending speaker proposals found.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-4 pl-6 text-xs font-bold text-starlight/30 uppercase tracking-widest">
                    Candidate Identity
                  </th>
                  <th className="p-4 text-xs font-bold text-starlight/30 uppercase tracking-widest">
                    Proposed Expertise
                  </th>
                  <th className="p-4 text-xs font-bold text-starlight/30 uppercase tracking-widest">
                    Credentials
                  </th>
                  <th className="p-4 text-xs font-bold text-starlight/30 uppercase tracking-widest text-right pr-6">
                    Management
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSpeakers.map((speaker) => (
                  <tr
                    key={speaker._id}
                    className="hover:bg-white/[0.01] transition-colors group"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 flex items-center justify-center font-black text-starlight uppercase">
                          {speaker.name?.substring(0, 2) || "S"}
                        </div>
                        <div>
                          <p className="text-starlight font-black tracking-tight">
                            {speaker.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-starlight/40 text-[10px] mt-0.5">
                            <Clock size={10} />
                            <span>
                              Proposed by{" "}
                              {speaker.requested_by?.name || "Organizer"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest border border-cyan-500/20">
                        {speaker.expertise || "General Expert"}
                      </span>
                    </td>
                    <td className="p-4">
                      {speaker.proposal_url ? (
                        <a
                          href={speaker.proposal_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/10 text-violet-400 text-xs font-black uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all border border-violet-500/20"
                        >
                          <FileText size={14} />
                          Review Proposal
                        </a>
                      ) : (
                        <span className="text-starlight/20 text-xs italic">
                          No file provided
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleAction(speaker._id, "approve")}
                          disabled={processingId === speaker._id}
                          className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleAction(speaker._id, "reject")}
                          disabled={processingId === speaker._id}
                          className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
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

export default SpeakerApprovals;
