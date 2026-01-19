import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  MapPin,
  Settings,
  LogOut,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Rocket,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import GradientText from "@/components/ui/GradientText";

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active
        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`}
  >
    <div className="flex items-center justify-center w-5 h-5">
      <Icon
        size={20}
        className={active ? "text-white" : "group-hover:text-white"}
      />
    </div>
    {!collapsed && (
      <span className="font-medium text-sm whitespace-nowrap">{label}</span>
    )}
    {active && !collapsed && (
      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
    )}
  </button>
);

const AdminSidebar = ({ collapsed, setCollapsed, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } hidden md:flex flex-col border-r border-white/5 bg-[#0e0e12] transition-all duration-300 relative z-20`}
    >
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Rocket className="text-violet-500 w-8 h-8 flex-shrink-0" />
          </motion.div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <GradientText
                colors={["#7c3aed", "#a78bfa", "#7c3aed"]}
                className="text-xl font-bold font-neuemontreal"
                showBorder={false}
              >
                UniVerse
              </GradientText>
            </motion.div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2 flex-grow overflow-y-auto custom-scrollbar">
        <SidebarItem
          icon={LayoutDashboard}
          label="Overview"
          active={
            currentPath === "/admin/dashboard" || currentPath === "/admin"
          }
          onClick={() => navigate("/admin/dashboard")}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={Users}
          label="Users"
          active={currentPath.includes("/admin/users")}
          onClick={() => navigate("/admin/users")}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={Calendar}
          label="Events"
          active={currentPath.includes("/admin/events")}
          onClick={() => navigate("/admin/events")}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={Users}
          label="Organizers"
          active={currentPath.includes("/admin/organizers")}
          onClick={() => navigate("/admin/organizers")}
          collapsed={collapsed}
        />

        <div
          className={`mt-6 mb-2 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider ${
            collapsed && "hidden"
          }`}
        >
          Management
        </div>
        <SidebarItem
          icon={MapPin}
          label="Venues"
          active={currentPath.includes("/admin/venues")}
          onClick={() => navigate("/admin/venues")}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={FileText}
          label="Audit Logs"
          active={currentPath.includes("/admin/audit-logs")}
          onClick={() => navigate("/admin/audit-logs")}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={HelpCircle}
          label="Content"
          active={false}
          onClick={() => {}}
          collapsed={collapsed}
        />
      </div>

      <div className="p-4 border-t border-white/5 space-y-2">
        <SidebarItem
          icon={Settings}
          label="Settings"
          active={false}
          onClick={() => {}}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={LogOut}
          label="Logout"
          active={false}
          onClick={handleLogout}
          collapsed={collapsed}
        />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 text-gray-500 hover:text-white transition-colors"
        >
          {collapsed ? (
            <ChevronRight size={20} />
          ) : (
            <div className="flex items-center gap-2 text-xs font-medium">
              <ChevronLeft size={14} /> Collapse Sidebar
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
