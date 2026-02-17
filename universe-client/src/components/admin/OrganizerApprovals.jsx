import React, { useState, useEffect, useCallback } from "react";
// Optimized for Command Center View
import {
  Check,
  X,
  User,
  Mail,
  FileText,
  RefreshCw,
  Search,
  AlertCircle,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { downloadCSV } from "@/lib/exportUtils";
import { toast } from "sonner";
import { swalConfirm } from "@/lib/swalConfig";
import { API_URL, toBackendUrl } from "@/config/api";
import {
  ADMIN_FILTER_CONTAINER_CLASS,
  AdminDateRangeFilter,
  AdminExportCsvButton,
} from "@/components/admin/shared/AdminListControls";
import { matchesDateRange } from "@/lib/adminDateUtils";

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

const OrganizerApprovals = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Proposal Details Modal State
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const filteredOrganizers = organizers.filter((organizer) =>
    matchesDateRange(organizer, startDate, endDate, [
      "created_at",
      "createdAt",
      "updated_at",
      "updatedAt",
    ]),
  );

  // Helper to clean Cloudinary URLs and ensure safe access
  const resolveUrl = (url, isDocument = false) => {
    if (!url) return "";
    let finalUrl = url.startsWith("http") ? url : toBackendUrl(`/public${url}`);

    // Fix common Cloudinary path issues
    if (finalUrl.includes("cloudinary.com")) {
      finalUrl = finalUrl.replace(/([^:])\/\//g, "$1/");
      // For documents, try to force inline attachment to avoid 401s from browser viewers
      if (isDocument && !finalUrl.includes("fl_attachment")) {
        finalUrl = finalUrl.replace("/upload/", "/upload/fl_attachment/");
      }
    }
    return finalUrl;
  };

  const fetchPendingOrganizers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(search && { search }),
      });

      const response = await fetch(`${API_URL}/admin/organizers/pending?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch pending organizers");

      const data = await response.json();
      setOrganizers(data.users || []);
      if (data.pagination) setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error("Error fetching organizers:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, search]);

  useEffect(() => {
    fetchPendingOrganizers();
  }, [fetchPendingOrganizers]);

  const viewProposal = (proposal) => {
    setSelectedProposal(proposal);
    setProposalModalOpen(true);
  };

  const handleApprove = async (id) => {
    const result = await swalConfirm({
      title: "Approve Organizer?",
      text: "Are you sure you want to approve this organizer request?",
      confirmButtonText: "Yes, Approve",
      confirmButtonColor: "#10b981",
    });

    if (!result.isConfirmed) return;
    setProcessingId(id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/organizers/${id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to approve organizer");

      setOrganizers(organizers.filter((o) => o._id !== id));
      toast.success("Organizer request approved");
    } catch (err) {
      toast.error(err.message || "Failed to approve organizer");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id, reason) => {
    setProcessingId(id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/organizers/${id}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) throw new Error("Failed to reject organizer");

      setOrganizers(organizers.filter((o) => o._id !== id));
      toast.success("Organizer request rejected successfully");
    } catch (err) {
      toast.error(err.message || "Failed to reject organizer");
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectionModal = async (id) => {
    const result = await swalConfirm({
      title: "Reject Organizer Request?",
      text: "Please provide a valid reason for this rejection. The applicant will be notified.",
      input: "textarea",
      inputPlaceholder: "Enter rejection reason here...",
      showCancelButton: true,
      confirmButtonText: "Confirm Rejection",
      confirmButtonColor: "#ef4444",
      inputValidator: (value) => {
        if (!value) {
          return "Rejection requires a documented reason.";
        }
      },
    });

    if (result.isConfirmed) {
      handleReject(id, result.value);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
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
            <RefreshCw
              size={14}
              className={`${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KpiCard
          title="Pending Approvals"
          value={organizers.length}
          icon={AlertCircle}
          color="text-amber-400"
          subValue="Identity audit required"
          description="New organizer applications currently awaiting platform certification and review."
        />
        <KpiCard
          title="Proposals to Review"
          value={
            organizers.filter((o) => o.proposal || o.confirmation_letter_url)
              .length
          }
          icon={FileText}
          subValue="Policy compliance check"
          description="Applications that have submitted official documentation or club proposals for verification."
        />
      </div>

      {/* 3. Filter Matrix */}
      <div className={`${ADMIN_FILTER_CONTAINER_CLASS} space-y-4`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-starlight/60"
              size={16}
            />
            <input
              type="text"
              placeholder="Search pending requests..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-2.5 text-sm text-starlight focus:outline-none focus:border-violet-500/50 transition-all font-bold"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
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
              </select>
            </div>

            <AdminDateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onClear={() => {
                setStartDate("");
                setEndDate("");
              }}
            />

            <AdminExportCsvButton
              onClick={() => {
                const exportData = filteredOrganizers.map((org) => ({
                  Name: org.name,
                  Email: org.email,
                  Bio: org.bio || "",
                  Applied_Date: new Date(org.created_at).toLocaleDateString(),
                }));
                downloadCSV(exportData, "UniVerse_Pending_Organizers");
                toast.success("Pending organizers list exported successfully");
              }}
              disabled={filteredOrganizers.length === 0}
            />
          </div>
        </div>
      </div>

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
          <>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left">
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
                              {org.proposal
                                ? `Proposed "${org.proposal.clubName}"`
                                : "Requesting Organizer Access"}
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
                        {org.proposal ||
                        org.confirmation_letter_url ||
                        org.id_card_url ? (
                          <div className="flex flex-col gap-1">
                            {org.proposal && (
                              <span className="text-[10px] font-black uppercase tracking-widest text-violet-400/60 bg-violet-500/5 px-2 py-0.5 rounded border border-violet-500/10 w-fit">
                                Club Proposal
                              </span>
                            )}
                            {(org.confirmation_letter_url ||
                              org.id_card_url) && (
                              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 w-fit">
                                Files Attached
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] font-black uppercase tracking-widest text-starlight/20 bg-white/5 px-2 py-0.5 rounded border border-white/5 w-fit">
                            No Data
                          </span>
                        )}
                      </td>
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
                                Access Moderation
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-white/5" />

                              <DropdownMenuItem
                                onClick={() =>
                                  org.proposal
                                    ? viewProposal(org.proposal)
                                    : null
                                }
                                disabled={
                                  !org.proposal && !org.confirmation_letter_url
                                }
                                className="flex items-center gap-2 p-3 text-starlight hover:bg-white/5 cursor-pointer rounded-lg transition-colors group disabled:opacity-50"
                              >
                                {org.proposal ? (
                                  <div className="flex items-center gap-2 w-full">
                                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-all">
                                      <FileText size={16} />
                                    </div>
                                    <span className="font-bold text-xs uppercase tracking-widest text-violet-400">
                                      Review Proposal
                                    </span>
                                  </div>
                                ) : org.confirmation_letter_url ? (
                                  <a
                                    href={resolveUrl(org.confirmation_letter_url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 w-full"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-all">
                                      <FileText size={16} />
                                    </div>
                                    <span className="font-bold text-xs uppercase tracking-widest text-violet-400">
                                      View Document
                                    </span>
                                  </a>
                                ) : (
                                  <>
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-starlight/20">
                                      <FileText size={16} />
                                    </div>
                                    <span className="font-bold text-xs uppercase tracking-widest text-starlight/20">
                                      No Proposal
                                    </span>
                                  </>
                                )}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                disabled={!org.id_card_url}
                                className="flex items-center gap-2 p-3 text-starlight hover:bg-white/5 cursor-pointer rounded-lg transition-colors group disabled:opacity-50"
                              >
                                {org.id_card_url ? (
                                  <a
                                    href={resolveUrl(org.id_card_url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 w-full"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                      <User size={16} />
                                    </div>
                                    <span className="font-bold text-xs uppercase tracking-widest text-blue-400">
                                      Verify Identity
                                    </span>
                                  </a>
                                ) : (
                                  <>
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-starlight/20">
                                      <User size={16} />
                                    </div>
                                    <span className="font-bold text-xs uppercase tracking-widest text-starlight/20">
                                      No ID Card
                                    </span>
                                  </>
                                )}
                              </DropdownMenuItem>

                              <DropdownMenuSeparator className="bg-white/5" />

                              <DropdownMenuItem
                                onClick={() => handleApprove(org._id)}
                                disabled={processingId === org._id}
                                className="flex items-center gap-2 p-3 text-emerald-400 hover:bg-emerald-500/10 cursor-pointer rounded-lg transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                  <Check size={16} />
                                </div>
                                <span className="font-bold text-xs uppercase tracking-widest">
                                  Grant Access
                                </span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => openRejectionModal(org._id)}
                                disabled={processingId === org._id}
                                className="flex items-center gap-2 p-3 text-rose-400 hover:bg-rose-600/10 cursor-pointer rounded-lg transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-rose-600/10 flex items-center justify-center text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-all">
                                  <X size={16} />
                                </div>
                                <span className="font-bold text-xs uppercase tracking-widest">
                                  Revoke Candidate
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

      {/* Proposal Details Dialog */}
      <Dialog open={proposalModalOpen} onOpenChange={setProposalModalOpen}>
        <DialogContent className="glass-panel border-white/10 text-starlight max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400">
                <FileText size={20} />
              </div>
              Club Proposal Details
            </DialogTitle>
            <DialogDescription className="sr-only">
              Review candidate's club proposal documentation, mission, and
              visual identity.
            </DialogDescription>
          </DialogHeader>

          {selectedProposal && (
            <div className="py-6 space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-starlight/40 mb-2 block">
                    Club Name
                  </label>
                  <p className="text-lg font-bold text-starlight">
                    {selectedProposal.clubName}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-starlight/40 mb-2 block">
                    Category
                  </label>
                  <p className="text-starlight font-medium capitalize px-3 py-1 bg-white/5 rounded-lg border border-white/10 w-fit">
                    {selectedProposal.category}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-starlight/40 mb-2 block">
                  Mission Statement
                </label>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-starlight/80 text-sm leading-relaxed italic">
                  "{selectedProposal.mission}"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-starlight/40 mb-1 block">
                    Faculty Advisor
                  </label>
                  <p className="text-sm font-bold text-starlight">
                    {selectedProposal.advisorName}
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-starlight/40 mb-1 block">
                    Committee Size
                  </label>
                  <p className="text-sm font-bold text-starlight">
                    {selectedProposal.committeeSize} Members
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-starlight/40 block">
                  Visual Identity
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-starlight/60 block">
                      Club Logo
                    </span>
                    {selectedProposal.logo_url ? (
                      <div className="w-24 h-24 rounded-xl border border-white/10 overflow-hidden bg-black/20 p-2 relative group">
                        <img
                          src={resolveUrl(selectedProposal.logo_url)}
                          alt={`${selectedProposal.clubName} Logo`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-starlight/20">
                        <AlertCircle size={24} />
                        <span className="sr-only">No Logo</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-starlight/60 block">
                      Club Banner
                    </span>
                    {selectedProposal.banner_url ? (
                      <div className="w-full h-24 rounded-xl border border-white/10 overflow-hidden bg-black/20 relative group">
                        <img
                          src={resolveUrl(selectedProposal.banner_url)}
                          alt={`${selectedProposal.clubName} Banner`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <a
                          href={resolveUrl(selectedProposal.banner_url)}
                          target="_blank"
                          rel="noopener"
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    ) : (
                      <div className="w-full h-24 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-starlight/20">
                        <span className="text-xs">No Banner</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-starlight/40 block">
                  Supporting Documents
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {selectedProposal.constitution_url ? (
                    <a
                      href={resolveUrl(selectedProposal.constitution_url)}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 p-3 rounded-xl transition-all group bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/20 border"
                    >
                      <div className="p-2 rounded-lg bg-violet-500 text-white">
                        <FileText size={14} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-bold text-violet-400 uppercase tracking-tight">
                          Open Document
                        </span>
                        <span className="text-xs font-bold text-starlight truncate max-w-[140px]">
                          Constitution.pdf
                        </span>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 opacity-50">
                      <div className="p-2 rounded-lg bg-white/10 text-starlight/40">
                        <AlertCircle size={14} />
                      </div>
                      <span className="text-xs font-bold text-starlight/40 uppercase">
                        No Constitution
                      </span>
                    </div>
                  )}

                  {selectedProposal.consent_letter_url ? (
                    <a
                      href={resolveUrl(selectedProposal.consent_letter_url)}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 p-3 rounded-xl transition-all group bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20 border"
                    >
                      <div className="p-2 rounded-lg bg-cyan-500 text-white">
                        <FileText size={14} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-tight">
                          Open Document
                        </span>
                        <span className="text-xs font-bold text-starlight truncate max-w-[140px]">
                          Consent Letter.pdf
                        </span>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 opacity-50">
                      <div className="p-2 rounded-lg bg-white/10 text-starlight/40">
                        <AlertCircle size={14} />
                      </div>
                      <span className="text-xs font-bold text-starlight/40 uppercase">
                        No Consent Letter
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <button
              onClick={() => setProposalModalOpen(false)}
              className="w-full px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-all shadow-lg shadow-violet-500/20"
            >
              Close Review
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizerApprovals;
