import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Briefcase,
  FileText,
  Calendar,
  Mail,
  Shield,
  MoreVertical,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadCSV } from "@/lib/exportUtils";
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
      <Icon size={80} />
    </div>
    <div className="relative z-10 flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-starlight/60 text-xs font-bold uppercase tracking-wider mb-1">
            {title}
          </h3>
          <div className="text-3xl font-bold text-starlight leading-none">
            {value}
          </div>
        </div>
        <div className={`p-2 rounded-xl bg-white/5 ${color} shrink-0`}>
          <Icon size={20} />
        </div>
      </div>
      {(subValue || trend || description) && (
        <div className="space-y-2 mt-2">
          {subValue && (
            <div className="flex items-center gap-1.5 mt-1">
              {trend && <TrendingUp size={10} className="text-emerald-400" />}
              <span className={`text-[10px] font-medium ${color}`}>
                {subValue}
              </span>
            </div>
          )}
          {description && (
            <p className="text-[10px] text-starlight/60 font-medium leading-relaxed italic border-t border-white/5 pt-2">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  </div>
);

const OrganizersList = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // New state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);

  // Helper to ensure correct document/image URL
  const resolveUrl = (url) => {
    if (!url) return "";
    let finalUrl = url.startsWith("http")
      ? url
      : toBackendUrl(`/public${url.startsWith("/") ? "" : "/"}${url}`);

    // Fix common Cloudinary path issues
    if (finalUrl.includes("cloudinary.com")) {
      finalUrl = finalUrl.replace(/([^:])\/\//g, "$1/");
    }
    return finalUrl;
  };

  const fetchOrganizers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage, // Use itemsPerPage here
        role: "organizer", // Filter by role
        ...(search && { search }),
      });

      const response = await fetch(`${API_URL}/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch organizers");

      const data = await response.json();
      setOrganizers(data.users);
      if (data.pagination) setTotalPages(data.pagination.totalPages); // Added check
    } catch (error) {
      console.error("Error fetching organizers:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, search]); // Added itemsPerPage to deps

  useEffect(() => {
    fetchOrganizers();
  }, [fetchOrganizers]);

  const handleExport = () => {
    if (filteredOrganizers.length === 0) {
      toast.error("No organizers available to export");
      return;
    }

    const exportData = filteredOrganizers.map((o) => ({
      Name: o.name,
      Email: o.email,
      Joined: new Date(o.createdAt).toLocaleDateString(),
      "Events Count": o.events_count || 0,
      Status: o.status || "active",
    }));

    downloadCSV(exportData, "UniVerse_Organizers_Registry");
    toast.success("Organizers registry exported successfully");
  };

  const filteredOrganizers = organizers.filter((organizer) =>
    matchesDateRange(organizer, startDate, endDate, [
      "created_at",
      "createdAt",
    ]),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-starlight to-starlight/60">
            Organizer Command Center
          </h1>
          <p className="text-starlight/40 text-sm">
            Manage profiles, monitor activity, and oversee organizer privileges.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrganizers}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm text-starlight/70 hover:text-white transition-colors"
          >
            <RefreshCw size={14} /> <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Organizers"
          value={organizers.length}
          icon={Users}
          color="text-violet-400"
          subValue="Verified partners"
          description="Active organizer accounts currently managed in the registry."
        />
        <KpiCard
          title="Active Proposals"
          value={0} // Placeholder until backend support
          icon={Briefcase}
          color="text-emerald-400"
          subValue="In development"
          description="Draft and pending event proposals under development."
        />
        <KpiCard
          title="Events Managed"
          value={0} // Placeholder
          icon={Calendar}
          color="text-cyan-400"
          subValue="Cumulative success"
          description="Total successful events executed by registered organizers."
        />
        <KpiCard
          title="Verification Status"
          value="100%"
          icon={Shield}
          subValue="Policy compliance"
          description="Compliance rate for identity verification and policy adherence."
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
              placeholder="Search organizers by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-2.5 text-sm text-starlight focus:outline-none focus:border-violet-500/50 transition-all"
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
                <option value={100}>100 Entries</option>
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
              onClick={handleExport}
              disabled={filteredOrganizers.length === 0}
            />
          </div>
        </div>
      </div>

      {/* Table grid container */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="p-12 text-center text-starlight/40">
            Loading organizers...
          </div>
        ) : filteredOrganizers.length === 0 ? (
          <div className="p-12 text-center text-starlight/40">
            No organizers found.
          </div>
        ) : (
          <>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider pl-6">
                      Organizer
                    </th>
                    <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider text-right pr-6">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrganizers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="p-4 pl-6 align-top">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-sm font-bold text-white uppercase">
                            {user.name?.substring(0, 2) || "U"}
                          </div>
                          <div>
                            <p className="text-starlight font-bold text-sm">
                              {user.name}
                            </p>
                            <span className="text-xs text-starlight/40">
                              {user.student_id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-2 text-xs text-starlight/70">
                          <Mail size={12} className="text-violet-400" />{" "}
                          {user.email}
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-2 text-xs text-starlight/70">
                          <Calendar size={12} className="text-cyan-400" />{" "}
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
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
                              className="w-52 glass-panel border-white/10"
                            >
                              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-starlight/40">
                                Management Ops
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-white/5" />
                              <DropdownMenuItem
                                onClick={() => setSelectedOrganizer(user)}
                                className="flex items-center gap-2 p-3 text-starlight hover:bg-white/5 cursor-pointer rounded-lg transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                  <Eye size={16} />
                                </div>
                                <span className="font-bold text-xs uppercase tracking-widest">
                                  Intelligence Peek
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
            <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-starlight/60">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Details Modal */}
      <Dialog
        open={!!selectedOrganizer}
        onOpenChange={(open) => !open && setSelectedOrganizer(null)}
      >
        <DialogContent className="max-w-md bg-[#0e0e12] border-white/10 text-starlight">
          <DialogDescription className="sr-only">
            Organizer profile details and verified credentials.
          </DialogDescription>
          {selectedOrganizer && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-2xl font-bold text-white uppercase">
                  {selectedOrganizer.name?.substring(0, 2)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedOrganizer.name}
                  </h2>
                  <p className="text-starlight/60 text-sm flex items-center gap-1">
                    <Shield size={12} className="text-emerald-400" /> Organizer
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-starlight/60 text-sm">Email</span>
                  <span className="text-starlight text-sm">
                    {selectedOrganizer.email}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-starlight/60 text-sm">Student ID</span>
                  <span className="text-starlight text-sm">
                    {selectedOrganizer.student_id}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-starlight/60 text-sm">Joined</span>
                  <span className="text-starlight text-sm">
                    {new Date(
                      selectedOrganizer.created_at,
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Documents logic - if we want to show approved docs */}
              {(selectedOrganizer.confirmation_letter_url ||
                selectedOrganizer.id_card_url) && (
                <div>
                  <h3 className="text-sm font-bold text-starlight/40 uppercase mb-2">
                    Documents
                  </h3>
                  <div className="flex gap-2">
                    {selectedOrganizer.confirmation_letter_url && (
                      <a
                        href={resolveUrl(
                          selectedOrganizer.confirmation_letter_url,
                        )}
                        target="_blank"
                        className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500 hover:text-white transition-colors"
                      >
                        <FileText size={14} /> Proposal
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizersList;
