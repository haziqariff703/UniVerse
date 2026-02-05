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
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { downloadCSV } from "@/lib/exportUtils";
import { toast } from "sonner";
import { swalConfirm } from "@/lib/swalConfig";

import { AnimatePresence } from "framer-motion";

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
  const [selectedDoc, setSelectedDoc] = useState(null);

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
    const isApprove = action === "approve";
    const result = await swalConfirm({
      title: isApprove ? "Approve Speaker?" : "Reject Proposal?",
      text: isApprove
        ? "Are you sure you want to APPROVE and promote this speaker to the global registry?"
        : "Are you sure you want to REJECT and delete this speaker proposal?",
      confirmButtonText: isApprove ? "Yes, Approve" : "Yes, Reject",
      confirmButtonColor: isApprove ? "#10b981" : "#ef4444",
    });

    if (!result.isConfirmed) return;

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
      toast.success(`Speaker ${action}d successfully`);
    } catch (err) {
      toast.error(err.message);
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
            <RefreshCw
              size={14}
              className={`${loading ? "animate-spin" : ""}`}
            />
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
              className="w-full bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-starlight focus:outline-none focus:border-violet-500/50 transition-all font-bold text-xs"
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
              className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-starlight focus:outline-none focus:border-violet-500/50 cursor-pointer font-bold text-xs"
            >
              <option value={10}>10 Entries</option>
              <option value={25}>25 Entries</option>
              <option value={50}>50 Entries</option>
              <option value={100}>100 Entries</option>
            </select>
          </div>

          <button
            onClick={() => {
              const exportData = speakers.map((s) => ({
                Name: s.name,
                Email: s.email,
                Expertise: s.expertise,
                Bio: s.bio || "",
                Applied_Date: new Date(s.created_at).toLocaleDateString(),
              }));
              downloadCSV(exportData, "UniVerse_Speaker_Proposals");
              toast.success("Speaker proposals exported successfully");
            }}
            className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-starlight hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest"
          >
            <Download size={16} className="text-violet-400" />
            <span>Export CSV</span>
          </button>
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
            <div className="w-full overflow-x-auto pb-4">
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
                            {/* Social Links */}
                            {/* Social Links */}
                            <div className="flex items-center gap-2 mt-2">
                              {speaker.social_links?.linkedin && (
                                <a
                                  href={
                                    speaker.social_links.linkedin.startsWith(
                                      "http",
                                    )
                                      ? speaker.social_links.linkedin
                                      : `https://${speaker.social_links.linkedin}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-starlight/40 hover:text-blue-400 transition-colors"
                                  title="LinkedIn Profile"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                    <rect width="4" height="12" x="2" y="9" />
                                    <circle cx="4" cy="4" r="2" />
                                  </svg>
                                </a>
                              )}
                              {speaker.social_links?.twitter && (
                                <a
                                  href={
                                    speaker.social_links.twitter.startsWith(
                                      "http",
                                    )
                                      ? speaker.social_links.twitter
                                      : `https://${speaker.social_links.twitter}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-starlight/40 hover:text-sky-400 transition-colors"
                                  title="Twitter Profile"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                  </svg>
                                </a>
                              )}
                              {speaker.social_links?.website && (
                                <a
                                  href={
                                    speaker.social_links.website.startsWith(
                                      "http",
                                    )
                                      ? speaker.social_links.website
                                      : `https://${speaker.social_links.website}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-starlight/40 hover:text-emerald-400 transition-colors"
                                  title="Personal Website"
                                >
                                  <ExternalLink size={12} />
                                </a>
                              )}
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
                                  <div
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSelectedDoc(speaker.proposal_url);
                                    }}
                                    className="flex items-center gap-2 w-full cursor-pointer"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                      <FileText size={16} />
                                    </div>
                                    <span className="font-bold text-xs uppercase tracking-widest text-blue-400">
                                      Forensic Audit
                                    </span>
                                  </div>
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
              </table>
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

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDoc(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl h-[85vh] glass-panel border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-clash">
                      Forensic Audit
                    </h3>
                    <p className="text-xs font-medium text-starlight/40 uppercase tracking-widest">
                      Credential Verification
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={selectedDoc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 text-starlight/60 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <ExternalLink size={20} />
                  </a>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="p-2.5 rounded-xl bg-white/5 text-starlight/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-neutral-900/50 relative overflow-hidden">
                {selectedDoc.endsWith(".pdf") ? (
                  <iframe
                    src={selectedDoc}
                    className="w-full h-full border-none"
                    title="Document Preview"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8 overflow-auto">
                    <img
                      src={selectedDoc}
                      alt="Document Preview"
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpeakerApprovals;
