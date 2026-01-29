import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  History,
  Search,
  Filter,
  User,
  Calendar,
  Edit,
  Trash2,
  Plus,
  ShieldCheck,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ActivityLog = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const logs = [
    {
      id: 1,
      action: "Event Created",
      details: "New event 'Global AI Summit 2024' created by Haziq Ariff",
      user: "Haziq Ariff",
      user_initials: "HA",
      time: "10 mins ago",
      icon: Plus,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      id: 2,
      action: "Price Updated",
      details: "Ticket price for 'Networking Gala' changed from $25 to $35",
      user: "Sarah Jenkins",
      user_initials: "SJ",
      time: "2 hours ago",
      icon: Edit,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    {
      id: 3,
      action: "Staff Assigned",
      details:
        "Mike Ross assigned as 'Technical Lead' for 'Tech Innovation Summit'",
      user: "Haziq Ariff",
      user_initials: "HA",
      time: "5 hours ago",
      icon: User,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      id: 4,
      action: "Event Deleted",
      details: "Draft event 'Test Event 101' was deleted",
      user: "Admin",
      user_initials: "AD",
      time: "1 day ago",
      icon: Trash2,
      color: "text-red-400",
      bg: "bg-red-400/10",
    },
    {
      id: 5,
      action: "Venue Confirmed",
      details: "Booking for 'Dewan Budaya' confirmed for 'Cultural Night'",
      user: "Haziq Ariff",
      user_initials: "HA",
      time: "2 days ago",
      icon: ShieldCheck,
      color: "text-violet-400",
      bg: "bg-violet-400/10",
    },
  ];

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/organizer/dashboard"
            className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-neuemontreal font-bold text-white mb-1">
              Activity Log
            </h1>
            <p className="text-white/40 text-sm">
              Monitor all actions taken on your events
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
              size={16}
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter logs..."
              className="pl-10 bg-white/5 border-white/10 text-white h-9 focus-visible:ring-violet-400/50"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/5 border-white/10 text-white h-9"
          >
            <Download size={14} className="mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute left-[47px] top-8 bottom-8 w-[1px] bg-white/5 hidden md:block" />

        <div className="space-y-12">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="relative flex flex-col md:flex-row gap-6 md:items-start group"
              >
                {/* Icon Circle */}
                <div className="hidden md:flex flex-shrink-0 w-12 h-12 rounded-full bg-[#050505] border border-white/10 items-center justify-center relative z-10 group-hover:border-white/20 transition-colors">
                  <div className={cn("p-2 rounded-lg", log.bg)}>
                    <log.icon size={18} className={log.color} />
                  </div>
                </div>

                {/* Content Box */}
                <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-all hover:-translate-y-1 duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="md:hidden p-1.5 rounded-lg bg-white/5">
                        <log.icon size={14} className={log.color} />
                      </div>
                      <h3 className="font-bold text-white text-lg">
                        {log.action}
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 px-2 py-1 bg-white/5 rounded">
                      {log.time}
                    </span>
                  </div>

                  <p className="text-white/40 text-sm leading-relaxed mb-4">
                    {log.details}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-[10px] font-bold text-violet-400">
                        {log.user_initials}
                      </div>
                      <span className="text-xs text-white/60 font-medium">
                        {log.user}
                      </span>
                    </div>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-violet-400 hover:text-violet-300">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 mb-4">
                <History className="text-white/20" size={32} />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">
                No logs found
              </h3>
              <p className="text-white/40 text-sm max-w-xs">
                We couldn't find any activities matching your current filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
