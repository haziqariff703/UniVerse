import React, { useState, useEffect } from "react";
import { Calendar, Users, TrendingUp, MapPin } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="p-5 rounded-2xl border border-white/5 bg-[#050505] shadow-xl flex flex-col justify-between h-32 group hover:border-violet-500/30 transition-all">
    <div className="flex justify-between items-start">
      <div className="p-2 rounded-lg bg-white/5 text-white/60 group-hover:text-violet-400 group-hover:bg-violet-500/10 transition-colors">
        <Icon size={20} />
      </div>
      {trend !== undefined && trend !== null && (
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full border ${parseFloat(trend) >= 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}
        >
          {parseFloat(trend) > 0 ? "+" : ""}
          {trend}%
        </span>
      )}
    </div>
    <div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
        {title}
      </p>
    </div>
  </div>
);

const DashboardStats = ({ events }) => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/events/organizer/finance-stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };
    fetchAnalytics();
  }, []);

  // Calculate stats based on events prop and analytics data
  const totalEvents = events?.length || 0;
  const totalAttendees =
    events?.reduce((sum, ev) => sum + (ev.current_attendees || 0), 0) || 0;

  // Get unique venues from events
  const uniqueVenues = new Set(
    events?.map((e) => e.venue_id?._id || e.venue_id).filter(Boolean),
  );
  const activeVenues = uniqueVenues.size;

  const stats = [
    {
      title: "Total Events",
      value: totalEvents,
      icon: Calendar,
      trend: analyticsData?.trends?.ticketsTrend || 0,
    },
    {
      title: "Total Attendees",
      value: totalAttendees.toLocaleString(),
      icon: Users,
      trend: analyticsData?.trends?.registrationTrend || 0,
    },
    {
      title: "Monthly Growth",
      value: `${analyticsData?.trends?.registrationTrend > 0 ? "+" : ""}${analyticsData?.trends?.registrationTrend || 0}%`,
      icon: TrendingUp,
      trend: analyticsData?.trends?.revenueTrend || 0,
    },
    {
      title: "Active Venues",
      value: activeVenues,
      icon: MapPin,
      trend: 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
