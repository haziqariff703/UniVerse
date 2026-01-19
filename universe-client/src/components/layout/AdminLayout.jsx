import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Clock, Search, Bell, Filter, Plus } from "lucide-react";
import useMalaysiaTime from "@/hooks/useMalaysiaTime";

const AdminLayout = ({ ...props }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { formattedDate } = useMalaysiaTime();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    if (confirm("Logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // Helper to determine title based on path
  const getPageTitle = () => {
    if (props.title) return props.title;
    const path = location.pathname;
    if (path.includes("/admin/dashboard")) return "Overview";
    if (path.includes("/admin/venues")) return "Venues";
    if (path.includes("/admin/users")) return "Users";
    if (path.includes("/admin/events")) return "Event Approvals";
    if (path.includes("/admin/organizers")) return "Organizer Approvals";
    // Default fallback
    return "Admin";
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row font-sans text-slate-200">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        handleLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A]">
        {/* Global Admin Header */}
        <header className="h-20 border-b border-white/5 bg-[#0e0e12]/50 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white uppercase tracking-wider">
              {getPageTitle()}
            </h1>
            <div className="flex items-center text-sm text-gray-500 bg-white/5 rounded-lg px-3 py-1.5 border border-white/5">
              <Clock size={14} className="mr-2" />
              {formattedDate}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Search workspace..."
                className="bg-[#13131a] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-violet-500 transition-colors w-64"
              />
            </div>
            <button className="p-2 rounded-xl border border-white/10 bg-[#13131a] text-gray-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border border-[#13131a]"></span>
            </button>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-0.5">
              <div className="h-full w-full rounded-[10px] bg-black overflow-hidden relative">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                    user?.name || "Admin"
                  }`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar h-[calc(100vh-5rem)] p-8">
          {/* Dynamic Content via Router Outlet */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
