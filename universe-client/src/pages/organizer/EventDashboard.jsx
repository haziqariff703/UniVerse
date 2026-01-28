import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Users,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  ArrowLeft,
  Scan,
  Download,
  Share2,
  ArrowRight,
} from "lucide-react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import EventTimeline from "@/components/organizer/event-dashboard/EventTimeline";
import EventTodoList from "@/components/organizer/event-dashboard/EventTodoList";
import { InsightsPanel } from "@/components/organizer/event-dashboard";
import NumberTicker from "@/components/ui/NumberTicker";

const EventDashboard = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats for the "Pills"
  const totalRegistered = registrations.length;
  // Calculate mock revenue for demo: $50 per person if price undefined
  const ticketPrice = event?.ticketPrice || 50;
  const revenue = totalRegistered * ticketPrice;

  const daysLeft = event
    ? Math.ceil(
        (new Date(event.date_time) - new Date()) / (1000 * 60 * 60 * 24),
      )
    : 0;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch Event Details
        const eventRes = await fetch(`http://localhost:5000/api/events/${id}`);
        const eventData = await eventRes.json();
        if (eventRes.ok) setEvent(eventData);

        // Fetch Registrations
        const regRes = await fetch(
          `http://localhost:5000/api/registrations/event/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const regData = await regRes.json();
        if (regRes.ok) setRegistrations(Array.isArray(regData) ? regData : []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [id]);

  const recentRegistrations = registrations.slice(0, 10); // Only show top 10

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) return null; // Or error view

  return (
    <div className="min-h-screen pt-14 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
      {/* Top Bar / Breadcrumb */}
      <div className="flex justify-between items-center mb-8">
        <Link
          to="/organizer/my-events"
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to={`/organizer/event/${id}/scan`}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-violet-50 transition-colors"
          >
            <Scan size={16} /> Scan QR
          </Link>
          <button className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Compact Minimalist Header Section */}
      <div className="mb-8 overflow-hidden bg-[#050505] border border-white/10 rounded-2xl shadow-2xl">
        <div className="p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Identity & Key Info */}
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-violet-600/10 to-transparent border border-white/10 flex items-center justify-center text-xl font-neuemontreal font-bold text-white/90">
                O
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#050505] rounded-full"></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-0.5">
                <span className="text-emerald-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
                <span className="text-gray-800">•</span>
                <span className="flex items-center gap-1 font-neuemontreal">
                  <Calendar size={10} className="text-violet-500/70" />{" "}
                  Thursday, 20th Feb
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-none">
                {event.title}
              </h1>
              <div className="flex items-center gap-2.5 text-gray-400 text-xs py-0.5">
                <div className="flex items-center gap-1.5 opacity-80">
                  <MapPin size={12} className="text-fuchsia-500" />
                  <span className="font-medium whitespace-nowrap">
                    {event.venue_id?.name || event.location}
                  </span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/10"></div>
                <span className="opacity-60 font-medium whitespace-nowrap">
                  Dashboard Control
                </span>
              </div>
            </div>
          </div>

          {/* Right: Integrated Stats Row */}
          <div className="flex items-center gap-2 md:gap-4 w-full lg:w-auto overflow-x-auto scrollbar-hide">
            {[
              {
                label: "Countdown",
                value: daysLeft > 0 ? daysLeft : 0,
                unit: "Days",
                icon: Clock,
                color: "text-violet-400",
              },
              {
                label: "Registered",
                value: totalRegistered,
                unit: "Guests",
                icon: Users,
                color: "text-emerald-400",
              },
              {
                label: "Est. Revenue",
                value: revenue,
                unit: "MYR",
                icon: null,
                prefix: "RM",
                color: "text-indigo-400",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex-1 lg:flex-none bg-white/[0.05] border border-white/5 rounded-xl px-4 py-3 min-w-[120px] md:min-w-[140px] hover:bg-white/[0.08] transition-colors"
              >
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  {stat.icon && <stat.icon size={10} className={stat.color} />}
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-2xl font-bold text-white font-mono leading-none">
                    {stat.prefix && (
                      <span className="text-[10px] mr-1 opacity-40 font-sans">
                        {stat.prefix}
                      </span>
                    )}
                    <NumberTicker value={stat.value} />
                  </span>
                  <span className="text-[9px] font-bold text-gray-600 uppercase mb-0.5">
                    {stat.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="px-6 py-2.5 bg-white/[0.01] border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-gray-600 tracking-widest uppercase">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-500/80">
              <span className="w-1 h-1 rounded-full bg-emerald-500/50"></span>
              Secure Connection
            </span>
            <span className="hidden md:inline text-gray-800">|</span>
            <p className="text-[10px] text-gray-600 font-medium">
              Last sync: Just now
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:text-white transition-colors flex items-center gap-1.5">
              <Share2 size={10} /> Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col - Attendee Overview (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* List Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-white">
                Latest Registrations
              </h3>
            </div>
            <Link
              to={`/organizer/event/${id}/guests`}
              className="flex items-center gap-1 text-sm font-medium text-violet-400 hover:text-white transition-colors group"
            >
              View Full Guest List{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {/* Clean Table List Summary */}
          <div className="bg-[#050505] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-12 gap-2 p-3 text-[10px] font-bold text-gray-500 uppercase border-b border-white/5 tracking-wider">
              <div className="col-span-5">Name</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-3">Registered</div>
              <div className="col-span-1"></div>
            </div>

            <div className="divide-y divide-white/5">
              {recentRegistrations.length > 0 ? (
                recentRegistrations.map((reg) => (
                  <div
                    key={reg._id}
                    className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-white/5 transition-colors group"
                  >
                    <div className="col-span-5 flex items-center gap-3">
                      {/* Simple Avatar based on name */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                        {reg.user_snapshot?.name?.charAt(0) || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">
                          {reg.user_snapshot?.name || "Unknown Guest"}
                        </p>
                        <p className="text-[10px] text-gray-500 font-mono truncate">
                          {reg.user_snapshot?.student_id}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-3">
                      <span
                        className={`px-2 py-1 rounded-[4px] text-[10px] font-bold border uppercase tracking-wide ${
                          reg.status === "CheckedIn"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : reg.status === "Cancelled"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : "bg-violet-500/10 text-violet-400 border-violet-500/20"
                        }`}
                      >
                        {reg.status}
                      </span>
                    </div>

                    <div className="col-span-3 text-xs text-gray-400 font-medium">
                      {new Date(reg.booking_time).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <button className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-white transition-all">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No recent registrations.
                </div>
              )}
            </div>
            {/* Footer of card */}
            <div className="p-2 bg-white/[0.02] border-t border-white/5 text-center">
              <Link
                to={`/organizer/event/${id}/guests`}
                className="text-[10px] font-bold text-gray-500 hover:text-white uppercase transition-colors flex items-center justify-center gap-1"
              >
                View Full Guest List <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Col - Widgets (1/3 width) */}
        <div className="space-y-6">
          <InsightsPanel />
        </div>
      </div>

      {/* Bottom Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <EventTimeline />
        <EventTodoList />
      </div>
    </div>
  );
};

export default function EventDashboardWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <EventDashboard />
    </ErrorBoundary>
  );
}
