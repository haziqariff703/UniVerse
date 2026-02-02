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
import { toast } from "react-hot-toast";

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

  // Rejection Modal State
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingOrgId, setRejectingOrgId] = useState(null);

  const fetchPendingOrganizers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(search && { search }),
      });

      const response = await fetch(
        `http://localhost:5000/api/admin/organizers/pending?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

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
      toast.success("Organizer request approved");
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectingOrgId) return;

    setProcessingId(rejectingOrgId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/organizers/${rejectingOrgId}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: rejectionReason }),
        },
      );

      if (!response.ok) throw new Error("Failed to reject organizer");

      setOrganizers(organizers.filter((o) => o._id !== rejectingOrgId));
      setRejectionModalOpen(false);
      setRejectionReason("");
      setRejectingOrgId(null);
      toast.success("Organizer request rejected");
    } catch (err) {
      alert(err.message);
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectionModal = (id) => {
    setRejectingOrgId(id);
    setRejectionModalOpen(true);
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
            <RefreshCw size={14} /> <span>Refresh</span>
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
          value={organizers.filter((o) => o.confirmation_letter_url).length}
          icon={FileText}
          color="text-cyan-400"
          subValue="Policy compliance check"
          description="Applications that have submitted official documentation for forensic verification."
        />
      </div>

      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-starlight/40"
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
              className="w-full bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-starlight focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-starlight/60 font-bold text-xs"
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

      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="p-12 text-center text-starlight/40">
            Loading requests...
          </div>
        ) : organizers.length === 0 ? (
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
                  {organizers.map((org) => (
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
                        {org.confirmation_letter_url || org.id_card_url ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 w-fit">
                              Files Attached
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-black uppercase tracking-widest text-starlight/20 bg-white/5 px-2 py-0.5 rounded border border-white/5 w-fit">
                            No Files
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
                                disabled={!org.confirmation_letter_url}
                                className="flex items-center gap-2 p-3 text-starlight hover:bg-white/5 cursor-pointer rounded-lg transition-colors group disabled:opacity-50"
                              >
                                {org.confirmation_letter_url ? (
                                  <a
                                    href={
                                      org.confirmation_letter_url.startsWith(
                                        "http",
                                      )
                                        ? org.confirmation_letter_url
                                        : `http://localhost:5000/${org.confirmation_letter_url}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 w-full"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-all">
                                      <FileText size={16} />
                                    </div>
                                    <span className="font-bold text-xs uppercase tracking-widest text-violet-400">
                                      Verify Proposal
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
                                    href={
                                      org.id_card_url.startsWith("http")
                                        ? org.id_card_url
                                        : `http://localhost:5000/${org.id_card_url}`
                                    }
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

      <Dialog open={rejectionModalOpen} onOpenChange={setRejectionModalOpen}>
        <DialogContent className="glass-panel border-white/10 text-starlight max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <AlertCircle className="text-rose-400" size={20} />
              Organizer Rejection Feedback
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-starlight/60 leading-relaxed">
              Please provide a reason for rejecting this candidate. This
              feedback will be sent as a notification to the student.
            </p>
            <Textarea
              placeholder="e.g., Invalid ID card, insufficient proposal details, etc."
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
              Cancel
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
    </div>
  );
};

export default OrganizerApprovals;
