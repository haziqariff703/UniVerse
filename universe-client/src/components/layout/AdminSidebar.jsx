import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Calendar,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Rocket,
  FileText,
  Mic2,
  MessageSquare,
  Bell,
  Tag,
} from "lucide-react";
import GradientText from "@/components/ui/GradientText";
import { cn } from "@/lib/utils";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => {
  if (!Icon) return null;
  return (
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
};

const SidebarGroup = ({
  icon: Icon,
  label,
  collapsed,
  active,
  subItems,
  currentPath,
  navigate,
}) => {
  const [isOpen, setIsOpen] = React.useState(active);

  // Auto-open if a child is active
  React.useEffect(() => {
    if (active) setIsOpen(true);
  }, [active]);

  if (!Icon) return null;

  if (collapsed) {
    return (
      <button
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          active
            ? "bg-violet-600 text-white"
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        }`}
        title={label}
      >
        <div className="flex items-center justify-center w-5 h-5">
          <Icon
            size={20}
            className={active ? "text-white" : "group-hover:text-white"}
          />
        </div>
      </button>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
      <CollapsibleTrigger asChild>
        <button
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
            active
              ? "text-white"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <div className="flex items-center justify-center w-5 h-5">
            <Icon
              size={20}
              className={active ? "text-violet-500" : "group-hover:text-white"}
            />
          </div>
          <span className="font-medium text-sm whitespace-nowrap flex-grow text-left">
            {label}
          </span>
          <ChevronRight
            size={14}
            className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
          />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-1 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
        <div className="pl-12 space-y-1">
          {subItems.map((item) => {
            const isSubActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  isSubActive
                    ? "text-violet-400 bg-violet-400/10 font-medium"
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${isSubActive ? "bg-violet-400" : "bg-gray-600"}`}
                />
                {item.label}
              </button>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const AdminSidebar = ({ collapsed, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside
      className={cn(
        "relative flex flex-col min-h-screen border-r border-white/5 bg-[#0e0e12] transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Rocket className="text-violet-500 w-8 h-8 flex-shrink-0" />
          {!collapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <GradientText
                colors={["#7c3aed", "#a78bfa", "#7c3aed"]}
                className="text-xl font-bold font-neuemontreal"
                showBorder={false}
              >
                UniVerse
              </GradientText>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2 flex-grow overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
          icon={Users}
          label="Communities"
          active={currentPath.includes("/admin/communities")}
          onClick={() => navigate("/admin/communities")}
          collapsed={collapsed}
        />

        {/* Events Dropdown */}
        <SidebarGroup
          icon={Calendar}
          label="Events"
          collapsed={collapsed}
          active={currentPath.includes("/admin/events")}
          subItems={[
            { label: "All Events", path: "/admin/events/list" },
            { label: "Approvals", path: "/admin/events/approvals" },
          ]}
          currentPath={currentPath}
          navigate={navigate}
        />

        {/* Organizers Dropdown */}
        <SidebarGroup
          icon={Users}
          label="Organizers"
          collapsed={collapsed}
          active={currentPath.includes("/admin/organizers")}
          subItems={[
            { label: "All Organizers", path: "/admin/organizers/list" },
            { label: "Approvals", path: "/admin/organizers/approvals" },
          ]}
          currentPath={currentPath}
          navigate={navigate}
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
        {/* Speakers Dropdown */}
        <SidebarGroup
          icon={Mic2}
          label="Speakers"
          collapsed={collapsed}
          active={currentPath.includes("/admin/speakers")}
          subItems={[
            { label: "Global Registry", path: "/admin/speakers" },
            { label: "Approvals", path: "/admin/speakers/approvals" },
          ]}
          currentPath={currentPath}
          navigate={navigate}
        />
        <SidebarItem
          icon={MessageSquare}
          label="Reviews"
          active={currentPath.includes("/admin/reviews")}
          onClick={() => navigate("/admin/reviews")}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={Bell}
          label="Notifications"
          active={currentPath.includes("/admin/notifications")}
          onClick={() => navigate("/admin/notifications")}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={Tag}
          label="Categories"
          active={currentPath.includes("/admin/categories")}
          onClick={() => navigate("/admin/categories")}
          collapsed={collapsed}
        />
        <SidebarItem
          icon={Settings}
          label="Settings"
          active={currentPath.includes("/admin/settings")}
          onClick={() => navigate("/admin/settings")}
          collapsed={collapsed}
        />
      </div>

      <div className="p-4 border-t border-white/5 space-y-2">
        <SidebarItem
          icon={LogOut}
          label="Logout"
          active={false}
          onClick={handleLogout}
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
};

export default AdminSidebar;
