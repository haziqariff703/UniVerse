import React from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { Activity, Bell, Rocket } from "lucide-react";

// Mock data for the sparkline
const data = [
  { day: "Mon", value: 12 },
  { day: "Tue", value: 18 },
  { day: "Wed", value: 15 },
  { day: "Thu", value: 25 },
  { day: "Fri", value: 32 },
  { day: "Sat", value: 45 },
  { day: "Sun", value: 30 },
];

const mockActivity = [
  {
    id: 1,
    type: "register",
    text: "New registration for 'Cosmic Hackathon'",
    time: "2m ago",
    icon: Bell,
    color: "text-blue-400 bg-blue-500/10",
  },
  {
    id: 2,
    type: "sold_out",
    text: "Early bird tickets sold out!",
    time: "1h ago",
    icon: Rocket,
    color: "text-violet-400 bg-violet-500/10",
  },
  {
    id: 3,
    type: "update",
    text: "Venue updated for 'Tech Talk'",
    time: "3h ago",
    icon: Activity,
    color: "text-emerald-400 bg-emerald-500/10",
  },
];

const InsightsPanel = () => {
  return (
    <div className="space-y-6">
      {/* Sparkline Chart Card */}
      <div className="bg-[#0A0A0A]/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex justify-between items-end mb-4 relative z-10">
          <div>
            <h3 className="text-white font-bold text-lg">Insight</h3>
            <p className="text-gray-400 text-xs uppercase">
              Registration Trend
            </p>
          </div>
          <span className="text-emerald-400 font-bold text-xl">+12%</span>
        </div>

        <div className="h-32 w-full absolute bottom-0 left-0 right-0 opacity-50 z-0">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={0}
          >
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip cursor={false} content={<div className="hidden" />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-[#0A0A0A]/60 border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
          <Activity size={18} className="text-violet-400" /> Recent Activity
        </h3>

        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          {mockActivity.map((item) => (
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
          ))}
        </div>

        <button className="w-full mt-6 py-2 text-xs font-bold uppercase text-gray-500 hover:text-white border border-transparent hover:border-white/10 rounded-lg transition-all">
          View All History
        </button>
      </div>
    </div>
  );
};

export default InsightsPanel;
