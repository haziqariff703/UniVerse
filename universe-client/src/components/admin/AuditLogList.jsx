import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Clock,
  User,
  Shield,
  AlertCircle,
  FileText,
  Calendar,
  MapPin,
  ShieldAlert,
  Database,
  Activity,
  Terminal,
  MousePointer2,
  ChevronRight,
  RefreshCw,
  X,
} from "lucide-react";

// eslint-disable-next-line no-unused-vars
const LogKpiCard = ({ label, value, icon: CardIcon, color, bg, border }) => (
  <div
    className={`glass-panel p-5 rounded-2xl border ${border} flex items-center justify-between relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-sm`}
  >
    <div
      className={`absolute -right-4 -bottom-4 opacity-[0.03] ${color} group-hover:scale-110 group-hover:opacity-10 transition-all duration-500`}
    >
      <CardIcon size={80} />
    </div>
    <div className="relative z-10">
      <p className="text-starlight/40 text-xs font-bold uppercase tracking-widest mb-1">
        {label}
      </p>
      <h3 className="text-2xl font-black text-starlight leading-none">
        {value}
      </h3>
    </div>
    <div
      className={`relative z-10 w-12 h-12 rounded-xl ${bg} flex items-center justify-center border border-white/5 shadow-inner`}
    >
      <CardIcon size={24} className={color} />
    </div>
  </div>
);

