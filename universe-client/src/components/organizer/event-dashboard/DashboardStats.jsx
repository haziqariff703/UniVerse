import React from "react";
import { Calendar, Users, TrendingUp, MapPin } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";

const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
  <SpotlightCard className="p-5 rounded-2xl border border-white/5 bg-[#0A0A0A]/60 flex flex-col justify-between h-32 group hover:border-violet-500/30 transition-all">
    <div className="flex justify-between items-start">
      <div className="p-2 rounded-lg bg-white/5 text-white/60 group-hover:text-violet-400 group-hover:bg-violet-500/10 transition-colors">
        <Icon size={20} />
      </div>
      {trend && (
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full border ${trend > 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}
        >
          {trend > 0 ? "+" : ""}
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
  </SpotlightCard>
);

const DashboardStats = ({ events }) => {
  // Calculate mock stats based on events prop or static mocked data for now where real data is missing
  const totalEvents = events?.length || 0;
  const totalAttendees =
    events?.reduce((sum, ev) => sum + (ev.current_attendees || 0), 0) || 0;

  // Mock data for demonstration - in a real app these would come from an analytics endpoint
  const stats = [
    {
      title: "Total Events",
      value: totalEvents,
      icon: Calendar,
      trend: 12,
    },
    {
      title: "Total Attendees",
      value: totalAttendees.toLocaleString(),
      icon: Users,
      trend: 8,
    },
    {
      title: "Monthly Growth",
      value: "24%",
      icon: TrendingUp,
      trend: 5,
    },
    {
      title: "Active Venues",
      value: "3", // Placeholder
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
