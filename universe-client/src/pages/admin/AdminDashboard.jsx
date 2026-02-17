import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/config/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Calendar,
  Clock,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  RefreshCw,
  Eye,
  Loader2,
  MapPin,
  UserCircle,
  Mic,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Mock Data ---
const REVENUE_DATA = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 2780 },
  { name: "May", value: 1890 },
  { name: "Jun", value: 2390 },
  { name: "Jul", value: 3490 },
  { name: "Aug", value: 4200 },
  { name: "Sep", value: 5100 },
  { name: "Oct", value: 6500 },
  { name: "Nov", value: 7200 },
  { name: "Dec", value: 8100 },
];

const DAILY_ACTIVITY_DATA = [
  { name: "Sun", value: 40 },
  { name: "Mon", value: 85 },
  { name: "Tue", value: 100, active: true },
  { name: "Wed", value: 60 },
  { name: "Thu", value: 50 },
  { name: "Fri", value: 90 },
  { name: "Sat", value: 70 },
];

const COLORS = ["#8b5cf6", "#1e293b"];

// --- Components ---

const StatCard = ({
  title,
  value,
  change,
  isPositive,
  icon: CardIcon,
  colorClass,
  description,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`bg-[#13131a] border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-full relative overflow-hidden group hover:border-violet-500/30 transition-all duration-300 ${
      onClick ? "cursor-pointer" : ""
    }`}
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <h2 className="text-2xl font-bold text-white">{value}</h2>
      </div>
      <div
        className={`p-2 rounded-xl bg-white/5 text-white ${colorClass} group-hover:scale-110 transition-transform`}
      >
        <CardIcon size={20} />
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-medium">
        <span
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
            isPositive
              ? "text-emerald-400 bg-emerald-400/10"
              : "text-rose-400 bg-rose-400/10"
          }`}
        >
          {change !== "---" &&
            (isPositive ? (
              <ArrowUpRight size={12} />
            ) : (
              <ArrowDownRight size={12} />
            ))}
          {isPositive && change !== "---" && "+"}
          {change}
          {change !== "---" ? "%" : ""}
        </span>
        <span className="text-gray-500">vs. last period</span>
      </div>
      {description && (
        <p className="text-[10px] text-starlight/60 mt-3 font-medium leading-relaxed italic border-t border-white/5 pt-2">
          {description}
        </p>
      )}
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: "0",
    eventsChange: 0,
    totalUsers: "0",
    usersChange: 0,
    pendingEvents: "0",
    totalBookings: "0",
    bookingsChange: 0,
    revenue: "0",
    trafficData: [],
    trendingEvents: [],
    satisfaction: { score: 0, positive: 0, total: 0 },
    activityStats: [],
    upcomingEvents: [],
    pendingActions: { events: 0, organizers: 0, speakers: 0 },
    genderDistribution: [],
    revenueBreakdown: { category: [], audience: [], organizer: [] },
    conversionFunnel: [],
  });
  const [user, setUser] = useState(null);
  const [timeRange, setTimeRange] = useState("year");
  const [revenueView, setRevenueView] = useState("category");

  const fetchDashboardStats = useCallback(async (range = "year") => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/admin/stats?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalEvents: (data.stats?.totalEvents || 0).toLocaleString(),
          eventsChange: data.stats?.eventsChange || 0,
          totalUsers: (data.stats?.totalUsers || 0).toLocaleString(),
          usersChange: data.stats?.usersChange || 0,
          pendingEvents: (data.stats?.pendingEvents || 0).toLocaleString(),
          totalBookings: (data.stats?.totalBookings || 0).toLocaleString(),
          bookingsChange: data.stats?.bookingsChange || 0,
          revenue: (data.stats?.revenue || 0).toLocaleString(),
          trafficData: data.stats?.trafficData || [],
          trendingEvents: data.stats?.trendingEvents || [],
          satisfaction: data.stats?.satisfaction || {
            score: 0,
            positive: 0,
            total: 0,
          },
          activityStats: data.stats?.activityStats || [],
          upcomingEvents: data.stats?.upcomingEvents || [],
          pendingActions: data.stats?.pendingActions || {
            events: 0,
            organizers: 0,
            speakers: 0,
          },
          genderDistribution: data.stats?.genderDistribution || [],
          revenueBreakdown: data.stats?.revenueBreakdown || {
            category: [],
            audience: [],
            organizer: [],
          },
          conversionFunnel: data.stats?.conversionFunnel || [],
        });
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const getSafeUser = () => {
        try {
          const stored = localStorage.getItem("user");
          return stored && stored !== "undefined" ? JSON.parse(stored) : {};
        } catch {
          return {};
        }
      };

      const storedUser = getSafeUser();
      const token = localStorage.getItem("token");

      if (!token || storedUser.role !== "admin") {
        navigate("/login");
        return;
      }
      setUser(storedUser);
      fetchDashboardStats(timeRange);
    };

    checkAuth();
  }, [navigate, timeRange, fetchDashboardStats]);

  useEffect(() => {
    if (user) {
      fetchDashboardStats(timeRange);
    }
  }, [timeRange, user, fetchDashboardStats]);

  const getGenderColor = (label) => {
    const key = (label || "").toString().toLowerCase();
    if (key.includes("male")) return "#3b82f6";
    if (key.includes("female")) return "#ec4899";
    return "#64748b";
  };

  const toNumber = (value) => {
    if (value === null || value === undefined) return 0;
    const normalized =
      typeof value === "string" ? value.replace(/,/g, "") : value;
    const parsed = Number(normalized);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const SATISFACTION_DATA = [
    { name: "Positive", value: stats.satisfaction.score },
    { name: "Negative/Neutral", value: 100 - stats.satisfaction.score },
  ];
  const SATISFACTION_COLORS = ["#10b981", "#3f3f46"];

  const revenueData =
    stats.revenueBreakdown?.[revenueView] &&
    stats.revenueBreakdown[revenueView].length > 0
      ? stats.revenueBreakdown[revenueView]
      : [];

  const funnelData =
    stats.conversionFunnel && stats.conversionFunnel.length > 0
      ? stats.conversionFunnel
      : [];

  const periodLabel =
    timeRange === "year" ? "YTD" : timeRange === "month" ? "MTD" : "WTD";

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10 text-starlight">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome back, {user?.name || "System Admin"}!
          </h1>
          <p className="text-gray-400">
            Real-time metrics for the UniVerse platform.
          </p>
        </div>

        <div className="flex bg-[#13131a] p-1 rounded-xl border border-white/5">
          {["week", "month", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}ly
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">
          Quick Actions
        </span>
        <button
          onClick={() => navigate("/admin/events/approvals")}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider hover:bg-rose-500/20 transition-colors"
        >
          Pending Events
          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 text-[10px]">
            {stats.pendingActions.events}
          </span>
        </button>
        <button
          onClick={() => navigate("/admin/organizers/approvals")}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider hover:bg-amber-500/20 transition-colors"
        >
          Pending Organizers
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 text-[10px]">
            {stats.pendingActions.organizers}
          </span>
        </button>
        <button
          onClick={() => navigate("/admin/speakers/approvals")}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider hover:bg-blue-500/20 transition-colors"
        >
          Pending Speakers
          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-[10px]">
            {stats.pendingActions.speakers}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title={`Events (${periodLabel})`}
              value={stats.totalEvents}
              change={stats.eventsChange}
              isPositive={parseFloat(stats.eventsChange) >= 0}
              icon={Calendar}
              colorClass="text-blue-400"
              description={
                timeRange === "year"
                  ? "Created year-to-date"
                  : `Created this ${timeRange}`
              }
            />
            <StatCard
              title={`Users (${periodLabel})`}
              value={stats.totalUsers}
              change={stats.usersChange}
              isPositive={parseFloat(stats.usersChange) >= 0}
              icon={Users}
              colorClass="text-emerald-400"
              description={
                timeRange === "year"
                  ? "Joined year-to-date"
                  : `Joined this ${timeRange}`
              }
            />
            <StatCard
              title="Pending Approvals"
              value={stats.pendingEvents}
              change="---"
              isPositive={false}
              icon={Clock}
              colorClass="text-rose-400"
              description="New event proposals awaiting administrative review and certification."
              onClick={() => navigate("/admin/events/approvals")}
            />
            <StatCard
              title={`Bookings (${periodLabel})`}
              value={stats.totalBookings}
              change={stats.bookingsChange}
              isPositive={parseFloat(stats.bookingsChange) >= 0}
              icon={CheckCircle}
              colorClass="text-violet-400"
              description={
                timeRange === "year"
                  ? "Booked year-to-date"
                  : `Sold this ${timeRange}`
              }
            />
          </div>

          {/* Upcoming Events Strip */}
          {stats.upcomingEvents.length > 0 && (
            <div className="bg-[#13131a] border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Upcoming Events
                  </h3>
                  <p className="text-xs text-gray-500">Next 7 days</p>
                </div>
                <button
                  onClick={() => navigate("/admin/events")}
                  className="text-violet-400 text-sm font-medium hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {stats.upcomingEvents.map((evt) => {
                  const evtDate = new Date(evt.date_time);
                  const dayName = evtDate.toLocaleDateString("en-US", {
                    weekday: "short",
                  });
                  const dayNum = evtDate.getDate();
                  const month = evtDate.toLocaleDateString("en-US", {
                    month: "short",
                  });
                  return (
                    <div
                      key={evt._id}
                      className="bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:border-violet-500/30 transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-violet-500/10 text-violet-400 rounded-lg px-2.5 py-1.5 text-center min-w-[48px]">
                          <div className="text-[10px] font-bold uppercase">
                            {dayName}
                          </div>
                          <div className="text-lg font-black leading-none">
                            {dayNum}
                          </div>
                          <div className="text-[9px] uppercase opacity-60">
                            {month}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">
                            {evt.title}
                          </h4>
                          <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
                            <MapPin size={10} />
                            <span className="truncate">{evt.venue}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-medium">
                        <span className="text-gray-500">
                          {evt.registrations}
                          {evt.max_capacity > 0
                            ? `/${evt.max_capacity}`
                            : ""}{" "}
                          registered
                        </span>
                        {evt.max_capacity > 0 && (
                          <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-violet-500 rounded-full"
                              style={{
                                width: `${Math.min((evt.registrations / evt.max_capacity) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-[#13131a] border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Platform Activity
                  </h3>
                  <p className="text-xs text-gray-500">
                    Registration & Revenue trends
                  </p>
                </div>
              </div>
              <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={
                      stats.activityStats?.length > 0
                        ? stats.activityStats
                        : REVENUE_DATA
                    }
                  >
                    <defs>
                      <linearGradient
                        id="colorValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#2a2a35"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "value"
                          ? `RM ${value.toLocaleString()}`
                          : value,
                        name === "value" ? "Revenue" : "Ticket Sales",
                      ]}
                      contentStyle={{
                        backgroundColor: "#1e1e24",
                        borderColor: "#3f3f46",
                        color: "#fff",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#fff" }}
                      cursor={{ stroke: "#8b5cf6", strokeWidth: 1 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#13131a] border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Daily Traffic</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-[#1e1e24] border-white/10 text-starlight"
                  >
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={() => fetchDashboardStats(timeRange)}
                      className="hover:bg-white/5 cursor-pointer"
                    >
                      <RefreshCw size={14} className="mr-2" /> Refresh Data
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/audit-logs")}
                      className="hover:bg-white/5 cursor-pointer"
                    >
                      <Eye size={14} className="mr-2" /> View Audit Logs
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="h-[200px] w-full mb-4 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={
                      stats.trafficData.length > 0
                        ? stats.trafficData
                        : DAILY_ACTIVITY_DATA
                    }
                  >
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {(stats.trafficData.length > 0
                        ? stats.trafficData
                        : DAILY_ACTIVITY_DATA
                      ).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.active ? "#3b82f6" : "#27272a"}
                        />
                      ))}
                    </Bar>
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        backgroundColor: "#1e1e24",
                        borderColor: "#3f3f46",
                        color: "#fff",
                        borderRadius: "8px",
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between items-end mt-4">
                <div>
                  <h4 className="text-3xl font-bold text-white">
                    {stats.trafficData
                      .reduce((acc, curr) => acc + (curr.value || 0), 0)
                      .toLocaleString()}
                  </h4>
                  <p className="text-xs text-gray-400">
                    Registrations last 7 days
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-[#13131a] border border-white/5 rounded-2xl p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Trending Events</h3>
                <button
                  onClick={() => navigate("/admin/events")}
                  className="text-violet-400 text-sm font-medium hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                {!stats?.trendingEvents || stats.trendingEvents.length === 0 ? (
                  <div className="py-12 text-center text-starlight/60">
                    <p>No trending events data available yet.</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-starlight/40 uppercase tracking-wider border-b border-white/5">
                        <th className="pb-3 pl-2">Event Name</th>
                        <th className="pb-3">Sold</th>
                        <th className="pb-3">Revenue</th>
                        <th className="pb-3">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {stats.trendingEvents.slice(0, 5).map((item, idx) => (
                        <tr
                          key={idx}
                          className="group hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 pl-2 flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-xs font-bold">
                              {item.name?.charAt(0) || "E"}
                            </div>
                            <span className="font-medium">{item.name}</span>
                          </td>
                          <td className="text-starlight/60">{item.sold}</td>
                          <td className="text-emerald-400 font-medium">
                            RM {(item.revenue || 0).toLocaleString()}
                          </td>
                          <td className="text-yellow-400 flex items-center gap-1">
                            ⭐ {item.rating}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="bg-[#13131a] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-bold text-white self-start mb-6">
                User Satisfaction
              </h3>
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SATISFACTION_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={180}
                      endAngle={0}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {SATISFACTION_DATA.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={SATISFACTION_COLORS[index]}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -mt-4 text-center">
                  <span className="text-3xl font-black text-white">
                    {stats.satisfaction.score}%
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Based on {stats.satisfaction.total} reviews received.
              </p>
              <button
                onClick={() => navigate("/admin/reviews")}
                className="mt-6 px-6 py-2 rounded-full border border-white/10 text-sm font-medium text-white hover:bg-white/5 transition-colors"
              >
                View Review Details
              </button>
            </div>
          </div>

          {/* Revenue Breakdown + Conversion Funnel */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-[#13131a] border border-white/5 rounded-2xl p-6">
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Revenue Breakdown
                    </h3>
                    <p className="text-xs text-gray-500">
                      Track income by segment
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-black/30 border border-white/5 rounded-xl p-1">
                    {[
                      { id: "category", label: "Category" },
                      { id: "audience", label: "Faculty" },
                      { id: "organizer", label: "Organizer" },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setRevenueView(option.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                          revenueView === option.id
                            ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {revenueData.length > 0 ? (
                <div className="h-[240px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} layout="vertical">
                      <XAxis
                        type="number"
                        stroke="#64748b"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={120}
                        stroke="#64748b"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        formatter={(value) => [
                          `RM ${Number(value).toLocaleString()}`,
                          "Revenue",
                        ]}
                        contentStyle={{
                          backgroundColor: "#1e1e24",
                          borderColor: "#3f3f46",
                          color: "#fff",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" fill="#22c55e" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="py-16 text-center text-gray-500 text-sm">
                  No revenue data available for this period.
                </div>
              )}
            </div>

            <div className="bg-[#13131a] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Conversion Funnel
                  </h3>
                  <p className="text-xs text-gray-500">
                    From registrations to reviews
                  </p>
                </div>
              </div>
              {funnelData.length > 0 ? (
                <div className="h-[240px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={funnelData}>
                      <XAxis
                        dataKey="name"
                        stroke="#64748b"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e1e24",
                          borderColor: "#3f3f46",
                          color: "#fff",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#38bdf8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="py-16 text-center text-gray-500 text-sm">
                  No conversion data available for this period.
                </div>
              )}
            </div>
          </div>

          {/* User Demographics + System Snapshot */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-[#13131a] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-bold text-white self-start mb-6">
                User Demographics
              </h3>
              {stats.genderDistribution.length > 0 ? (
                <>
                  <div className="relative w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.genderDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {stats.genderDistribution.map((entry, index) => (
                            <Cell
                              key={`gender-${index}`}
                              fill={getGenderColor(entry.name)}
                              stroke="none"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e1e24",
                            borderColor: "#3f3f46",
                            color: "#fff",
                            borderRadius: "8px",
                          }}
                          formatter={(value, name) => [value, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                      <Users
                        size={20}
                        className="text-violet-400 mx-auto mb-1"
                      />
                      <span className="text-xs text-gray-400 font-medium">
                        Gender
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {stats.genderDistribution.map((entry, index) => (
                      <div
                        key={entry.name}
                        className="flex items-center gap-2 text-xs"
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor: getGenderColor(entry.name),
                          }}
                        />
                        <span className="text-gray-400">{entry.name}</span>
                        <span className="text-white font-bold">
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm">
                  No gender data available yet.
                </p>
              )}
              <button
                onClick={() => navigate("/admin/users")}
                className="mt-6 px-6 py-2 rounded-full border border-white/10 text-sm font-medium text-white hover:bg-white/5 transition-colors"
              >
                View All Users
              </button>
            </div>

            <div className="bg-[#13131a] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">
                  System Snapshot
                </h3>
                <span className="text-xs text-gray-500">Current totals</span>
              </div>
              <div className="h-[220px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Events", value: toNumber(stats.totalEvents) },
                      { name: "Users", value: toNumber(stats.totalUsers) },
                      {
                        name: "Bookings",
                        value: toNumber(stats.totalBookings),
                      },
                      {
                        name: "Pending",
                        value: toNumber(stats.pendingEvents),
                      },
                    ]}
                  >
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        backgroundColor: "#1e1e24",
                        borderColor: "#3f3f46",
                        color: "#fff",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Live totals across key operational metrics.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
