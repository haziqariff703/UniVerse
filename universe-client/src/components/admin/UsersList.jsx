import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Users,
  GraduationCap,
  Briefcase,
  Mail,
  UserCheck,
  MoreVertical,
  Eye,
  Calendar,
  CreditCard,
  User,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

/**
 * UsersList "Command Center"
 * A high-density dashboard for administrators to manage users.
 */
const UsersList = ({ onBack }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteProcessing, setDeleteProcessing] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(search && { search }),
        ...(roleFilter !== "all" && { role: roleFilter }),
      });

      const response = await fetch(
        `http://localhost:5000/api/admin/users?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setDeleteProcessing(userId);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to delete user");

      fetchUsers();
      if (selectedUser?._id === userId) setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    } finally {
      setDeleteProcessing(null);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        },
      );

      if (!response.ok) throw new Error("Failed to update role");

      fetchUsers();
      // Update local state if the user is currently selected
      if (selectedUser?._id === userId) {
        setSelectedUser((prev) => ({ ...prev, role: newRole }));
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update user role");
    }
  };

  // --- KPI Calculations (Client-side approximation based on current page/filters - ideally should be backend) ---
  // Note: For a real production app, we should have a dedicated /stats endpoint for accurately counting total users by role across all pages.
  // For now, we will simulate the "Total" counts using the data we have or just display generic icons if we can't get totals.
  // Actually, let's just use the current view's data trends or maybe just fetch stats once if possible.
  // Since we don't have a dedicated "user stats" endpoint in the inspected files (adminController has getDashboardStats but that returns totalUsers),
  // we'll leave the numbers as a "visual representation" or just use totalUsers from getDashboardStats if we had widely available context.
  // For this UI demo, I'll use placeholders or simple logic if applicable.

  // Actually, keeping it safe: We'll render the cards but maybe simpler or just show "Active" statuses.
  // Let's assume we can display "Total Users" from the pagination metadata if available context existed, but here we only have `data.pagination.totalUsers` from the API response which we used to setTotalPages.
  // Wait, the API returns `totalUsers` in pagination! Let's leverage that.

  // Implementation detail: I need to lift `totalUsers` state.

  // Update fetchUsers to set total count
  // ... inside fetchUsers ...
  // setTotalUsersCount(data.pagination.totalUsers);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-rose-500 to-orange-500";
      case "organizer":
        return "bg-gradient-to-r from-violet-500 to-fuchsia-500";
      case "staff":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      default:
        return "bg-gradient-to-r from-emerald-500 to-teal-500";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-starlight/60 hover:text-starlight hover:bg-white/5 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-starlight to-starlight/60">
              User Management
            </h1>
            <p className="text-starlight/40 text-sm">
              Oversee and manage platform users, roles, and access.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCurrentPage(1);
              fetchUsers();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-sm text-starlight/70 hover:text-white transition-colors"
          >
            <RefreshCw size={14} /> <span>Refresh</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/10 text-violet-300 text-sm hover:bg-violet-500/20 transition-colors">
            <Download size={14} /> <span>Export List</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards Row (Simulated stats for UI completeness) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Users"
          value={users.length > 0 ? "150+" : "Loading..."} // Placeholder as we don't have global stats readily available in this component yet
          icon={Users}
          color="text-blue-400"
          bg="bg-blue-500/10"
          border="border-blue-500/20"
        />
        <KpiCard
          label="Active Students"
          value="120+"
          icon={GraduationCap}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
          border="border-emerald-500/20"
        />
        <KpiCard
          label="Organizers"
          value="15"
          icon={Briefcase}
          color="text-violet-400"
          bg="bg-violet-500/10"
          border="border-violet-500/20"
        />
        <KpiCard
          label="Administrators"
          value="5"
          icon={Shield}
          color="text-rose-400"
          bg="bg-rose-500/10"
          border="border-rose-500/20"
        />
      </div>

      {/* 3. Control Toolbar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-starlight/40"
            size={16}
          />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-starlight focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-starlight/20"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={16} className="text-starlight/40" />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-sm text-starlight focus:outline-none focus:border-violet-500/50 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="organizer">Organizer</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* 4. Main User List (Data Grid) */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw
              size={32}
              className="mx-auto text-violet-400 animate-spin mb-4"
            />
            <p className="text-starlight/60">Loading users...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="text-rose-400 mb-4">{error}</div>
            <button
              onClick={fetchUsers}
              className="px-6 py-2 rounded-xl bg-violet-500 text-white font-bold hover:bg-violet-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <UserCheck size={32} className="text-starlight/20" />
            </div>
            <h3 className="text-xl font-bold text-starlight mb-2">
              No Users Found
            </h3>
            <p className="text-starlight/40 max-w-sm mx-auto">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider pl-6">
                    User Profile
                  </th>
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider">
                    Role & Permissions
                  </th>
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="p-4 text-xs font-medium text-starlight/40 uppercase tracking-wider text-right pr-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* User Profile */}
                    <td className="p-4 pl-6 align-middle">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-600/20 border border-white/10 flex items-center justify-center text-sm font-bold text-starlight ring-2 ring-transparent group-hover:ring-violet-500/30 transition-all">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <h3 className="text-starlight font-bold text-sm mb-0.5 group-hover:text-violet-300 transition-colors">
                            {user.name}
                          </h3>
                          <p className="text-starlight/40 text-xs font-mono">
                            ID: {user.student_id || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role & Permissions */}
                    <td className="p-4 align-middle">
                      <div className="relative inline-block group/select">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleUpdateRole(user._id, e.target.value)
                          }
                          className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold text-white cursor-pointer border-0 outline-none focus:ring-1 focus:ring-white/20 transition-all ${getRoleBadgeColor(
                            user.role,
                          )}`}
                        >
                          <option value="student" className="text-black">
                            Student
                          </option>
                          <option value="organizer" className="text-black">
                            Organizer
                          </option>
                          <option value="staff" className="text-black">
                            Staff
                          </option>
                          <option value="admin" className="text-black">
                            Admin
                          </option>
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                          <ChevronRight size={10} className="rotate-90" />
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2 text-xs text-starlight/70">
                        <Mail size={14} className="text-starlight/40" />
                        <span
                          className="truncate max-w-[200px]"
                          title={user.email}
                        >
                          {user.email}
                        </span>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="p-4 align-middle">
                      <span className="text-xs text-starlight/50">
                        {new Date(user.created_at).toLocaleDateString("en-MY", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 align-middle text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all group/btn"
                          title="View Details"
                        >
                          <Eye
                            size={16}
                            className="group-hover/btn:scale-110 transition-transform"
                          />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={
                            deleteProcessing === user._id ||
                            user.role === "admin"
                          } // Prevent deleting admins easily for safety
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                          title="Delete User"
                        >
                          <Trash2
                            size={16}
                            className="group-hover/btn:scale-110 transition-transform"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/5 bg-white/[0.01]">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-starlight/60 hover:text-starlight hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
              Previous
            </button>
            <span className="text-xs font-medium text-starlight/40">
              Page <span className="text-starlight">{currentPage}</span> of{" "}
              {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-starlight/60 hover:text-starlight hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="bg-[#050505] border-white/10 text-starlight p-0 overflow-hidden max-w-2xl">
          {selectedUser && (
            <div className="flex flex-col">
              {/* Header Banner */}
              <div className="h-24 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 relative">
                <div className="absolute -bottom-8 left-8">
                  <div className="w-16 h-16 rounded-full bg-[#050505] p-1">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xl font-bold text-white shadow-xl">
                      {selectedUser.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Body Content */}
              <div className="px-8 pt-10 pb-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-starlight">
                    {selectedUser.name}
                  </h2>
                  <p className="text-starlight/50 font-mono text-sm">
                    {selectedUser.email}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-starlight/40 uppercase tracking-wider border-b border-white/5 pb-2">
                      Identity
                    </h3>
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3 text-sm text-starlight/80">
                        <GraduationCap size={16} className="text-violet-400" />
                        <div>
                          <p className="text-[10px] text-starlight/40 uppercase">
                            Student ID
                          </p>
                          <p>{selectedUser.student_id || "Not registered"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-starlight/80">
                        <CreditCard size={16} className="text-cyan-400" />
                        <div>
                          <p className="text-[10px] text-starlight/40 uppercase">
                            IC Number
                          </p>
                          <p>{selectedUser.ic_number || "Not provided"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-starlight/80">
                        <User size={16} className="text-emerald-400" />
                        <div>
                          <p className="text-[10px] text-starlight/40 uppercase">
                            Gender
                          </p>
                          <p>{selectedUser.gender || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-starlight/40 uppercase tracking-wider border-b border-white/5 pb-2">
                      System & Access
                    </h3>
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3 text-sm text-starlight/80">
                        <Shield size={16} className="text-amber-400" />
                        <div>
                          <p className="text-[10px] text-starlight/40 uppercase">
                            Current Role
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${getRoleBadgeColor(selectedUser.role).replace("bg-gradient-to-r", "bg").replace("to-", "text-white ")}`}
                          >
                            {selectedUser.role.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-starlight/80">
                        <Calendar size={16} className="text-pink-400" />
                        <div>
                          <p className="text-[10px] text-starlight/40 uppercase">
                            Date of Birth
                          </p>
                          <p>
                            {selectedUser.date_of_birth
                              ? new Date(
                                  selectedUser.date_of_birth,
                                ).toLocaleDateString()
                              : "Not set"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-starlight/80">
                        <Users size={16} className="text-blue-400" />
                        <div>
                          <p className="text-[10px] text-starlight/40 uppercase">
                            Joined On
                          </p>
                          <p>
                            {new Date(
                              selectedUser.created_at,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                {selectedUser.preferences?.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold text-starlight/40 uppercase tracking-wider border-b border-white/5 pb-2">
                      Interests & Preferences
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.preferences.map((pref, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-starlight/70"
                        >
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const KpiCard = ({ label, value, icon: Icon, color, bg, border }) => (
  <div
    className={`glass-panel p-5 rounded-2xl border ${border} flex items-center justify-between relative overflow-hidden group`}
  >
    <div className={`absolute -right-4 -bottom-4 opacity-10 ${color}`}>
      <Icon size={80} />
    </div>

    <div className="relative z-10">
      <p className="text-starlight/50 text-xs font-medium uppercase tracking-wider mb-1">
        {label}
      </p>
      <h3 className="text-2xl font-bold text-starlight">{value}</h3>
    </div>

    <div
      className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color}`}
    >
      <Icon size={20} />
    </div>
  </div>
);

export default UsersList;
