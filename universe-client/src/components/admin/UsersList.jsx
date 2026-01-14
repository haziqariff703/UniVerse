import React, { useState, useEffect } from "react";
import { Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const UsersList = ({ onBack }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        ...(roleFilter && { role: roleFilter }),
      });

      const response = await fetch(
        `http://localhost:5000/api/admin/users?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
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

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete user");

      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
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
        }
      );

      if (!response.ok) throw new Error("Failed to update role");

      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-rose-500 to-orange-500";
      case "staff":
        return "bg-gradient-to-r from-violet-500 to-fuchsia-500";
      default:
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-starlight/60 hover:text-starlight transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-starlight">
            Users Management
          </h2>
          <p className="text-sm text-starlight/40">
            Manage all registered users
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-grow relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-starlight/40"
          />
          <input
            type="text"
            placeholder="Search by name, email, or student ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl glass-panel bg-transparent text-starlight placeholder:text-starlight/30 border border-starlight/10 focus:border-violet-500/50 focus:outline-none transition-colors"
          />
        </form>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-3 rounded-xl glass-panel bg-transparent text-starlight border border-starlight/10 focus:border-violet-500/50 focus:outline-none transition-colors cursor-pointer"
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="staff">Staff</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-starlight/5">
        {loading ? (
          <div className="p-12 text-center text-starlight/40">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-starlight/40">
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-starlight/10">
                  <th className="text-left p-4 text-xs font-bold text-starlight/40 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left p-4 text-xs font-bold text-starlight/40 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="text-left p-4 text-xs font-bold text-starlight/40 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left p-4 text-xs font-bold text-starlight/40 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="text-right p-4 text-xs font-bold text-starlight/40 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-starlight/5 hover:bg-starlight/[0.02] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="font-semibold text-starlight">
                            {user.name}
                          </div>
                          <div className="text-xs text-starlight/40">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-starlight/60 font-mono text-sm">
                      {user.student_id}
                    </td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleUpdateRole(user._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-bold text-white cursor-pointer border-0 ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        <option value="student">Student</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4 text-starlight/40 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-starlight/10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-starlight/60 hover:text-starlight disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <span className="text-sm text-starlight/40">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-starlight/60 hover:text-starlight disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
