import React, { useState, useEffect, useCallback } from "react";
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
  MoreVertical,
  TrendingUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * KPI Card Component
 */
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

const SpeakerApprovals = () => {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchPendingSpeakers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(search && { search }),
      });

      const response = await fetch(
        `http://localhost:5000/api/admin/speakers/pending?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch pending speakers");

      const data = await response.json();
      setSpeakers(data.speakers || []);
      if (data.pagination) setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, search]);

  useEffect(() => {
    fetchPendingSpeakers();
  }, [fetchPendingSpeakers]);

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

  // Search is now handled by API
  const filteredSpeakers = speakers;

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
          subValue="Manual validation required"
          description="Candidates awaiting formal platform accreditation and talent registry entry."
        />
        <KpiCard
          title="Awaiting Review"
          value={speakers.filter((s) => s.proposal_url).length}
          icon={FileText}
          color="text-cyan-400"
          subValue="Portfolio check"
          description="Talent profiles that have submitted comprehensive documentation for forensic audit."
        />
        <KpiCard
          title="System Breadth"
          value={new Set(speakers.map((s) => s.expertise)).size}
          icon={Award}
          color="text-emerald-400"
          subValue="Targeted specialties"
          description="Total number of unique professional expertise niches discovered in current batch."
        />
      </div>

      {/* 3. Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col md:flex-row gap-4 items-center flex-1 w-full">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-starlight/40"
              size={16}
            />
            <input
              type="text"
              placeholder="Search candidate name or expertise..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-starlight focus:outline-none focus:border-violet-500/50 transition-all font-bold text-xs"
            />
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
          <>
            <div className="w-full overflow-x-auto">
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
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-violet-400/60 bg-violet-500/5 px-2 py-0.5 rounded border border-violet-500/10 w-fit">
                            Documentation Present
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-widest text-starlight/20 bg-white/5 px-2 py-0.5 rounded border border-white/5 w-fit">
                          No Files
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right pr-6">
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
                              Talent Certification
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />

                            {/* Document Action */}
                            <DropdownMenuItem
                              disabled={!speaker.proposal_url}
                              className="flex items-center gap-2 p-3 text-starlight hover:bg-white/5 cursor-pointer rounded-lg transition-colors group disabled:opacity-50"
                            >
                              {speaker.proposal_url ? (
                                <a
                                  href={speaker.proposal_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 w-full"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                    <FileText size={16} />
                                  </div>
                                  <span className="font-bold text-xs uppercase tracking-widest text-blue-400">
                                    Forensic Audit
                                  </span>
                                </a>
                              ) : (
                                <>
                                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-starlight/20">
                                    <FileText size={16} />
                                  </div>
                                  <span className="font-bold text-xs uppercase tracking-widest text-starlight/20">
                                    Missing Docs
                                  </span>
                                </>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-white/5" />

                            {/* Execution Actions */}
                            <DropdownMenuItem
                              onClick={() =>
                                handleAction(speaker._id, "approve")
                              }
                              disabled={processingId === speaker._id}
                              className="flex items-center gap-2 p-3 text-emerald-400 hover:bg-emerald-500/10 cursor-pointer rounded-lg transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                <Check size={16} />
                              </div>
                              <span className="font-bold text-xs uppercase tracking-widest">
                                Authorize Talent
                              </span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                handleAction(speaker._id, "reject")
                              }
                              disabled={processingId === speaker._id}
                              className="flex items-center gap-2 p-3 text-rose-400 hover:bg-rose-600/10 cursor-pointer rounded-lg transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-rose-600/10 flex items-center justify-center text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-all">
                                <X size={16} />
                              </div>
                              <span className="font-bold text-xs uppercase tracking-widest">
                                Dismiss Entry
                              </span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </div>

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

export default SpeakerApprovals;
