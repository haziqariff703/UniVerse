import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EventRoadmap = ({ events, readOnly = false }) => {
  const navigate = useNavigate();

  // Transform events for FullCalendar
  const calendarEvents = events.map((event) => {
    const isPast = new Date(event.date_time) < new Date();

    // Fix image URL mapping - ensure full path if it's a relative path from the server
    const imageUrl = event.image
      ? event.image.startsWith("http")
        ? event.image
        : `http://localhost:5000/${event.image}`
      : null;

    return {
      id: event._id,
      title: event.title,
      start: event.date_time,
      end:
        event.end_time ||
        new Date(new Date(event.date_time).getTime() + 2 * 60 * 60 * 1000), // Default 2h
      extendedProps: {
        location: event.venue_id?.name || event.location || "TBA",
        attendees: event.current_attendees || 0,
        capacity: event.capacity || 0,
        ticketPrice: event.ticket_price || 0,
        category: event.category || "General",
        meritPoints: event.merit_points || 0,
        status: isPast ? "Completed" : "Upcoming",
        image: imageUrl,
        host: event.community_id?.name || "Independent",
        canEdit: event.canEdit,
      },
      backgroundColor: isPast
        ? "rgba(16, 185, 129, 0.2)"
        : "rgba(139, 92, 246, 0.2)",
      borderColor: isPast ? "#10b981" : "#8b5cf6",
      textColor: "#fff",
    };
  });

  const renderEventContent = (eventInfo) => {
    const props = eventInfo.event.extendedProps;

    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <div
              className={`w-full h-full p-1 ${props.canEdit ? "cursor-pointer" : "cursor-default"} overflow-hidden text-xs font-semibold truncate flex items-center gap-1`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  props.status === "Completed"
                    ? "bg-emerald-400"
                    : "bg-violet-400"
                }`}
              />
              <span className="truncate flex-1">{eventInfo.event.title}</span>
              {!props.canEdit && (
                <div className="shrink-0 text-white/40">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="w-2.5 h-2.5"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent
            className="bg-[#050505] border border-white/10 p-0 rounded-xl overflow-hidden shadow-2xl w-72"
            sideOffset={5}
          >
            <div className="relative h-28 bg-white/5">
              {props.image ? (
                <img
                  src={props.image}
                  alt="Event"
                  className="w-full h-full object-cover opacity-60"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/10">
                  <Calendar size={32} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

              <div className="absolute top-2 right-2">
                <span className="px-2 py-0.5 bg-violet-500/20 border border-violet-500/30 rounded-full text-[9px] font-bold text-violet-300 uppercase tracking-wider backdrop-blur-md">
                  {props.category}
                </span>
              </div>

              <div className="absolute bottom-2 left-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-violet-400 mb-0.5">
                  {props.status} • {props.host}
                </p>
                <h4 className="text-sm font-bold text-white line-clamp-1">
                  {eventInfo.event.title}
                </h4>
              </div>
            </div>

            <div className="p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <Clock size={12} className="text-violet-500" />
                  <span>
                    {eventInfo.event.start.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-400 justify-end">
                  <Users size={12} className="text-violet-500" />
                  <span>
                    {props.attendees} / {props.capacity} Guests
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <MapPin size={12} className="text-violet-500" />
                <span className="truncate">{props.location}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                  {props.meritPoints > 0 && `+${props.meritPoints} Merit`}
                </div>
                <div className="text-xs font-bold text-white bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                  {props.ticketPrice === 0 ? "FREE" : `RM ${props.ticketPrice}`}
                </div>
              </div>

              {!props.canEdit && (
                <div className="pt-2 flex items-center gap-2 text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                  <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                  Read-only Access
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const handleEventClick = (clickInfo) => {
    if (!readOnly && clickInfo.event.extendedProps.canEdit) {
      navigate(`/organizer/event/${clickInfo.event.id}/dashboard`);
    }
  };

  return (
    <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 shadow-xl fc-roadmap-theme">
      <style>{`
        .fc-roadmap-theme {
          --fc-border-color: rgba(255, 255, 255, 0.05);
          --fc-page-bg-color: #050505;
          --fc-neutral-bg-color: rgba(255, 255, 255, 0.02);
          --fc-list-event-hover-bg-color: rgba(255, 255, 255, 0.05);
          --fc-today-bg-color: rgba(139, 92, 246, 0.05) !important;
          --fc-button-bg-color: rgba(255, 255, 255, 0.05);
          --fc-button-border-color: rgba(255, 255, 255, 0.1);
          --fc-button-text-color: #fff;
          --fc-button-hover-bg-color: rgba(139, 92, 246, 0.2);
          --fc-button-hover-border-color: rgba(139, 92, 246, 0.4);
          --fc-button-active-bg-color: rgba(139, 92, 246, 0.4);
          --fc-button-active-border-color: rgba(139, 92, 246, 0.6);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
        }
        .fc .fc-col-header-cell-cushion {
          color: #9ca3af;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.65rem;
          letter-spacing: 0.05em;
          padding: 8px 0;
        }
        .fc .fc-daygrid-day-number {
          color: #e5e7eb;
          font-weight: 600;
          font-size: 0.75rem;
          padding: 4px;
        }
        .fc .fc-timegrid-slot-label-cushion {
            color: #6b7280;
            font-size: 0.75rem;
        }
        .fc-theme-standard td, .fc-theme-standard th {
            border-color: var(--fc-border-color);
        }
        .fc .fc-scrollgrid-section-header > th {
            background-color: #050505; 
        }
      `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,listWeek",
        }}
        events={calendarEvents}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        height="auto"
        aspectRatio={1.8}
        editable={false}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
      />
    </div>
  );
};

export default EventRoadmap;
