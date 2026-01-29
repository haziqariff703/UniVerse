import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Users,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Button } from "@/components/ui/button";

const Finance = () => {
  const revenueData = [
    { name: "Jan", revenue: 4000, registrations: 240 },
    { name: "Feb", revenue: 3000, registrations: 198 },
    { name: "Mar", revenue: 2000, registrations: 150 },
    { name: "Apr", revenue: 2780, registrations: 190 },
    { name: "May", revenue: 1890, registrations: 120 },
    { name: "Jun", revenue: 2390, registrations: 170 },
    { name: "Jul", revenue: 3490, registrations: 250 },
  ];

  const transactions = [
    {
      id: 1,
      event: "Tech Innovation Summit",
      amount: 1250,
      date: "24 Jan, 2024",
      status: "completed",
      type: "income",
    },
    {
      id: 2,
      event: "AI Workshop",
      amount: 450,
      date: "22 Jan, 2024",
      status: "completed",
      type: "income",
    },
    {
      id: 3,
      event: "Venue Security Deposit",
      amount: -500,
      date: "20 Jan, 2024",
      status: "pending",
      type: "expense",
    },
    {
      id: 4,
      event: "Networking Gala",
      amount: 3200,
      date: "15 Jan, 2024",
      status: "completed",
      type: "income",
    },
    {
      id: 5,
      event: "Equipment Rental",
      amount: -250,
      date: "10 Jan, 2024",
      status: "completed",
      type: "expense",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-neuemontreal font-bold text-white mb-1">
              Finance & Revenue
            </h1>
            <p className="text-white/40 text-sm">
              Track your earnings and event expenses
            </p>
          </div>
        </div>

        <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
          <Download size={16} />
          Export Report
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Revenue",
            value: "$24,560.00",
            icon: DollarSign,
            trend: "+12.5%",
            positive: true,
          },
          {
            label: "Tickets Sold",
            value: "1,240",
            icon: CreditCard,
            trend: "+8.2%",
            positive: true,
          },
          {
            label: "Avg. Ticket Price",
            value: "$19.80",
            icon: TrendingUp,
            trend: "-2.1%",
            positive: false,
          },
          {
            label: "Active Registrations",
            value: "854",
            icon: Users,
            trend: "+5.4%",
            positive: true,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#050505] border border-white/10 rounded-2xl p-5 shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/5 rounded-lg">
                <stat.icon size={20} className="text-violet-400" />
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
        <div className="lg:col-span-2 bg-[#050505] border border-white/10 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white">
              Revenue Performance
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/10 text-white text-[10px] h-7"
              >
                6 Months
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-violet-500/20 border-violet-500/50 text-violet-400 text-[10px] h-7"
              >
                1 Year
              </Button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
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
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(255,255,255,0.3)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f0f0f",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                  }}
                  itemStyle={{ color: "#fff", fontSize: "12px" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-1 bg-[#050505] border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">
              Recent Transactions
            </h3>
            <button className="text-xs font-bold text-violet-400 hover:text-violet-300">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {transactions.map((tr) => (
              <div
                key={tr.id}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.02] transition-colors group"
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
                  <div>
                    <p className="text-sm font-bold text-white truncate max-w-[150px]">
                      {tr.event}
                    </p>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                      {tr.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${tr.type === "income" ? "text-emerald-400" : "text-white"}`}
                  >
                    {tr.type === "income" ? "+" : ""}
                    {tr.amount < 0
                      ? `-$${Math.abs(tr.amount)}`
                      : `$${tr.amount}`}
                  </p>
                  <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                    {tr.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;
