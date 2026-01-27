import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  BarChart2,
  Edit,
  DollarSign,
  Ticket,
} from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";

const EventCardCompact = ({ event }) => {
  const date = new Date(event.date_time);
  const isPast = date < new Date();

  // Calculate fill percentage
  const fillPercentage =
    event.capacity > 0
      ? Math.round(((event.current_attendees || 0) / event.capacity) * 100)
      : 0;

  return (
    <SpotlightCard className="rounded-2xl border border-white/5 bg-[#0A0A0A]/80 hover:bg-[#0A0A0A] transition-all group overflow-hidden flex flex-col h-full">
      {/* Top: Media & Status */}
      <div className="relative h-40 w-full bg-white/5 border-b border-white/5 shrink-0 overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10 bg-gradient-to-br from-white/5 to-transparent">
            <Calendar size={48} />
          </div>
        )}

        {/* Date Badge - Floating Top Left */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex flex-col items-center px-2.5 py-1">
          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">
            {date.toLocaleString("default", { month: "short" })}
          </span>
          <span className="text-xl font-bold text-white leading-none">
            {date.getDate()}
          </span>
        </div>

        {/* Status Badge - Top Right */}
        <div className="absolute top-3 right-3">
          {isPast ? (
            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-gray-400 border border-white/10">
              Completed
            </span>
          ) : (
            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-violet-600/90 text-white shadow-lg shadow-violet-600/20 backdrop-blur-md">
              Upcoming
            </span>
          )}
        </div>
      </div>

      {/* Middle: Info Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3
              className="text-lg font-bold text-white group-hover:text-violet-200 transition-colors line-clamp-1"
              title={event.title}
            >
              {event.title}
            </h3>
          </div>

          <div className="flex flex-wrap gap-y-2 text-xs text-gray-400 mb-4">
            <div className="flex items-center gap-1.5 mr-4">
              <Clock size={12} className="text-violet-500" />
              <span>
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={12} className="text-violet-500" />
              <span className="truncate max-w-[120px]">
                {event.venue_id?.name || event.location || "TBA"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/organizer/event/${event._id}/dashboard`}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-black text-xs font-bold py-2 rounded-lg hover:bg-violet-50 transition-all shadow-lg shadow-white/5"
          >
            <BarChart2 size={14} /> Dashboard
          </Link>
          <Link
            to={`/organizer/event/${event._id}/edit`}
            className="px-3 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-all"
          >
            <Edit size={14} />
          </Link>
        </div>
      </div>

      {/* Bottom: HUD Stats Grid */}
      <div className="bg-[#050505] border-t border-white/5 p-4 grid grid-cols-3 gap-2">
        {/* Registered */}
        <div className="text-center border-r border-white/5 last:border-0 px-2">
          <div className="flex items-center justify-center gap-1 text-gray-500 text-[10px] uppercase font-bold mb-1">
            <Users size={10} /> Reg
          </div>
          <p className="text-sm font-bold text-white">
            {event.current_attendees || 0}
          </p>
        </div>

        {/* Capacity */}
        <div className="text-center border-r border-white/5 last:border-0 px-2">
          <div className="flex items-center justify-center gap-1 text-gray-500 text-[10px] uppercase font-bold mb-1">
            <Ticket size={10} /> Cap
          </div>
          <div className="flex items-center justify-center gap-1">
            <p className="text-sm font-bold text-white">{fillPercentage}%</p>
          </div>
        </div>

        {/* Revenue */}
        <div className="text-center px-2">
          <div className="flex items-center justify-center gap-1 text-gray-500 text-[10px] uppercase font-bold mb-1">
            <DollarSign size={10} /> Rev
          </div>
          <p className="text-sm font-bold text-white">
            {/* Simple mock revenue calculation */}
            {(event.current_attendees || 0) * (event.ticketPrice || 0) > 1000
              ? `${(((event.current_attendees || 0) * (event.ticketPrice || 0)) / 1000).toFixed(1)}k`
              : (event.current_attendees || 0) * (event.ticketPrice || 0)}
          </p>
        </div>
      </div>
    </SpotlightCard>
  );
};

export default EventCardCompact;
