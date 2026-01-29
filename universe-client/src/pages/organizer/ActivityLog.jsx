import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  ShieldAlert,
  Calendar,
  User,
  CheckCircle2,
  FileEdit,
  Trash2,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const CircularProgress = ({ value, color, size = 60, strokeWidth = 5 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-white/5"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={color}
        />
      </svg>
      <span className="absolute text-xs font-bold text-white">{value}%</span>
    </div>
  );
};

const ActivityLog = () => {
  const [searchParams] = useSearchParams();
  const eventIdFilter = searchParams.get("eventId");

  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("oct-2023");

  // Mock Data (Enhanced with event_id)
  const stats = [
    { label: "Total Actions", value: eventIdFilter ? 12 : 199, isTotal: true },
    {
      label: eventIdFilter ? "This Event" : "Events",
      value: 44,
      color: "text-cyan-400",
    },
    { label: "Updates", value: 43, color: "text-violet-400" },
    { label: "Critical", value: 23, color: "text-amber-400" },
    { label: "Errors", value: 89, color: "text-red-400" },
  ];

  const logs = [
    {
      id: 1,
      date: "Oct 24, 2023",
      time: "9:49 AM",
      user: { name: "Haziq Ariff", email: "haziq@universe.com", initial: "HA" },
      action: "Update",
      title: "Updated event details for 'Tech Summit'",
      status: "completed",
      icon: FileEdit,
      iconColor: "text-violet-400",
    },
    {
      id: 2,
      date: "Oct 23, 2023",
      time: "2:15 PM",
      user: {
        name: "Sarah Jenkins",
        email: "sarah@universe.com",
        initial: "SJ",
      },
      action: "Create",
      title: "Created new venue 'Grand Hall'",
      status: "completed",
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
    },
    {
      id: 3,
      date: "Oct 23, 2023",
      time: "11:30 AM",
      user: { name: "System", email: "bot@universe.com", initial: "SYS" },
      action: "Security",
      title: "Failed login attempt detected",
      status: "warning",
      icon: ShieldAlert,
      iconColor: "text-amber-400",
    },
    {
      id: 4,
      date: "Oct 22, 2023",
      time: "4:00 PM",
      user: { name: "Mike Ross", email: "mike@universe.com", initial: "MR" },
      action: "Delete",
      title: "Deleted distinct venue 'Room 101'",
      status: "critical",
      icon: Trash2,
      iconColor: "text-red-400",
    },
    {
      id: 5,
      date: "Oct 22, 2023",
      time: "10:00 AM",
      user: { name: "Haziq Ariff", email: "haziq@universe.com", initial: "HA" },
      action: "Access",
      title: "Changed permissions for 'Staff Role'",
      status: "completed",
      icon: Lock,
      iconColor: "text-cyan-400",
    },
    {
      id: 6,
      date: "Oct 21, 2023",
      time: "9:15 AM",
      user: {
        name: "Sarah Jenkins",
        email: "sarah@universe.com",
        initial: "SJ",
      },
      action: "Update",
      title: "Modified ticket pricing for 'Gala Night'",
      status: "completed",
      icon: FileEdit,
      iconColor: "text-violet-400",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500";
      case "warning":
        return "bg-amber-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-neuemontreal font-bold text-white mb-1 flex items-center gap-3">
              Audit Log
              {eventIdFilter && (
                <span className="text-xs px-2 py-1 rounded border border-violet-500/30 bg-violet-500/10 text-violet-400 uppercase tracking-widest font-bold">
                  Event #{eventIdFilter}
                </span>
              )}
            </h1>
            <p className="text-white/40 text-sm">
              {eventIdFilter
                ? "Viewing specific logs for selected event"
                : "Track and monitor system-wide activities"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 gap-2"
          >
            <Download size={16} />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-8 md:gap-12">
          {/* Total */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white/5 border-4 border-white/10 flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-white text-center">
                199
              </span>
            </div>
            <span className="text-sm font-bold text-white">All Logs</span>
            <div className="h-1 w-8 bg-violet-500 mt-2 rounded-full" />
          </div>

          {/* Metrics */}
          {stats
            .filter((s) => !s.isTotal)
            .map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="mb-3">
                  <CircularProgress value={stat.value} color={stat.color} />
                </div>
                <span className="text-xs font-bold text-white/60 flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${stat.color.replace("text", "bg")}`}
                  />
                  {stat.label}
                </span>
              </div>
            ))}
          <div className="hidden md:block w-[1px] h-20 bg-white/5" />

          {/* Extra Stats */}
          <div className="flex gap-8">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white mb-1">0</span>
              <span className="text-xs text-white/40 uppercase tracking-widest font-bold">
                Viruses
              </span>
              <div className="h-1 w-4 bg-emerald-500 mt-2 rounded-full opacity-20" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white mb-1">0</span>
              <span className="text-xs text-white/40 uppercase tracking-widest font-bold">
                Threats
              </span>
              <div className="h-1 w-4 bg-red-500 mt-2 rounded-full opacity-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#050505] border border-white/10 rounded-3xl p-6 min-h-[600px]">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
                size={16}
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by user, action or details..."
                className="pl-10 bg-white/5 border-white/10 text-white h-10 focus-visible:ring-violet-400/50 rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white rounded-xl h-10">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="oct-2023">13/10/23 - 20/10/23</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/40">
            <span>1-8 of 199</span>
            <div className="flex ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/40 hover:text-white"
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/40 hover:text-white"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[11px] uppercase tracking-widest text-white/40 font-bold">
                <th className="p-4 w-12 text-center">
                  <Checkbox className="border-white/20 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500" />
                </th>
                <th className="p-4">Date</th>
                <th className="p-4">User</th>
                <th className="p-4 text-center">Type</th>
                <th className="p-4">Details</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-4 text-center">
                    <Checkbox className="border-white/10 group-hover:border-white/20 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500" />
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">
                        {log.date}
                      </span>
                      <span className="text-xs text-white/40">{log.time}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                        {log.user.initial}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">
                          {log.user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/5">
                      <log.icon size={14} className={log.iconColor} />
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-white/60 font-medium">
                      {log.title}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-white/10 text-white/40 hover:text-white"
                      >
                        <Lock size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-white/10 text-white/40 hover:text-white"
                      >
                        <MoreHorizontal size={14} />
                      </Button>
                      <div
                        className={`w-2 h-2 rounded-full ml-2 ${getStatusColor(log.status)} shadow-[0_0_8px] shadow-current`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
