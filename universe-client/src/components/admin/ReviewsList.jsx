import React, { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  Star,
  Trash2,
  AlertCircle,
  Calendar,
  User,
  RefreshCw,
  Search,
  Filter,
  TrendingDown,
  TrendingUp,
  MoreVertical,
  Eye,
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { downloadCSV } from "@/lib/exportUtils";
import { swalConfirm } from "@/lib/swalConfig";
import {
  ADMIN_FILTER_CONTAINER_CLASS,
  AdminDateRangeFilter,
  AdminExportCsvButton,
} from "@/components/admin/shared/AdminListControls";
import { matchesDateRange } from "@/lib/adminDateUtils";

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

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, average: 0, critical: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReviews = useCallback(async () => {
    try {
      // I'll add the button context in the next view
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
      });

      const response = await fetch(
        `http://localhost:5000/api/admin/reviews?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setReviews(data.reviews || []);
      setStats(data.stats || { total: 0, average: 0, critical: 0 });
      if (data.pagination) setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  const handleExport = () => {
    if (filteredReviews.length === 0) {
      toast.error("No reviews available to export");
      return;
    }

    const exportData = filteredReviews.map((r) => ({
      Event: r.event_id?.title || "N/A",
      Reviewer: r.user_id?.name || "N/A",
      Rating: r.rating,
      Comment: r.comment,
      Date: new Date(r.createdAt).toLocaleDateString(),
    }));

    downloadCSV(exportData, "UniVerse_Reviews_Registry");
    toast.success("Reviews exported successfully");
  };

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (id) => {
    const result = await swalConfirm({
      title: "Delete Review?",
      text: "Are you sure you want to permanently strip this review from the system?",
      confirmButtonText: "Yes, Delete",
      confirmButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/reviews/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        fetchReviews();
        setSelectedReview(null);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={12}
        className={`${i < rating ? "fill-amber-400 text-amber-400" : "text-starlight/10"}`}
      />
    ));
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.comment?.toLowerCase().includes(search.toLowerCase()) ||
      r.user_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.event_id?.title?.toLowerCase().includes(search.toLowerCase());

    const matchesRating =
      ratingFilter === "all" || r.rating === parseInt(ratingFilter);

    const matchesDate = matchesDateRange(r, startDate, endDate, [
      "created_at",
      "createdAt",
    ]);

    return matchesSearch && matchesRating && matchesDate;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* 1. Forensics Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-starlight to-starlight/60">
            Review Moderation
          </h1>
          <p className="text-starlight/40 text-sm font-medium">
            Monitoring collective user sentiment and event feedback integrity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchReviews}
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

      {/* 2. Intelligence Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Feedback Pulse"
          value={stats.total}
          icon={MessageSquare}
          color="text-violet-400"
          subValue="Student feedback captured"
          description="A cumulative tally of user reviews across all events and platform sectors."
        />
        <KpiCard
          title="Global Sentiment"
          value={`${stats.average}/5.0`}
          icon={Star}
          color="text-amber-400"
          subValue="Aggregate sentiment index"
          description="Average rating across all attendee feedback, representing the platform's satisfaction index."
        />
        <KpiCard
          title="Critical Alerts"
          value={stats.critical}
          icon={AlertCircle}
          color="text-rose-400"
          subValue="Manual audit required"
          description="Low-rated reviews (1-2 stars) that require immediate administrative attention for resolution."
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
              placeholder="Search feedback, reviewers, or specific events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-2.5 text-sm text-starlight focus:outline-none focus:border-violet-500/50 transition-all font-bold"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-starlight/60 focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars Only</option>
              <option value="4">4 Stars & Above</option>
              <option value="3">3 Stars & Below</option>
              <option value="2">Critical (1-2)</option>
            </select>

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
              disabled={filteredReviews.length === 0}
            />
          </div>
        </div>
      </div>

      {/* 4. Forensic Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-20 text-center glass-panel rounded-3xl border border-white/5">
            <RefreshCw
              size={40}
              className="mx-auto text-violet-500/20 animate-spin mb-4"
            />
            <p className="text-starlight/40 font-bold uppercase tracking-widest text-xs">
              Synchronizing Review Database...
            </p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-20 text-center glass-panel rounded-3xl border border-white/5">
            <AlertCircle size={40} className="mx-auto text-starlight/10 mb-4" />
            <p className="text-starlight/40 font-bold uppercase tracking-widest text-xs">
              No results match your current forensic filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredReviews.map((review) => (
              <div
                key={review._id}
                className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row gap-8 hover:border-violet-500/20 transition-all group"
              >
                {/* Score & Profile */}
                <div className="md:w-48 flex-shrink-0 space-y-4">
                  <div className="flex gap-1">{renderStars(review.rating)}</div>
                  <div className="space-y-1">
                    <p className="text-starlight font-black text-sm tracking-tight truncate">
                      {review.user_id?.name || "Anonymous User"}
                    </p>
                    <p className="text-starlight/30 text-[10px] font-bold uppercase tracking-widest">
                      {review.user_id?.student_id || "GUEST_IDENTITY"}
                    </p>
                  </div>
                </div>

                {/* Comment Section */}
                <div className="flex-1">
                  <div className="mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      {review.event_id?.title || "ARCHIVED_EVENT"}
                    </span>
                  </div>
                  <p className="text-starlight/80 text-sm leading-relaxed font-medium">
                    "
                    {review.comment ||
                      "Identity confirmed. No written testimony provided."}
                    "
                  </p>
                  <div className="flex items-center gap-3 mt-4 text-[10px] text-starlight/60 font-bold uppercase tracking-widest">
                    <Calendar size={12} />
                    {new Date(review.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>

                {/* Final Actions */}
                <div className="flex items-center justify-center border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-8">
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
                        Moderation Ops
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/5" />
                      <DropdownMenuItem
                        onClick={() => setSelectedReview(review)}
                        className="flex items-center gap-2 p-3 text-starlight hover:bg-white/5 cursor-pointer rounded-lg transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                          <Eye size={16} />
                        </div>
                        <span className="font-bold text-xs">Examine Case</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(review._id)}
                        className="flex items-center gap-2 p-3 text-rose-400 hover:bg-rose-600/10 cursor-pointer rounded-lg transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-rose-600/10 flex items-center justify-center text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-all">
                          <Trash2 size={16} />
                        </div>
                        <span className="font-bold text-xs">Strip Entry</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border border-white/5 rounded-3xl bg-white/[0.01]">
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
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-starlight/60 hover:text-starlight hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Examining Modal */}
      <Dialog
        open={!!selectedReview}
        onOpenChange={() => setSelectedReview(null)}
      >
        <DialogContent className="bg-[#0b0b0f] border-white/10 text-starlight max-w-xl rounded-3xl p-0 overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 relative flex items-center px-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tight text-white uppercase">
                Forensic Analysis
              </h2>
              <p className="text-starlight/40 text-xs font-bold uppercase tracking-widest">
                Review ID: {selectedReview?._id}
              </p>
            </div>
            <div className="absolute top-1/2 -right-8 -translate-y-1/2 opacity-5">
              <MessageSquare size={160} />
            </div>
          </div>

          {selectedReview && (
            <div className="p-8 space-y-8">
              <div className="space-y-2">
                <div className="flex gap-1.5">
                  {renderStars(selectedReview.rating)}
                </div>
                <p className="text-xl font-medium leading-normal text-starlight/90 italic">
                  "{selectedReview.comment}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-starlight/60 uppercase tracking-widest">
                    Reviewer Profile
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-violet-500/10 flex items-center justify-center text-sm font-black text-violet-400 border border-violet-500/20">
                      {selectedReview.user_id?.name?.[0] || "U"}
                    </div>
                    <div>
                      <p className="font-black text-sm">
                        {selectedReview.user_id?.name}
                      </p>
                      <p className="text-starlight/30 text-[10px] font-bold">
                        {selectedReview.user_id?.student_id}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-starlight/60 uppercase tracking-widest">
                    Target Lifecycle
                  </label>
                  <div>
                    <p className="font-black text-sm">
                      {selectedReview.event_id?.title}
                    </p>
                    <p className="text-starlight/30 text-[10px] font-bold uppercase tracking-widest">
                      Event Record
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-white/5">
                <button
                  onClick={() => setSelectedReview(null)}
                  className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-starlight/40 hover:text-white transition-all"
                >
                  Close Analysis
                </button>
                <button
                  onClick={() => handleDelete(selectedReview._id)}
                  className="px-8 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-900/20 transition-all"
                >
                  Strip Testimony
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsList;
