import React, { useState, useEffect, useCallback } from "react";
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
  UserPlus,
  Settings,
  X,
  Copy,
  ExternalLink,
  Terminal,
  Clock,
  Database,
  ShieldCheck,
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
import { toast } from "sonner";

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

// Icon mapping based on action type
const getActionIcon = (action) => {
  switch (action) {
    case "Create":
      return { icon: CheckCircle2, color: "text-emerald-400" };
    case "Update":
      return { icon: FileEdit, color: "text-violet-400" };
    case "Delete":
      return { icon: Trash2, color: "text-red-400" };
    case "Approval":
      return { icon: CheckCircle2, color: "text-cyan-400" };
    case "Reject":
      return { icon: ShieldAlert, color: "text-amber-400" };
    case "Check-in":
      return { icon: UserPlus, color: "text-emerald-400" };
    case "Registration":
      return { icon: User, color: "text-blue-400" };
    default:
      return { icon: Settings, color: "text-gray-400" };
  }
};

const ActivityLog = () => {
  const [searchParams] = useSearchParams();
  const eventIdFilter = searchParams.get("eventId");

  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalLogs: 0,
    eventActions: 0,
    registrations: 0,
    updates: 0,
    checkIns: 0,
    critical: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLogs: 0,
  });
  const [actionFilter, setActionFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Interactive States
  const [selectedLogIds, setSelectedLogIds] = useState(new Set());
  const [activeLog, setActiveLog] = useState(null);

  const fetchActivityLogs = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: "20",
      });

      if (eventIdFilter) params.append("eventId", eventIdFilter);
      if (dateRange && dateRange !== "all")
        params.append("dateRange", dateRange);
      if (searchQuery) params.append("search", searchQuery);
      if (actionFilter && actionFilter !== "all")
        params.append("action", actionFilter);

      const res = await fetch(
        `http://localhost:5000/api/audit/organizer?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();

      if (res.ok) {
        setLogs(data.logs || []);
        setStats(data.stats || {});
        setPagination(
          data.pagination || { currentPage: 1, totalPages: 1, totalLogs: 0 },
        );
        setSelectedLogIds(new Set()); // Reset selection
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    } finally {
      setLoading(false);
    }
  }, [
    eventIdFilter,
    dateRange,
    pagination.currentPage,
    searchQuery,
    actionFilter,
  ]);

  useEffect(() => {
    fetchActivityLogs();
  }, [fetchActivityLogs]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchActivityLogs();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleSelectAll = () => {
    if (selectedLogIds.size === logs.length && logs.length > 0) {
      setSelectedLogIds(new Set());
    } else {
      setSelectedLogIds(new Set(logs.map((l) => l.id)));
    }
  };

  const toggleSelectLog = (id) => {
    const newSelection = new Set(selectedLogIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedLogIds(newSelection);
  };

  const exportSelectionToCsv = () => {
    const logsToExport = logs.filter((l) => selectedLogIds.has(l.id));
    if (logsToExport.length === 0) return;

    downloadCsv(logsToExport);
  };

  const downloadCsv = (dataToExport) => {
    const headers = [
      "Date",
      "Time",
      "User",
      "Email",
      "Action",
      "Details",
      "Status",
    ];
    const csvData = dataToExport.map((log) => {
      const date = new Date(log.date);
      return [
        `"${date.toLocaleDateString()}"`,
        `"${date.toLocaleTimeString()}"`,
        `"${log.user.name}"`,
        `"${log.user.email}"`,
        `"${log.action}"`,
        `"${log.title.replace(/"/g, '""')}"`,
        `"${log.status}"`,
      ].join(",");
    });

    const csv = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success(`Exported ${dataToExport.length} logs`);
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    toast.success("ID copied to clipboard");
  };

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

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Nominal";
      case "warning":
        return "High Risk";
      case "critical":
        return "Critical";
      default:
        return "Unknown";
    }
  };

  // Calculate percentages for circular progress
  const totalForPercent = Math.max(stats.totalLogs, 1);
  const eventPercent = Math.round((stats.eventActions / totalForPercent) * 100);
  const regPercent = Math.round((stats.registrations / totalForPercent) * 100);
  const updatePercent = Math.round((stats.updates / totalForPercent) * 100);
  const criticalPercent = Math.round((stats.critical / totalForPercent) * 100);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/10 border border-violet-600/20 flex items-center justify-center text-violet-400">
            <Database size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-clash font-bold text-white mb-1 flex items-center gap-3">
              Audit Log
              {eventIdFilter && (
                <span className="text-xs px-2 py-1 rounded border border-violet-500/30 bg-violet-500/10 text-violet-400 uppercase tracking-widest font-bold">
                  Event #{eventIdFilter.substring(0, 8)}...
                </span>
              )}
            </h1>
            <p className="text-white/40 text-sm">
              {eventIdFilter
                ? "Viewing activity logs for selected event"
                : "Track and monitor your event activities"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {eventIdFilter && (
            <Link to="/organizer/activity-log">
              <Button
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 gap-2 rounded-xl"
              >
                <ArrowLeft size={16} />
                View All
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 gap-2 rounded-xl"
            onClick={() => downloadCsv(logs)}
          >
            <Download size={16} />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Database size={120} className="text-violet-500" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-8 md:gap-12 relative z-10">
          {/* Total */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white/5 border-4 border-white/10 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
              <span className="text-2xl font-black text-white text-center tracking-tighter">
                {stats.totalLogs}
              </span>
            </div>
            <span className="text-sm font-bold text-white">All Logs</span>
            <div className="h-1 w-8 bg-violet-500 mt-2 rounded-full" />
          </div>

          {/* Metrics */}
          {[
            {
              label: eventIdFilter ? "This Event" : "Event Actions",
              value: eventPercent,
              color: "text-cyan-400",
            },
            {
              label: "Registrations",
              value: regPercent,
              color: "text-violet-400",
            },
            { label: "Updates", value: updatePercent, color: "text-amber-400" },
            {
              label: "Critical",
              value: criticalPercent,
              color: "text-red-400",
            },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center group">
              <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300">
                <CircularProgress value={stat.value || 0} color={stat.color} />
              </div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${stat.color.replace("text", "bg")} group-hover:animate-pulse`}
                />
                {stat.label}
              </span>
            </div>
          ))}
          <div className="hidden md:block w-[1px] h-20 bg-white/5" />

          {/* Extra Stats */}
          <div className="flex gap-8">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white mb-1 tracking-tighter">
                {stats.checkIns || 0}
              </span>
              <span className="text-xs text-white/40 uppercase tracking-widest font-bold">
                Check-ins
              </span>
              <div className="h-1 w-4 bg-emerald-500 mt-2 rounded-full opacity-50" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white mb-1 tracking-tighter">
                {stats.critical || 0}
              </span>
              <span className="text-xs text-white/40 uppercase tracking-widest font-bold">
                Alerts
              </span>
              <div className="h-1 w-4 bg-red-500 mt-2 rounded-full opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#050505] border border-white/10 rounded-3xl p-6 min-h-[600px] shadow-2xl relative">
        {/* Bulk Action Bar */}
        {selectedLogIds.size > 0 && (
          <div className="absolute top-0 inset-x-0 -translate-y-12 h-12 flex items-center justify-between px-6 bg-violet-600 rounded-t-2xl animate-in slide-in-from-bottom-4 duration-300">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck size={18} />
              {selectedLogIds.size} Items Selected
            </span>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 h-8"
                onClick={exportSelectionToCsv}
              >
                <Download size={14} className="mr-2" /> Export Selected
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 h-8"
                onClick={() => setSelectedLogIds(new Set())}
              >
                <X size={14} className="mr-2" /> Deselect
              </Button>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                size={18}
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search by user, action or details..."
                className="pl-12 bg-white/5 border-white/10 text-white h-12 focus-visible:ring-violet-400/50 rounded-xl font-medium placeholder:text-white/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={dateRange}
                onValueChange={(value) => {
                  setDateRange(value);
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
                }}
              >
                <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white rounded-xl h-10">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Action Type Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Select
                value={actionFilter}
                onValueChange={(value) => {
                  setActionFilter(value);
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
                }}
              >
                <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white rounded-xl h-10">
                  <SelectValue placeholder="Action Type" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="Create">Create</SelectItem>
                  <SelectItem value="Update">Update</SelectItem>
                  <SelectItem value="Delete">Delete</SelectItem>
                  <SelectItem value="Registration">Registration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-black text-white/40 uppercase tracking-[0.2em]">
            <span>
              {pagination.totalLogs > 0
                ? (pagination.currentPage - 1) * 20 + 1
                : 0}{" "}
              - {Math.min(pagination.currentPage * 20, pagination.totalLogs)} OF{" "}
              {pagination.totalLogs}
            </span>
            <div className="flex ml-4 gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-white/40 hover:text-white hover:bg-white/5 border border-white/5"
                disabled={pagination.currentPage <= 1}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage - 1,
                  }))
                }
              >
                <ChevronLeft size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-white/40 hover:text-white hover:bg-white/5 border border-white/5"
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage + 1,
                  }))
                }
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* Data Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase font-black tracking-[0.25em] text-white/40 bg-white/[0.01]">
                <th className="p-5 w-16 text-center">
                  <Checkbox
                    checked={
                      logs.length > 0 && selectedLogIds.size === logs.length
                    }
                    onCheckedChange={toggleSelectAll}
                    className="border-white/20 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500 rounded-md"
                  />
                </th>
                <th className="p-5">Temporal Index</th>
                <th className="p-5">Operator</th>
                <th className="p-5 text-center">Log Vector</th>
                <th className="p-5">Snapshot Summary</th>
                <th className="p-5 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                        Compiling Forensics...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-24 text-center">
                    <div className="flex flex-col items-center justify-center opacity-20">
                      <Terminal size={48} className="mb-4" />
                      <p className="text-sm font-black uppercase tracking-[0.3em]">
                        Registry Void Identified
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const { icon: LogIcon, color: iconColor } = getActionIcon(
                    log.action,
                  );
                  const isSelected = selectedLogIds.has(log.id);
                  const date = new Date(log.date);
                  return (
                    <tr
                      key={log.id}
                      className={`group hover:bg-white/[0.02] transition-colors cursor-pointer ${isSelected ? "bg-violet-500/5" : ""}`}
                      onClick={() => toggleSelectLog(log.id)}
                    >
                      <td
                        className="p-5 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelectLog(log.id)}
                          className="border-white/10 group-hover:border-white/20 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500 rounded-md"
                        />
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-white tracking-tight">
                            {date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-[10px] text-white/30 uppercase font-black">
                            {date.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-violet-400 group-hover:scale-110 transition-transform">
                            {log.user.initial}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
                              {log.user.email}
                            </span>
                            <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest truncate max-w-[120px]">
                              {log.user.name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 group-hover:bg-violet-500/10 transition-colors">
                          <LogIcon size={16} className={iconColor} />
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="text-sm text-white/60 font-medium leading-relaxed">
                          {log.title}
                        </span>
                      </td>
                      <td
                        className="p-5 text-right pr-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setActiveLog(log)}
                            className="h-9 w-9 hover:bg-white/10 text-white/40 hover:text-white rounded-xl border border-white/5"
                            title="Snapshot Viewer"
                          >
                            <Lock size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopyId(log.id)}
                            className="h-9 w-9 hover:bg-white/10 text-white/40 hover:text-white rounded-xl border border-white/5"
                            title="Copy ID"
                          >
                            <Copy size={16} />
                          </Button>
                          <div
                            className={`w-1.5 h-1.5 rounded-full ml-3 ${getStatusColor(log.status)} shadow-[0_0_8px_currentcolor] animate-pulse`}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snapshot Details Modal */}
      {activeLog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
            onClick={() => setActiveLog(null)}
          ></div>
          <div className="relative bg-[#0a0a0a] rounded-[32px] w-full max-w-2xl border border-white/10 shadow-[0_0_80px_rgba(139,92,246,0.15)] animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-6">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 ${getActionIcon(activeLog.action).color}`}
                >
                  {React.createElement(getActionIcon(activeLog.action).icon, {
                    size: 28,
                  })}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                    Procedural Snapshot
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                      Registry ID:
                    </span>
                    <span className="text-[10px] font-mono text-violet-400 font-bold bg-violet-400/5 px-2 py-0.5 rounded border border-violet-400/20">
                      {activeLog.id}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveLog(null)}
                className="p-3 rounded-2xl bg-white/5 text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
              <div className="space-y-8">
                {/* Operator & Temporal Info */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em]">
                      Operator Auth
                    </p>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-violet-500/30 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 text-xs font-black">
                        {activeLog.user.initial}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white">
                          {activeLog.user.name}
                        </span>
                        <span className="text-[10px] text-white/40 font-bold">
                          {activeLog.user.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em]">
                      Temporal Index
                    </p>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-cyan-500/30 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                        <Clock size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white">
                          {new Date(activeLog.date).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-white/40 font-bold">
                          {new Date(activeLog.date).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata JSON */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-3">
                      <Terminal size={16} className="text-violet-500" />
                      Forensic Metadata Snapshot
                    </p>
                    <button
                      onClick={() =>
                        handleCopyId(JSON.stringify(activeLog, null, 2))
                      }
                      className="text-[10px] font-black text-violet-400 hover:text-violet-300 uppercase tracking-widest flex items-center gap-2"
                    >
                      <Copy size={12} /> Copy Raw
                    </button>
                  </div>
                  <div className="p-6 rounded-[24px] bg-[#050505] border border-white/5 relative group">
                    <pre className="text-xs text-violet-300/80 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
                      {`{
  "action": "${activeLog.action}",
  "title": "${activeLog.title}",
  "type": "${activeLog.type}",
  "status": "${activeLog.status}",
  "eventId": "${activeLog.eventId}",
  "timestamp": "${new Date(activeLog.date).toISOString()}"
}`}
                    </pre>
                  </div>
                </div>

                {/* Status KPI */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2.5 rounded-xl ${activeLog.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
                      >
                        <ShieldAlert size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                          Procedural Risk
                        </span>
                        <span className="text-xs font-black text-white mt-0.5">
                          {getStatusText(activeLog.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                        <ExternalLink size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                          Target Context
                        </span>
                        <span className="text-xs font-black text-white mt-0.5 truncate max-w-[120px]">
                          Event Instance
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-white/5 bg-white/[0.02] flex items-center justify-between gap-4">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                AUDIT_SYSTEM_v1.0
              </span>
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveLog(null)}
                  className="px-8 py-3 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
                >
                  Close Snapshot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
