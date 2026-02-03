import React, { useState, useEffect } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { Activity, Bell, Settings, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Helper function for relative time
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

// Get icon and color based on activity type
const getActivityStyle = (type, status) => {
  if (type === "audit") {
    return {
      icon: Settings,
      color: "text-amber-400 bg-amber-500/10",
    };
  }
  // Registration type
  if (status === "CheckedIn") {
    return {
      icon: CheckCircle,
      color: "text-emerald-400 bg-emerald-500/10",
    };
  }
  return {
    icon: Bell,
    color:
      status === "Confirmed"
        ? "text-blue-400 bg-blue-500/10"
        : "text-violet-400 bg-violet-500/10",
  };
};

const InsightsPanel = (props) => {
  const { eventId, user, canEdit } = props;
  const [insight, setInsight] = useState({
    label: "REGISTRATION TREND",
    value: "+0%",
    positive: true,
  });
  const [chartData, setChartData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsightsData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Use event-specific endpoint if eventId is provided
        const endpoint = eventId
          ? `http://localhost:5000/api/events/${eventId}/analytics`
          : "http://localhost:5000/api/events/organizer/finance-stats";

        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // Set insight data
        if (data.insight) {
          setInsight(data.insight);
        }

        // Set chart data - handle both response formats
        if (eventId && data.registrationTrends) {
          setChartData(data.registrationTrends);
        } else if (data.revenueData) {
          setChartData(
            data.revenueData.map((d) => ({
              day: d.name || "Day",
              value: d.registrations || 0,
            })),
          );
        }

        // Set recent activity
        if (data.recentActivity) {
          setRecentActivity(
            data.recentActivity.map((act, idx) => {
              const style = getActivityStyle(act.type, act.status);
              return {
                id: act.id || idx,
                type: act.type || "register",
                text: act.message,
                time: formatTimeAgo(act.time),
                icon: style.icon,
                color: style.color,
              };
            }),
          );
        }
      } catch (error) {
        console.error("Error fetching insights:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsightsData();
  }, [eventId]);

  // Build the "View All History" link
  const historyLink = eventId
    ? `/organizer/activity-log?eventId=${eventId}`
    : "/organizer/activity-log";

  return (
    <div className="space-y-6">
      {/* Sparkline Chart Card */}
      <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-xl min-h-[160px]">
        <div className="flex justify-between items-end mb-4 relative z-10">
          <div>
            <h3 className="text-white font-bold text-lg">Insight</h3>
            <p className="text-gray-400 text-xs uppercase">{insight.label}</p>
          </div>
          <span
            className={`font-bold text-xl ${insight.positive ? "text-emerald-400" : "text-rose-400"}`}
          >
            {insight.value}
          </span>
        </div>

        <div className="h-32 w-full absolute bottom-0 left-0 right-0 opacity-50 z-0 overflow-hidden">
          <ResponsiveContainer width="100%" height={128}>
            <AreaChart
              data={
                chartData.length > 0 ? chartData : [{ day: "Mon", value: 0 }]
              }
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
                content={<div className="hidden" />}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 shadow-xl">
        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
          <Activity size={18} className="text-violet-400" /> Recent Activity
        </h3>

        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : recentActivity.length > 0 ? (
            recentActivity.map((item) => (
              <div key={item.id} className="relative flex items-start gap-4">
                <div
                  className={`relative z-10 shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-white/5 ${item.color}`}
                >
                  <item.icon size={16} />
                </div>
                <div className="pt-1">
                  <p className="text-sm text-gray-300 font-medium leading-snug">
                    {item.text}
                  </p>
                  <span className="text-xs text-gray-500 block mt-1">
                    {item.time}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-xs py-4">
              No recent activity
            </p>
          )}
        </div>

        {user?.role === "admin" ||
        user?.role === "organizer" ||
        user?.is_organizer_approved ||
        canEdit ? (
          <Link
            to={historyLink}
            className="block w-full mt-6 py-2 text-xs font-bold uppercase text-gray-500 hover:text-white border border-transparent hover:border-white/10 rounded-lg transition-all text-center"
          >
            View All History
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default InsightsPanel;
