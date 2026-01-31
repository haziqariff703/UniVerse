import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Briefcase,
  Calendar,
  Mail,
  Shield,
  FileText,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const KpiCard = ({ title, value, icon: Icon, color }) => (
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

const OrganizersList = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);

  const fetchOrganizers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        role: "organizer", // Filter by role
        ...(search && { search }),
      });

      const response = await fetch(
        `http://localhost:5000/api/admin/users?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch organizers");

      const data = await response.json();
      setOrganizers(data.users);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching organizers:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    fetchOrganizers();
  }, [fetchOrganizers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    // fetchOrganizers will trigger via effect because search changed (if search state update is immediate, but here it is state)
    // Wait, with current implementation fetch is triggered by currentPage change or when called explicitly.
    // If we want search to trigger it, we need `search` in dependency of effect or call it here.
    // Given the effect depends on `fetchOrganizers` which depends on `search`, changing `search` re-creates `fetchOrganizers` which triggers effect?
    // Yes, if `search` changes -> `fetchOrganizers` changes -> `useEffect` runs.
    // But `setSearch` is async. Better to remove `search` from `fetchOrganizers` deps and pass it as argument?
    // Or just rely on re-render.
    // For now, simpler: we call `fetchOrganizers` (which uses current state search) in effect.
    // When `handleSearch` is called (onSubmit), it doesn't change `search` state (onChange does).
    // `onChange` updates `search`. `onSubmit` sets page to 1.
    // So modifying `search` already triggers re-fetch if we add `fetchOrganizers` to effect deps and `search` to `useCallback` deps.
    // BUT! We usually don't want search-as-you-type to API. We want explicit search on Enter.
    // So let's remove `search` from `useCallback` deps and pass it as arg?
    // Or keep `search` state as "input value" and `query` state as "submitted value".
    // I'll stick to current: `onChange` updates `search`. `useCallback` has `search` dep. So typing triggers fetch. This is "live search".
    // If I want submit-only, I need `query` state.
    // I will stick to live search logic for now as it's simpler and responsive.
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-starlight to-starlight/60">
            All Organizers
          </h1>
          <p className="text-starlight/40 text-sm">
            Manage all verified event organizers on the platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCurrentPage(1);
              // Force fetch if needed, but page change triggers it.
              if (currentPage === 1) fetchOrganizers();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm text-starlight/70 hover:text-white transition-colors"
          >
            <RefreshCw size={14} /> <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Total Organizers"
          value={organizers.length} // Should specificy total from pagination stats ideally, but using length for now or add stats to API
          icon={Briefcase}
          color="text-violet-400"
        />
        {/* Placeholder for other stats like Active Events or Total Events by Organizers */}
      </div>

      {/* Controls */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-starlight/40"
            size={16}
          />
          <input
            type="text"
            placeholder="Search organizers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-starlight focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-starlight/20"
          />
        </form>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="p-12 text-center text-starlight/40">
            Loading organizers...
          </div>
        ) : organizers.length === 0 ? (
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
                  {organizers.map((user) => (
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
                        <button
                          onClick={() => setSelectedOrganizer(user)}
                          className="p-2 rounded-lg bg-white/5 text-starlight hover:bg-violet-500 hover:text-white transition-colors"
                          title="View Profile"
                        >
                          <Eye size={16} />
                        </button>
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
                        href={
                          selectedOrganizer.confirmation_letter_url.startsWith(
                            "http",
                          )
                            ? selectedOrganizer.confirmation_letter_url
                            : `http://localhost:5000/${selectedOrganizer.confirmation_letter_url}`
                        }
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
