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

  useEffect(() => {
    const fetchGuestList = async () => {
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
      } catch (error) {
        console.error("Error fetching guest list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuestList();
  }, [id]);

  // Calculated Stats
  const totalGuests = registrations.length;
  const checkedIn = registrations.filter(
    (r) => r.status === "CheckedIn",
  ).length;
  const pending = registrations.filter((r) => r.status === "Pending").length;
  const cancelled = registrations.filter(
    (r) => r.status === "Cancelled",
  ).length;

  // Mock Data for Charts & Feedback
  const trendData = [
    { time: "10AM", guests: 12 },
    { time: "11AM", guests: 35 },
    { time: "12PM", guests: 58 },
    { time: "1PM", guests: 89 },
    { time: "2PM", guests: 120 },
    { time: "3PM", guests: totalGuests > 140 ? totalGuests : 140 },
  ];

  const recentFeedback = [
    { id: 1, user: "Alice M.", rating: 5, comment: "Smooth check-in process!" },
    { id: 2, user: "John D.", rating: 4, comment: "Great event layout." },
    { id: 3, user: "Sarah L.", rating: 5, comment: "Loved the keynote!" },
    { id: 4, user: "Mike T.", rating: 3, comment: "Wifi was a bit slow." },
    {
      id: 5,
      user: "Emily R.",
      rating: 5,
      comment: "Can't wait for next year!",
    },
  ];

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.user_snapshot?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reg.user_snapshot?.student_id?.includes(searchTerm);

    const matchesStatus = statusFilter === "All" || reg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen pt-6 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
      {/* Top Nav / Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          to={`/organizer/event/${id}/dashboard`}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
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
            <button className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:bg-white/5 rounded-lg text-sm font-medium text-white transition-colors">
              <Download size={16} /> Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm font-bold text-white transition-colors shadow-lg shadow-violet-600/20">
              <User size={16} /> Add Guest
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
              <span className="flex items-center text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                +12%
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{totalGuests}</p>
            <p className="text-xs text-gray-500">Total Guests</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <CheckCircle2 size={18} />
              </div>
              <span className="flex items-center text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                +5%
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{checkedIn}</p>
            <p className="text-xs text-gray-500">Checked In</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                <Clock size={18} />
              </div>
              <span className="flex items-center text-[10px] text-gray-500 font-bold bg-gray-500/10 px-1.5 py-0.5 rounded">
                0%
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{pending}</p>
            <p className="text-xs text-gray-500">Pending Arrival</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                <XCircle size={18} />
              </div>
              <span className="flex items-center text-[10px] text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded">
                +2%
              </span>
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
                <button className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs text-white rounded-lg transition-colors">
                  Daily
                </button>
                <button className="px-3 py-1 hover:bg-white/5 text-xs text-gray-500 rounded-lg transition-colors">
                  Weekly
                </button>
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
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
              {recentFeedback.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-white/[0.02] border border-white/5 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white">
                      {fb.user}
                    </span>
                    <div className="flex text-amber-400">
                      {[...Array(fb.rating)].map((_, i) => (
                        <Star key={i} size={10} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    "{fb.comment}"
                  </p>
                </div>
              ))}
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
      <div className="bg-[#0A0A0A] border-x border-b border-white/10 rounded-b-2xl overflow-hidden min-h-[500px]">
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
                {filteredRegistrations.map((reg) => (
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
                      <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal size={18} />
                      </button>
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
        <p>Showing {filteredRegistrations.length} registrations</p>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded border border-white/10 hover:bg-white/5 disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <button
            className="px-3 py-1 rounded border border-white/10 hover:bg-white/5 disabled:opacity-50"
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventGuestList;
