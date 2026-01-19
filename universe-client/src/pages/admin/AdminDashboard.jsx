import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

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

const GAUGE_DATA = [
  { name: "Completed", value: 68 },
  { name: "Remaining", value: 32 },
];
const COLORS = ["#8b5cf6", "#1e293b"];

// --- Components ---

const StatCard = ({
  title,
  value,
  change,
  isPositive,
  icon: IconComponent,
  colorClass,
}) => (
  <div className="bg-[#13131a] border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-full relative overflow-hidden group hover:border-violet-500/30 transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <h2 className="text-2xl font-bold text-white">{value}</h2>
      </div>
      <div
        className={`p-2 rounded-xl bg-white/5 text-white ${colorClass} group-hover:scale-110 transition-transform`}
      >
        <IconComponent size={20} />
      </div>
    </div>
    <div className="flex items-center gap-2 text-xs font-medium">
      <span
        className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
          isPositive
            ? "text-emerald-400 bg-emerald-400/10"
            : "text-rose-400 bg-rose-400/10"
        }`}
      >
        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {change}
      </span>
      <span className="text-gray-500">vs. last period</span>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);

  const fetchDashboardStats = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      if (!token || storedUser.role !== "admin") {
        navigate("/login");
        return;
      }
      setUser(storedUser);
      fetchDashboardStats(token);
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome back, {user ? user.name : "Admin"}!
        </h1>
        <p className="text-gray-400">
          Here is what is happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value={stats?.totalEvents || "1,204"}
          change="12.5%"
          isPositive={true}
          icon={Calendar}
          colorClass="text-blue-400"
        />
        <StatCard
          title="Active Users"
          value={stats?.totalUsers || "6,225"}
          change="8.4%"
          isPositive={true}
          icon={Users}
          colorClass="text-emerald-400"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingEvents || "28"}
          change="10.5%"
          isPositive={false}
          icon={Clock}
          colorClass="text-rose-400"
        />
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || "16,431"}
          change="15.5%"
          isPositive={true}
          icon={CheckCircle}
          colorClass="text-violet-400"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Area Chart */}
        <div className="xl:col-span-2 bg-[#13131a] border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">
                Platform Activity
              </h3>
              <p className="text-xs text-gray-500">
                Monthly registration trends
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-400 hover:text-white transition-colors">
                Weekly
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-violet-600/20 text-xs text-violet-300 font-medium">
                Monthly
              </button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
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

        {/* Bar Chart */}
        <div className="bg-[#13131a] border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Daily Traffic</h3>
            <button className="text-gray-500 hover:text-white">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="h-[200px] w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DAILY_ACTIVITY_DATA}>
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {DAILY_ACTIVITY_DATA.map((entry, index) => (
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
              <h4 className="text-3xl font-bold text-white">8,162</h4>
              <p className="text-xs text-gray-400">Total visitors this week</p>
            </div>
            <div className="text-emerald-400 text-xs font-medium flex items-center">
              <ArrowUpRight size={14} className="mr-1" /> +2.4%
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Top Events Table */}
        <div className="xl:col-span-2 bg-[#13131a] border border-white/5 rounded-2xl p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Trending Events</h3>
            <button className="text-violet-400 text-sm font-medium hover:underline">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-white/5">
                  <th className="pb-3 pl-2">Event Name</th>
                  <th className="pb-3">Sold</th>
                  <th className="pb-3">Revenue</th>
                  <th className="pb-3">Rating</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  {
                    name: "Nebula Music Festival",
                    sold: "2,310",
                    revenue: "$124,839",
                    rating: "5.0",
                  },
                  {
                    name: "Tech Summit 2026",
                    sold: "1,230",
                    revenue: "$92,682",
                    rating: "4.8",
                  },
                  {
                    name: "Cosmic Art Expo",
                    sold: "812",
                    revenue: "$74,049",
                    rating: "4.9",
                  },
                  {
                    name: "Zero-G Sports",
                    sold: "645",
                    revenue: "$62,820",
                    rating: "4.5",
                  },
                ].map((item, idx) => (
                  <tr
                    key={idx}
                    className="group hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 pl-2 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                        {item.name.charAt(0)}
                      </div>
                      <span className="text-white font-medium">
                        {item.name}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400">{item.sold}</td>
                    <td className="py-4 text-emerald-400 font-medium">
                      {item.revenue}
                    </td>
                    <td className="py-4 text-yellow-400 flex items-center gap-1">
                      ⭐ {item.rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Engagement Widget */}
        <div className="bg-[#13131a] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-bold text-white self-start mb-6">
            User Satisfaction
          </h3>
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={GAUGE_DATA}
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
                  {GAUGE_DATA.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -mt-4">
              <span className="text-3xl font-black text-white">68%</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Overall positive feedback across all events this month.
          </p>
          <button className="mt-6 px-6 py-2 rounded-full border border-white/10 text-sm font-medium text-white hover:bg-white/5 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
