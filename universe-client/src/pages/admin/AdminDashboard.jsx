import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  TrendingUp,
  Bell,
  Search,
  CheckCircle,
  MapPin,
  Plus,
  Clock,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Command,
  X,
} from "lucide-react";
import UsersList from "@/components/admin/UsersList";
import EventApprovals from "@/components/admin/EventApprovals";
import OrganizerApprovals from "@/components/admin/OrganizerApprovals";
import VenueManager from "@/components/admin/VenueManager";
import DashboardTable, {
  StatusPill,
} from "@/components/admin/dashboard/DashboardTable";
import SidePeek from "@/components/admin/dashboard/SidePeek";
import useMalaysiaTime from "@/hooks/useMalaysiaTime";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Real-time Clock
  const { formattedDate, formattedTime, greeting } = useMalaysiaTime();

  // Check Admin Role & Fetch Data
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      if (!token || storedUser.role !== "admin") {
        navigate("/login");
        return;
      }
      setUser(storedUser);

      if (activeView === "Overview") {
        fetchDashboardStats();
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView, navigate]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Access denied. Admin privileges required.");
        }
        throw new Error("Failed to fetch dashboard stats");
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message);
      if (err.message.includes("Access denied")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // Enhanced Mock Data for Interactive Table
  const projectTasks = [
    {
      id: 1,
      name: "Nebula Music Festival",
      organizer: "Phoenix Winters",
      status: "In Progress",
      dueDate: "Oct 12, 2026",
      progress: 65,
      description:
        "A large scale electronic music festival featuring international artists.",
    },
    {
      id: 2,
      name: "Tech Summit: AI 2026",
      organizer: "Dr. Cohen",
      status: "Pending",
      dueDate: "Nov 05, 2026",
      progress: 0,
      description: "Annual gathering of AI researchers and industry leaders.",
    },
    {
      id: 3,
      name: "Artistic Souls Exhibition",
      organizer: "Lukas Juarez",
      status: "Completed",
      dueDate: "Sep 28, 2026",
      progress: 100,
      description: "Showcase of abstract art from emerging local talents.",
    },
    {
      id: 4,
      name: "Cosmic Run Marathon",
      organizer: "Sarah Connor",
      status: "In Progress",
      dueDate: "Dec 01, 2026",
      progress: 30,
      description: "Charity marathon event.",
    },
  ];

  const tableColumns = [
    {
      header: "Event / Project",
      accessor: "name",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-violet-400">
            <Calendar size={14} />
          </div>
          <span className="font-bold text-starlight text-sm">{item.name}</span>
        </div>
      ),
    },
    {
      header: "Organizer",
      accessor: "organizer",
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-starlight/10 flex items-center justify-center text-[10px] font-bold text-starlight/60">
            {item.organizer.charAt(0)}
          </div>
          <span className="text-sm text-starlight/70">{item.organizer}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (item) => (
        <StatusPill
          status={item.status}
          onClick={() => console.log("Edit status", item.id)}
        />
      ),
    },
    {
      header: "Timeline",
      accessor: "dueDate",
      render: (item) => (
        <span className="text-sm font-mono text-starlight/50">
          {item.dueDate}
        </span>
      ),
    },
  ];

  const renderOverview = () => {
    if (loading)
      return <div className="text-starlight/60 p-8">Loading dashboard...</div>;
    if (error) return <div className="text-rose-400 p-8">{error}</div>;

    return (
      <div className="flex flex-col gap-8 w-full mx-auto pb-20">
        {/* Command Central Header */}
        <div className="flex flex-col xl:flex-row gap-8 justify-between items-start xl:items-end">
          <div className="flex flex-col gap-2">
            <h2 className="text-violet-400 font-mono text-sm tracking-wider flex items-center gap-2">
              <Clock size={14} /> {formattedDate} — {formattedTime} (MYT)
            </h2>
            <h1 className="text-4xl md:text-5xl font-black text-starlight tracking-tight">
              {greeting}! {user?.name?.split(" ")[0] || "Admin"},
            </h1>
            <p className="text-starlight/40 max-w-lg">
              Here's what's happening across the UniVerse today. You have{" "}
              {projectTasks.filter((t) => t.status === "Pending").length}{" "}
              pending approvals.
            </p>
          </div>

          {/* Stats Bar (Pills) */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="glass-panel px-6 py-4 rounded-2xl border-starlight/10 flex flex-col gap-1 min-w-[140px]">
              <div className="flex items-center gap-2 text-starlight/40 text-xs font-bold uppercase tracking-wider">
                <CheckCircle size={12} className="text-emerald-400" /> Completed
              </div>
              <span className="text-2xl font-black text-starlight">
                {stats?.activeEvents || 24}
              </span>
            </div>
            <div className="glass-panel px-6 py-4 rounded-2xl border-starlight/10 flex flex-col gap-1 min-w-[140px]">
              <div className="flex items-center gap-2 text-starlight/40 text-xs font-bold uppercase tracking-wider">
                <TrendingUp size={12} className="text-blue-400" /> In Progress
              </div>
              <span className="text-2xl font-black text-starlight">
                {stats?.pendingEvents || 7}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Interactive Table */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-starlight">
                Management Board
              </h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-xl bg-starlight/5 hover:bg-starlight/10 text-starlight/60 hover:text-starlight transition-colors text-xs font-bold uppercase tracking-wider">
                  Filter
                </button>
                <button className="px-4 py-2 rounded-xl bg-starlight/5 hover:bg-starlight/10 text-starlight/60 hover:text-starlight transition-colors text-xs font-bold uppercase tracking-wider">
                  Sort
                </button>
              </div>
            </div>

            <DashboardTable
              data={projectTasks}
              columns={tableColumns}
              onRowClick={setSelectedItem}
            />
          </div>

          {/* Right Sidebar - Widgets */}
          <div className="flex flex-col gap-6">
            {/* Notes Widget */}
            <div className="glass-panel rounded-3xl p-6 border-starlight/5 flex-grow min-h-[300px]">
              <div className="flex items-center gap-3 mb-6">
                <FileText size={20} className="text-starlight/80" />
                <h3 className="font-bold text-starlight">Quick Notes</h3>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  {
                    text: "Review KL Convention Center Application",
                    done: false,
                  },
                  { text: "Update Privacy Policy for v2", done: false },
                  { text: "Sync with Finance team", done: true },
                ].map((note, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 items-start group cursor-pointer hover:bg-starlight/5 p-2 rounded-lg transition-colors -mx-2"
                  >
                    <div
                      className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        note.done
                          ? "bg-violet-500 border-violet-500"
                          : "border-starlight/20 group-hover:border-starlight/40"
                      }`}
                    >
                      {note.done && (
                        <CheckCircle size={12} className="text-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        note.done
                          ? "text-starlight/40 line-through"
                          : "text-starlight"
                      }`}
                    >
                      {note.text}
                    </span>
                  </div>
                ))}
                <button className="mt-2 text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1">
                  <Plus size={12} /> Add new note
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Peek Drawer */}
        <SidePeek
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem?.name || "Event Details"}
          actions={
            <button className="px-3 py-1 rounded-lg bg-violet-600 text-white text-xs font-bold">
              Edit
            </button>
          }
        >
          {selectedItem && (
            <div className="flex flex-col gap-8">
              {/* Cover Image Placeholder */}
              <div className="w-full h-40 rounded-2xl bg-gradient-to-br from-violet-900/50 to-fuchsia-900/50 border border-white/10 flex items-center justify-center">
                <Calendar size={48} className="text-white/20" />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-starlight/40 uppercase tracking-wider">
                    Status
                  </span>
                  <StatusPill status={selectedItem.status} />
                </div>

                <div className="h-px bg-starlight/10 w-full" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold text-starlight/40 uppercase tracking-wider block mb-1">
                      Organizer
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-[10px] text-white">
                        {selectedItem.organizer.charAt(0)}
                      </div>
                      <span className="text-starlight font-medium">
                        {selectedItem.organizer}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-starlight/40 uppercase tracking-wider block mb-1">
                      Due Date
                    </span>
                    <span className="text-starlight font-medium">
                      {selectedItem.dueDate}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-starlight/10 w-full" />

                <div>
                  <span className="text-xs font-bold text-starlight/40 uppercase tracking-wider block mb-2">
                    Description
                  </span>
                  <p className="text-sm text-starlight/80 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold text-starlight/40 uppercase tracking-wider block mb-2">
                    Progress
                  </span>
                  <div className="w-full h-2 bg-starlight/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${selectedItem.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-starlight/40 mt-1 block text-right">
                    {selectedItem.progress}% Completed
                  </span>
                </div>
              </div>
            </div>
          )}
        </SidePeek>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case "Users List":
        return <UsersList onBack={() => setActiveView("Overview")} />;
      case "Event Approvals":
        return <EventApprovals onBack={() => setActiveView("Overview")} />;
      case "Organizer Approvals":
        return <OrganizerApprovals onBack={() => setActiveView("Overview")} />;
      case "Venues":
        return <VenueManager onBack={() => setActiveView("Overview")} />;
      case "Overview":
      default:
        return renderOverview();
    }
  };

  return (
    <div className="pt-24 pb-8 px-4 md:px-8 w-full mx-auto min-h-screen flex gap-8">
      {/* Sidebar - Mondays Style (Cleaner) */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0">
        <div className="fixed w-64 flex flex-col gap-8 h-[calc(100vh-8rem)]">
          {/* Dashboard Group */}
          <div>
            <h3 className="text-xs font-bold text-starlight/40 uppercase tracking-wider mb-4 px-4">
              Workspace
            </h3>
            <nav className="flex flex-col gap-1">
              {[
                { name: "Overview", icon: TrendingUp },
                { name: "Users List", icon: Users },
                { name: "Event Approvals", icon: CheckCircle },
                { name: "Organizer Approvals", icon: Users },
                { name: "Venues", icon: MapPin },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveView(item.name)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                    item.name === activeView
                      ? "bg-violet-500/10 text-violet-400 font-bold border border-violet-500/20"
                      : "text-starlight/60 hover:bg-starlight/5 hover:text-starlight"
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-sm">{item.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Projects Group */}
          <div>
            <div className="flex items-center justify-between px-4 mb-4">
              <h3 className="text-xs font-bold text-starlight/40 uppercase tracking-wider">
                Projects
              </h3>
              <Plus
                size={14}
                className="text-starlight/40 cursor-pointer hover:text-white"
              />
            </div>
            <div className="flex flex-col gap-2 px-4">
              <div className="flex items-center gap-2 text-starlight/60 text-sm py-1">
                <div className="w-2 h-2 rounded bg-fuchsia-400"></div>
                Event Planning
              </div>
              <div className="flex items-center gap-2 text-starlight/60 text-sm py-1">
                <div className="w-2 h-2 rounded bg-emerald-400"></div>
                Breakfast Plan
              </div>
            </div>
          </div>

          <div className="mt-auto px-4 flex flex-col gap-2">
            <button className="flex items-center gap-2 text-starlight/40 hover:text-starlight transition-colors text-sm font-medium">
              <HelpCircle size={16} /> Help & Support
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors text-sm font-medium"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col gap-8 w-full">
        {/* Top Bar for Dashboard */}
        {activeView === "Overview" && (
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-starlight/40"
                size={18}
              />
              <input
                type="text"
                placeholder="Search current workspace..."
                className="w-full bg-starlight/5 border border-starlight/10 rounded-xl pl-12 pr-4 py-3 text-sm text-starlight focus:outline-none focus:border-violet-500/50 transition-colors"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 border border-starlight/10 rounded px-1.5 py-0.5 pointer-events-none">
                <Command size={10} className="text-starlight/40" />
                <span className="text-[10px] text-starlight/40 font-mono">
                  K
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-violet-600/20 flex items-center gap-2">
                <Plus size={16} /> New Event
              </button>
              <div className="w-px h-8 bg-starlight/10 mx-2"></div>
              <button className="relative p-2 text-starlight/60 hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-0.5">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-sm font-bold text-white">
                  {user?.name?.charAt(0) || "A"}
                </div>
              </div>
            </div>
          </div>
        )}

        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
