import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  Download,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Mail,
  User,
  Clock,
  TrendingUp,
  MessageSquare,
  Star,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const EventGuestList = () => {
  const { id } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [trendView, setTrendView] = useState("Daily");
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState(null);
  const pageSize = 10;

  const fetchGuestList = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/registrations/event/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      if (response.ok) {
        setRegistrations(Array.isArray(data) ? data : []);
      }

      // Fetch Reviews (Only fetch once or less frequently? For now keep it synced)
      const reviewsRes = await fetch(
        `http://localhost:5000/api/events/organizer/reviews?event_id=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error("Error fetching guest list data:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGuestList();

    // Poll every 5 seconds for real-time updates (Command Center Mode)
    const interval = setInterval(fetchGuestList, 5000);
    return () => clearInterval(interval);
  }, [fetchGuestList]);

  // Calculated Stats
  const totalGuests = registrations.length;
  const checkedIn = registrations.filter(
    (r) => r.status === "CheckedIn",
  ).length;
  const pending = registrations.filter((r) => r.status === "Pending").length;
  const cancelled = registrations.filter(
    (r) => r.status === "Cancelled",
  ).length;

  // Process Trend Data
  const trendData = React.useMemo(() => {
    if (!registrations.length) return [];

    if (trendView === "Daily") {
      // Group by hours of the current day (or day of booking)
      const hours = {};
      registrations.forEach((reg) => {
        const hour = new Date(reg.booking_time).getHours();
        const label =
          hour >= 12
            ? `${hour === 12 ? 12 : hour - 12}PM`
            : `${hour === 0 ? 12 : hour}AM`;
        hours[label] = (hours[label] || 0) + 1;
      });

      // Sort labels 12AM -> 11PM
      const sortedLabels = [
        "12AM",
        "1AM",
        "2AM",
        "3AM",
        "4AM",
        "5AM",
        "6AM",
        "7AM",
        "8AM",
        "9AM",
        "10AM",
        "11AM",
        "12PM",
        "1PM",
        "2PM",
        "3PM",
        "4PM",
        "5PM",
        "6PM",
        "7PM",
        "8PM",
        "9PM",
        "10PM",
        "11PM",
      ];

      return sortedLabels
        .map((label) => ({
          time: label,
          guests: hours[label] || 0,
        }))
        .filter((d) => {
          // Only show range with data or reasonable business hours for cleaner look
          const hourIndex = sortedLabels.indexOf(d.time);
          return d.guests > 0 || (hourIndex >= 8 && hourIndex <= 20);
        });
    } else {
      // Group by Day
      const days = {};
      registrations.forEach((reg) => {
        const day = new Date(reg.booking_time).toLocaleDateString("en-US", {
          weekday: "short",
        });
        days[day] = (days[day] || 0) + 1;
      });
      const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return dayOrder.map((day) => ({
        time: day,
        guests: days[day] || 0,
      }));
    }
  }, [registrations, trendView]);

  const exportToCSV = () => {
    const headers = [
      "Guest Name",
      "Status",
      "Contact",
      "Student ID",
      "Booking Date",
    ];
    const rows = filteredRegistrations.map((reg) => [
      reg.user_snapshot?.name || "Unknown",
      reg.status,
      reg.user_snapshot?.email || "No email",
      reg.user_snapshot?.student_id || "N/A",
      new Date(reg.booking_time).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `guest_list_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateStatus = async (registrationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/registrations/${registrationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        // Update local state
        setRegistrations((prev) =>
          prev.map((reg) =>
            reg._id === registrationId
              ? { ...reg, status: data.registration.status }
              : reg,
          ),
        );
        setActiveMenu(null);
      } else {
        const error = await res.json();
        alert(error.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Update Status Error:", err);
      alert("Error updating status");
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.user_snapshot?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reg.user_snapshot?.student_id?.includes(searchTerm);

    const matchesStatus = statusFilter === "All" || reg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const totalPages = Math.ceil(filteredRegistrations.length / pageSize);

  return (
    <div className="min-h-screen pt-6 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
      {/* Top Nav / Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-gray-700">/</span>
        <span className="text-gray-200 text-sm font-medium">
          Guest Overview
        </span>
      </div>

      {/* Dashboard Overview Section (Professional & Compact) */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Overview</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:bg-white/5 rounded-lg text-sm font-medium text-white transition-colors"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400">
                <User size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{totalGuests}</p>
            <p className="text-xs text-gray-500">Total Guests</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{checkedIn}</p>
            <p className="text-xs text-gray-500">Checked In</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                <Clock size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{pending}</p>
            <p className="text-xs text-gray-500">Pending Arrival</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                <XCircle size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{cancelled}</p>
            <p className="text-xs text-gray-500">Cancelled</p>
          </div>
        </div>

        {/* Charts & Feedback Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Participants Trend Chart */}
          <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 p-5 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Registration Trend
                </h3>
                <p className="text-xs text-gray-500">Live updates from today</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setTrendView("Daily")}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${trendView === "Daily" ? "bg-white/10 text-white" : "hover:bg-white/5 text-gray-500"}`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setTrendView("Weekly")}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${trendView === "Weekly" ? "bg-white/10 text-white" : "hover:bg-white/5 text-gray-500"}`}
                >
                  Weekly
                </button>
              </div>
            </div>
            <div className="h-[250px] w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient
                      id="colorGuests"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#171717",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#fff", fontSize: "12px" }}
                    labelStyle={{ display: "none" }}
                    wrapperStyle={{ outline: "none" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="guests"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorGuests)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feedback Card */}
          <div className="bg-[#0A0A0A] border border-white/10 p-5 rounded-2xl flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare size={16} className="text-emerald-400" /> Recent
                Feedback
              </h3>
              <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-1 rounded">
                Last 5
              </span>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
              {reviews.length > 0 ? (
                reviews.slice(0, 5).map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white/[0.02] border border-white/5 p-3 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-white">
                        {rev.user_name}
                      </span>
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={10} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      "{rev.comment}"
                    </p>
                    <span className="text-[9px] text-gray-600 block mt-1 uppercase tracking-tighter">
                      {new Date(rev.date).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-10">
                  <MessageSquare size={32} />
                  <p className="text-xs mt-2">No feedback yet</p>
                </div>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-center">
              <span className="text-[10px] text-xs font-bold text-gray-600 uppercase">
                Feedback Module Disabled
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-t-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {["All", "Confirmed", "CheckedIn", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? "bg-white text-black"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {status === "CheckedIn" ? "Checked In" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0A0A0A] border-x border-b border-white/10 rounded-b-2xl min-h-[500px]">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading guests...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Search size={40} className="mb-4 opacity-20" />
            <p>No guests found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="p-5 font-medium">Guest</th>
                  <th className="p-5 font-medium">Status</th>
                  <th className="p-5 font-medium">Contact</th>
                  <th className="p-5 font-medium">Ticket / ID</th>
                  <th className="p-5 font-medium text-right">Registered</th>
                  <th className="p-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedRegistrations.map((reg) => (
                  <tr
                    key={reg._id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                          {reg.user_snapshot?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">
                            {reg.user_snapshot?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-violet-400 md:hidden">
                            {reg.user_snapshot?.student_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          reg.status === "CheckedIn"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : reg.status === "Cancelled"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : "bg-violet-500/10 text-violet-400 border-violet-500/20"
                        }`}
                      >
                        {reg.status === "CheckedIn" && (
                          <CheckCircle2 size={12} />
                        )}
                        {reg.status === "Cancelled" && <XCircle size={12} />}
                        {reg.status}
                      </span>
                    </td>
                    <td className="p-5">
                      {/* Placeholder for email if not in snapshot */}
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail size={14} />
                        <span className="truncate max-w-[150px]">
                          {reg.user_snapshot?.email || "No email"}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 font-mono text-sm text-gray-400">
                      {reg.user_snapshot?.student_id}
                    </td>
                    <td className="p-5 text-right text-sm text-gray-400">
                      {new Date(reg.booking_time).toLocaleDateString()}
                      <span className="block text-xs text-gray-600">
                        {new Date(reg.booking_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="p-5 text-right relative">
                      <button
                        onClick={() =>
                          setActiveMenu(activeMenu === reg._id ? null : reg._id)
                        }
                        className={`p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all ${activeMenu === reg._id ? "opacity-100 bg-white/10 text-white" : "opacity-0 group-hover:opacity-100"}`}
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {activeMenu === reg._id && (
                        <>
                          {/* Overlay to close menu */}
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveMenu(null)}
                          />
                          <div className="absolute right-10 top-0 w-48 bg-[#121212] border border-white/10 rounded-xl shadow-2xl z-50 py-1 animate-in fade-in zoom-in duration-200">
                            {reg.status !== "CheckedIn" &&
                              reg.status !== "Cancelled" && (
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(reg._id, "CheckedIn")
                                  }
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 transition-colors text-left"
                                >
                                  <CheckCircle2 size={14} /> Approve Check-In
                                </button>
                              )}

                            {reg.status === "CheckedIn" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(reg._id, "Confirmed")
                                }
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-violet-400 hover:bg-violet-500/10 transition-colors text-left"
                              >
                                <ArrowLeft size={14} /> Undo Check-In
                              </button>
                            )}

                            {reg.status !== "Cancelled" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(reg._id, "Cancelled")
                                }
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                              >
                                <XCircle size={14} /> Cancel Registration
                              </button>
                            )}

                            {reg.status === "Cancelled" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(reg._id, "Confirmed")
                                }
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-violet-400 hover:bg-violet-500/10 transition-colors text-left"
                              >
                                <CheckCircle2 size={14} /> Restore Registration
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Footer (Mock) */}
      <div className="flex justify-between items-center mt-4 text-xs text-gray-500 font-medium">
        <p>
          Showing {paginatedRegistrations.length} of{" "}
          {filteredRegistrations.length} registrations
        </p>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded border border-white/10 hover:bg-white/5 disabled:opacity-20 transition-all font-bold"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || totalPages === 0}
          >
            Previous
          </button>
          <div className="flex items-center px-4 font-mono text-white/40">
            {currentPage} / {totalPages || 1}
          </div>
          <button
            className="px-3 py-1 rounded border border-white/10 hover:bg-white/5 disabled:opacity-20 transition-all font-bold"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventGuestList;
