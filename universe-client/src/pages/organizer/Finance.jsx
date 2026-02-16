import React, { useState, useEffect, useCallback } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  Download,
  ArrowUpRight,
  CreditCard,
  Activity,
  PieChart,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { Button } from "@/components/ui/button";
import TransactionsModal from "@/components/organizer/finance/TransactionsModal";

const Finance = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ticketsSold: 0,
    avgTicketPrice: 0,
    activeRegistrations: 0,
    revenueData: [],
    trends: {
      revenueTrend: 0,
      ticketsTrend: 0,
      avgPriceTrend: 0,
      registrationTrend: 0,
    },
    recentActivity: [],
    insight: { label: "", value: "", positive: true },
  });
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryData, setCategoryData] = useState([]);

  const fetchFinanceData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Finance Stats
      const statsRes = await fetch(
        "http://localhost:5000/api/events/organizer/finance-stats",
        { headers },
      );
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch Recent Transactions
      const transRes = await fetch(
        "http://localhost:5000/api/events/organizer/transactions",
        { headers },
      );
      const transData = await transRes.json();
      setTransactions(transData?.slice(0, 5) || []);

      // Fetch Category Intelligence for revenue breakdown
      const categoryRes = await fetch(
        "http://localhost:5000/api/events/organizer/category-intelligence",
        { headers },
      );
      const categoryResData = await categoryRes.json();
      setCategoryData(categoryResData?.categoryData || []);
    } catch (error) {
      console.error("Error fetching finance data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  const exportReport = () => {
    if (!transactions.length) return;

    const headers = ["ID", "Event", "Amount", "Date", "Status"];
    const rows = transactions.map((t) => [
      t.id,
      t.event,
      `RM${t.amount}`,
      new Date(t.date).toLocaleDateString(),
      t.status,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Revenue_Report_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 font-neuemontreal tracking-widest uppercase text-xs">
            Processing Financial Data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-clash font-bold text-white mb-1">
            Finance & Revenue
          </h1>
          <p className="text-white/40 text-sm">
            Track your earnings and event expenses
          </p>
        </div>

        <Button
          onClick={exportReport}
          className="bg-violet-600 hover:bg-violet-700 text-white gap-2 h-10 px-6 rounded-xl shadow-lg shadow-violet-500/20 transition-all active:scale-95"
        >
          <Download size={16} />
          Export Report
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Revenue",
            value: `RM${stats.totalRevenue?.toLocaleString()}`,
            icon: DollarSign,
            trend: `${stats.trends?.revenueTrend > 0 ? "+" : ""}${stats.trends?.revenueTrend || 0}%`,
            positive: parseFloat(stats.trends?.revenueTrend) >= 0,
            color: "text-emerald-400",
          },
          {
            label: "Tickets Sold",
            value: stats.ticketsSold?.toLocaleString(),
            icon: CreditCard,
            trend: `${stats.trends?.ticketsTrend > 0 ? "+" : ""}${stats.trends?.ticketsTrend || 0}%`,
            positive: parseFloat(stats.trends?.ticketsTrend) >= 0,
            color: "text-blue-400",
          },
          {
            label: "Avg. Ticket Price",
            value: `RM${stats.avgTicketPrice}`,
            icon: TrendingUp,
            trend: `${stats.trends?.avgPriceTrend || 0}%`,
            positive: parseFloat(stats.trends?.avgPriceTrend) >= 0,
            color: "text-violet-400",
          },
          {
            label: "Active Registrations",
            value: stats.activeRegistrations?.toLocaleString(),
            icon: Users,
            trend: `${stats.trends?.registrationTrend > 0 ? "+" : ""}${stats.trends?.registrationTrend || 0}%`,
            positive: parseFloat(stats.trends?.registrationTrend) >= 0,
            color: "text-amber-400",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="group bg-[#050505] border border-white/10 rounded-2xl p-5 shadow-lg hover:border-white/20 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                <stat.icon size={20} className={stat.color} />
              </div>
              <div
                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.positive ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"}`}
              >
                {stat.positive ? (
                  <ArrowUpRight size={10} />
                ) : (
                  <ArrowDownRight size={10} />
                )}
                {stat.trend}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-xs text-white/40 font-bold uppercase tracking-widest">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white">
              Revenue Performance
            </h3>
            <div className="flex gap-2">
              <div className="bg-white/5 p-1 rounded-lg flex gap-1">
                <button className="px-3 py-1 text-[10px] font-bold text-white/40 hover:text-white transition-colors">
                  6M
                </button>
                <button className="px-3 py-1 text-[10px] font-bold bg-violet-500/20 text-violet-400 rounded-md border border-violet-500/20 shadow-lg">
                  1Y
                </button>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(255,255,255,0.3)",
                    fontSize: 10,
                    fontWeight: 700,
                    textAnchor: "middle",
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(255,255,255,0.3)",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0A0A0A",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                  }}
                  itemStyle={{
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  cursor={{
                    stroke: "#8b5cf6",
                    strokeWidth: 2,
                    strokeDasharray: "5 5",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-1 bg-[#050505] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">
              Recent Transactions
            </h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors bg-violet-400/5 px-3 py-1.5 rounded-lg border border-violet-400/10"
            >
              View All
            </button>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
            {transactions.length > 0 ? (
              transactions.map((tr) => (
                <div
                  key={tr.id}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.04] transition-all border border-transparent hover:border-white/5 group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl border border-white/10 ${tr.type === "income" ? "bg-emerald-400/5" : "bg-red-400/5"}`}
                    >
                      <DollarSign
                        size={16}
                        className={
                          tr.type === "income"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate max-w-[120px]">
                        {tr.event}
                      </p>
                      <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                        {new Date(tr.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-sm ${tr.type === "income" ? "text-emerald-400" : "text-white"}`}
                    >
                      {tr.type === "income" ? "+" : ""}
                      RM{tr.amount}
                    </p>
                    <p className="text-[9px] text-white/20 font-black uppercase tracking-tighter">
                      {tr.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
                <Activity size={32} className="mb-2 text-white" />
                <p className="text-xs font-bold uppercase tracking-widest">
                  No Recent Streams
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Revenue Breakdown */}
      {categoryData.length > 0 && (
        <div className="mt-8 bg-[#050505] border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-violet-500/10 rounded-lg">
              <PieChart size={20} className="text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Revenue by Category
              </h3>
              <p className="text-xs text-white/40">
                Financial performance breakdown by event type
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryData.map((cat, i) => {
              const totalCategoryRevenue = categoryData.reduce(
                (sum, c) => sum + c.totalRevenue,
                0,
              );
              const percentage =
                totalCategoryRevenue > 0
                  ? Math.round((cat.totalRevenue / totalCategoryRevenue) * 100)
                  : 0;

              const colors = [
                "bg-emerald-500",
                "bg-blue-500",
                "bg-violet-500",
                "bg-amber-500",
                "bg-rose-500",
                "bg-cyan-500",
              ];
              const barColor = colors[i % colors.length];

              return (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-white">
                      {cat.category}
                    </span>
                    <span className="text-xs text-white/40">
                      {cat.totalEvents} events
                    </span>
                  </div>

                  {/* Revenue Bar */}
                  <div className="relative h-3 bg-white/5 rounded-full overflow-hidden mb-3">
                    <div
                      className={`absolute left-0 top-0 h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">
                      RM{cat.totalRevenue.toLocaleString()}
                    </span>
                    <span
                      className={`text-sm font-bold ${percentage > 30 ? "text-emerald-400" : percentage > 10 ? "text-amber-400" : "text-white/40"}`}
                    >
                      {percentage}%
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-4 text-[10px] text-white/40">
                    <span>{cat.totalAttendees} attendees</span>
                    <span>•</span>
                    <span>RM{cat.avgRevenuePerEvent} avg/event</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <TransactionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Finance;
