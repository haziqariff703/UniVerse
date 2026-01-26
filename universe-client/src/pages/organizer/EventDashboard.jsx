import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Users,
  Clock,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  RotateCcw,
  Search,
  Download,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";

// Simple charts support if recharts is installed, otherwise placeholder
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

const EventDashboard = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch Event Details
        const eventRes = await fetch(`http://localhost:5000/api/events/${id}`);
        const eventData = await eventRes.json();

        // Fetch Registrations
        const regRes = await fetch(
          `http://localhost:5000/api/registrations/event/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const regData = await regRes.json();

        if (eventRes.ok && regRes.ok) {
          setEvent(eventData);
          setRegistrations(regData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [id]);

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.user_snapshot?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reg.user_snapshot?.student_id?.includes(searchTerm) ||
      reg.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Stats
  const totalRegistered = registrations.length;
  const checkedIn = registrations.filter(
    (r) => r.status === "CheckedIn",
  ).length;
  const cancelled = registrations.filter(
    (r) => r.status === "Cancelled",
  ).length;
  const pending = totalRegistered - checkedIn - cancelled;

  const chartData = [
    { name: "Checked In", value: checkedIn, color: "#10b981" }, // emerald-500
    { name: "Pending", value: pending, color: "#8b5cf6" }, // violet-500
    { name: "Cancelled", value: cancelled, color: "#f43f5e" }, // rose-500
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event)
    return <div className="pt-24 text-center text-white">Event not found</div>;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <Link
        to="/organizer/my-events"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Back to My Events
      </Link>

      {/* Heaader */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-neuemontreal font-bold text-white mb-2">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
            <span className="flex items-center gap-1">
              <Calendar size={16} />{" "}
              {new Date(event.date_time).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} />{" "}
              {new Date(event.date_time).toLocaleTimeString()}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={16} /> {event.venue_id?.name || event.location}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-2 transition-colors">
            <Download size={18} /> Export List
          </button>
          {/* <Link to={`/organizer/event/${id}/scan`} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-violet-600/20">
                  <Scan size={18} /> Scan QR
               </Link> */}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SpotlightCard className="p-6 rounded-2xl md:col-span-2 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-6 w-full">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
              <div>
                <p className="text-gray-400 text-sm uppercase">
                  Total Registrations
                </p>
                <p className="text-2xl font-bold text-white">
                  {totalRegistered}
                </p>
              </div>
              <div className="w-10 h-10 bg-violet-500/20 rounded-full flex items-center justify-center text-violet-400">
                <Users size={20} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0A0A0A] p-4 rounded-xl border border-white/5">
                <p className="text-emerald-400 text-sm uppercase mb-1">
                  Checked In
                </p>
                <p className="text-2xl font-bold text-white">{checkedIn}</p>
              </div>
              <div className="bg-[#0A0A0A] p-4 rounded-xl border border-white/5">
                <p className="text-rose-400 text-sm uppercase mb-1">
                  Cancelled
                </p>
                <p className="text-2xl font-bold text-white">{cancelled}</p>
              </div>
            </div>
          </div>
          <div className="w-48 h-48 relative flex-shrink-0">
            {/* Recharts Pie Chart */}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderRadius: "0.5rem",
                    border: "none",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xs text-gray-400">Capacity</p>
                <p className="text-lg font-bold text-white">
                  {Math.round((totalRegistered / event.capacity) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-6 rounded-2xl bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20">
          <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-left rounded-xl transition-colors flex items-center gap-3 text-sm text-gray-200">
              <CheckCircle size={18} className="text-emerald-400" /> Manual
              Check-in
            </button>
            <button className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-left rounded-xl transition-colors flex items-center gap-3 text-sm text-gray-200">
              <XCircle size={18} className="text-rose-400" /> Cancel
              Registration
            </button>
            <button className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-left rounded-xl transition-colors flex items-center gap-3 text-sm text-gray-200">
              <RotateCcw size={18} className="text-amber-400" /> Refund Ticket
            </button>
          </div>
        </SpotlightCard>
      </div>

      {/* Attendee List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Attendee List</h2>
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Search attendee..."
              className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-gray-400 text-sm">
                <th className="p-4 font-medium">Student ID</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Booking Time</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((reg) => (
                  <tr
                    key={reg._id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors text-sm text-gray-300"
                  >
                    <td className="p-4 font-mono text-white/50">
                      {reg.user_snapshot?.student_id || "N/A"}
                    </td>
                    <td className="p-4 font-medium text-white">
                      {reg.user_snapshot?.name || "Unknown"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                                          ${
                                            reg.status === "CheckedIn"
                                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                              : reg.status === "Cancelled"
                                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                : "bg-violet-500/10 text-violet-400 border-violet-500/20"
                                          }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {new Date(reg.booking_time).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No attendees found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