const AuditLogList = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLogs: 0,
    securityActions: 0,
    eventActions: 0,
    venueActions: 0,
  });
  const [filters, setFilters] = useState({
    action: "",
    admin: "",
    target_type: "",
    search: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLogs: 0,
  });
  const [selectedLog, setSelectedLog] = useState(null);

  // Memoize fetchLogs to fix useEffect dependency lint
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 15,
        ...filters,
      });

      const response = await fetch(
        `http://localhost:5000/api/admin/audit-logs?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch logs");

      const data = await response.json();
      setLogs(data.logs);
      setPagination(data.pagination);
      if (data.stats) setStats(data.stats);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const getActionColor = (action) => {
    if (action.includes("DELETE"))
      return "text-rose-400 bg-rose-400/10 border-rose-400/20";
    if (action.includes("REJECT"))
      return "text-orange-400 bg-orange-400/10 border-orange-400/20";
    if (action.includes("APPROVE"))
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (action.includes("CREATE"))
      return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    if (action.includes("UPDATE"))
      return "text-violet-400 bg-violet-400/10 border-violet-400/20";
    return "text-gray-400 bg-gray-400/10 border-white/5";
  };

  const getForensicRisk = (action) => {
    const critical = ["DELETE_VENUE", "DELETE_EVENT", "DELETE_USER"];
    const warning = ["REJECT_EVENT", "REJECT_ORGANIZER", "UPDATE_USER_ROLE"];

    if (critical.includes(action))
      return {
        label: "Critical",
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20",
      };
    if (warning.includes(action))
      return {
        label: "Warning",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
      };
    return {
      label: "Nominal",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    };
  };

  const getTargetIcon = (type) => {
    switch (type) {
      case "Event":
        return <Calendar size={14} />;
      case "User":
        return <User size={14} />;
      case "Venue":
        return <MapPin size={14} />;
      case "Registration":
        return <FileText size={14} />;
      default:
        return <Shield size={14} />;
    }
  };

  const getActionIcon = (action) => {
    if (action.includes("DELETE")) return <ShieldAlert size={14} />;
    if (action.includes("CREATE")) return <Activity size={14} />;
    if (action.includes("UPDATE")) return <Terminal size={14} />;
    return <Clock size={14} />;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-starlight/60">
            <Database size={18} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-starlight to-starlight/60">
              Forensics Center
            </h1>
            <p className="text-starlight/40 text-sm">
              Real-time administrative infrastructure audit trail
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm text-starlight/70 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <LogKpiCard
          label="Total Logistics"
          value={stats.totalLogs.toLocaleString()}
          icon={Database}
          color="text-violet-400"
          bg="bg-violet-400/10"
          border="border-violet-400/20"
        />
        <LogKpiCard
          label="Security Alerts"
          value={stats.securityActions.toLocaleString()}
          icon={ShieldAlert}
          color="text-rose-400"
          bg="bg-rose-400/10"
          border="border-rose-400/20"
        />
        <LogKpiCard
          label="Event Forensics"
          value={stats.eventActions.toLocaleString()}
          icon={Calendar}
          color="text-cyan-400"
          bg="bg-cyan-400/10"
          border="border-cyan-400/20"
        />
        <LogKpiCard
          label="Infrastructure"
          value={stats.venueActions.toLocaleString()}
          icon={MapPin}
          color="text-emerald-400"
          bg="bg-emerald-400/10"
          border="border-emerald-400/20"
        />
      </div>

      {/* Filters & Control Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-starlight/20"
          />
          <input
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            type="text"
            placeholder="Search Registry IDs or Entities..."
            className="w-full bg-[#050505]/40 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-starlight focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-starlight/10"
          />
        </div>

        <div className="flex gap-2">
          <select
            name="action"
            value={filters.action}
            onChange={handleFilterChange}
            className="bg-[#050505]/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-starlight/60 focus:outline-none focus:border-violet-500/50 appearance-none"
          >
            <option value="">All Procedures</option>
            <option value="APPROVE_EVENT">Approve Event</option>
            <option value="REJECT_EVENT">Reject Event</option>
            <option value="DELETE_EVENT">Delete Event</option>
            <option value="APPROVE_ORGANIZER">Approve Organizer</option>
            <option value="REJECT_ORGANIZER">Reject Organizer</option>
            <option value="CREATE_VENUE">Create Venue</option>
            <option value="UPDATE_VENUE">Update Venue</option>
            <option value="DELETE_VENUE">Delete Venue</option>
            <option value="DELETE_USER">Delete User</option>
            <option value="UPDATE_USER_ROLE">Update Role</option>
          </select>

          <select
            name="target_type"
            value={filters.target_type}
            onChange={handleFilterChange}
            className="bg-[#050505]/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-starlight/60 focus:outline-none focus:border-violet-500/50 appearance-none"
          >
            <option value="">All Entities</option>
            <option value="Event">Event</option>
            <option value="Venue">Venue</option>
            <option value="User">User</option>
            <option value="Registration">Registration</option>
          </select>
        </div>
      </div>

      {/* Main Registry Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-5 text-[10px] font-black text-starlight/20 uppercase tracking-[0.2em] pl-8">
                  Operator
                </th>
                <th className="p-5 text-[10px] font-black text-starlight/20 uppercase tracking-[0.2em]">
                  Procedure
                </th>
                <th className="p-5 text-[10px] font-black text-starlight/20 uppercase tracking-[0.2em]">
                  Entity
                </th>
                <th className="p-5 text-[10px] font-black text-starlight/20 uppercase tracking-[0.2em]">
                  Timestamp
                </th>
                <th className="p-5 text-[10px] font-black text-starlight/20 uppercase tracking-[0.2em] text-right pr-8">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                    <RefreshCw
                      size={32}
                      className="mx-auto text-violet-500 animate-spin mb-4 opacity-20"
                    />
                    <p className="text-starlight/40 font-bold uppercase tracking-widest text-xs">
                      Syncing Forensics...
                    </p>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <Terminal size={32} className="text-starlight/10" />
                    </div>
                    <p className="text-starlight/40 font-black uppercase tracking-widest">
                      No matching logs identified
                    </p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log._id}
                    className="hover:bg-white/[0.02] transition-all group"
                  >
                    <td className="p-5 pl-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-600/20 flex items-center justify-center text-violet-400 font-black">
                          {log.admin_id?.name?.charAt(0) || "A"}
                        </div>
                        <div>
                          <p className="text-starlight font-black text-sm">
                            {log.admin_id?.name || "System"}
                          </p>
                          <p className="text-starlight/40 text-[10px] font-bold uppercase tracking-wider">
                            {log.admin_id?.email || "AUTO_SYNC_DAEMON"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${getActionColor(log.action)}`}
                      >
                        {getActionIcon(log.action)}
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-starlight/80 text-sm font-bold">
                        {getTargetIcon(log.target_type)}
                        <span>{log.target_type}</span>
                      </div>
                      <p className="text-[10px] font-mono text-starlight/70 mt-1 uppercase tracking-wider">
                        ID: {log.target_id}
                      </p>
                    </td>
                    <td className="p-5">
                      <p className="text-starlight font-bold text-sm tracking-tight">
                        {new Date(log.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-starlight/40 text-[10px] font-bold uppercase">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="p-5 text-right pr-8">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-2.5 rounded-xl bg-white/5 text-starlight/20 hover:text-violet-400 hover:bg-violet-400/10 transition-all active:scale-90 border border-white/5"
                      >
                        <MousePointer2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Improved Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] font-black text-starlight/40 uppercase tracking-[0.2em]">
              Showing {logs.length} / {pagination.totalLogs} Logistics
            </p>
            <div className="flex gap-3">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage - 1,
                  }))
                }
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 border border-white/5 text-starlight/60 hover:text-starlight hover:bg-white/10 disabled:opacity-20 transition-all font-bold text-xs uppercase tracking-widest"
              >
                Prev
              </button>
              <div className="flex items-center px-4 text-starlight/40 font-bold text-xs uppercase tracking-widest">
                Page {pagination.currentPage} / {pagination.totalPages}
              </div>
              <button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage + 1,
                  }))
                }
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 border border-white/5 text-starlight/60 hover:text-starlight hover:bg-white/10 disabled:opacity-20 transition-all font-bold text-xs uppercase tracking-widest"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Snapshot Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div
            className="absolute inset-0 bg-[#050505]/95 backdrop-blur-xl animate-in fade-in duration-300"
            onClick={() => setSelectedLog(null)}
          ></div>
          <div className="relative glass-panel rounded-3xl w-full max-w-2xl max-h-[85vh] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getActionColor(selectedLog.action)}`}
                >
                  {getActionIcon(selectedLog.action)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-starlight tracking-tight uppercase">
                    Log Entry #Forensics
                  </h3>
                  <p className="text-[10px] font-bold text-starlight/40 uppercase tracking-widest">
                    Procedural Snapshot Viewer
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 rounded-xl bg-white/5 text-starlight/40 hover:text-rose-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-black text-starlight/20 uppercase tracking-[0.2em] mb-2">
                      Operator
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-600/10 border border-violet-600/20 flex items-center justify-center text-violet-400">
                        <User size={16} />
                      </div>
                      <span className="text-starlight font-bold">
                        {selectedLog.admin_id?.name}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-starlight/20 uppercase tracking-[0.2em] mb-2">
                      Timestamp
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-600/10 border border-cyan-600/20 flex items-center justify-center text-cyan-400">
                        <Clock size={16} />
                      </div>
                      <span className="text-starlight font-bold">
                        {new Date(selectedLog.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#050505]/60 border border-white/5">
                  <p className="text-[10px] font-black text-starlight/20 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Terminal size={14} className="text-violet-500" />
                    Forensics Metadata Snapshot
                  </p>
                  <pre className="text-xs text-violet-300 font-mono leading-relaxed overflow-x-auto p-4 rounded-xl bg-violet-900/10">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3">
                      <ShieldAlert
                        size={16}
                        className={getForensicRisk(selectedLog.action).color}
                      />
                      <span className="text-[10px] font-black text-starlight/20 uppercase tracking-[0.2em]">
                        Forensic Risk Profile
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getForensicRisk(selectedLog.action).bg} ${getForensicRisk(selectedLog.action).color} ${getForensicRisk(selectedLog.action).border}`}
                      >
                        {getForensicRisk(selectedLog.action).label}
                      </span>
                      <span className="text-[10px] font-mono text-starlight/40 uppercase">
                        Source: {selectedLog.ip_address || "Internal"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3">
                      <Database size={16} className="text-violet-400" />
                      <span className="text-[10px] font-black text-starlight/20 uppercase tracking-[0.2em]">
                        Audit Identity Stamp
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-starlight font-bold bg-violet-500/5 px-2 py-2 rounded-lg border border-violet-500/10 mt-1 block truncate">
                      {selectedLog._id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-8 py-3 rounded-2xl bg-starlight text-[#050505] font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
              >
                Close Forensics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogList;
