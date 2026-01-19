import React, { useState, useEffect } from "react";
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
} from "lucide-react";

const AuditLogList = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: "",
    admin: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalLogs: 0,
  });

  useEffect(() => {
    fetchLogs();
  }, [pagination.currentPage, filters]);

  const fetchLogs = async () => {
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
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const getActionColor = (action) => {
    if (action.includes("DELETE")) return "text-rose-400 bg-rose-400/10";
    if (action.includes("REJECT")) return "text-orange-400 bg-orange-400/10";
    if (action.includes("APPROVE")) return "text-emerald-400 bg-emerald-400/10";
    if (action.includes("CREATE")) return "text-blue-400 bg-blue-400/10";
    if (action.includes("UPDATE")) return "text-violet-400 bg-violet-400/10";
    return "text-gray-400 bg-gray-400/10";
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

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Audit Logs</h2>
          <p className="text-gray-400 text-sm">
            System-wide administrative actions trail
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <select
              name="action"
              value={filters.action}
              onChange={handleFilterChange}
              className="w-full bg-[#13131a] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-violet-500 appearance-none"
            >
              <option value="">All Actions</option>
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
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#13131a] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-medium">Admin</th>
                <th className="p-4 font-medium">Action</th>
                <th className="p-4 font-medium">Target</th>
                <th className="p-4 font-medium">Details</th>
                <th className="p-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    Loading audit logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No logs found matching your criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log._id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold">
                          {log.admin_id?.name?.charAt(0) || "A"}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {log.admin_id?.name || "Unknown"}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {log.admin_id?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${getActionColor(log.action)}`}
                      >
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        {getTargetIcon(log.target_type)}
                        <span>{log.target_type}</span>
                      </div>
                      <p className="text-gray-500 text-xs font-mono mt-0.5">
                        {log.target_id}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-400 max-w-xs truncate">
                        {Object.entries(log.details || {}).map(
                          ([key, value]) => (
                            <span key={key} className="mr-2">
                              <span className="text-gray-600">{key}:</span>{" "}
                              {value}
                            </span>
                          ),
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 text-sm whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {logs.length} of {pagination.totalLogs} logs
            </p>
            <div className="flex gap-2">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage - 1,
                  }))
                }
                className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage + 1,
                  }))
                }
                className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogList;
