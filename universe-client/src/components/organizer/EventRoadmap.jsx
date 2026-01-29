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

const EventRoadmap = ({ events }) => {
  const navigate = useNavigate();

  // Transform events for FullCalendar
  const calendarEvents = events.map((event) => {
    const isPast = new Date(event.date_time) < new Date();

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
        revenue: (event.current_attendees || 0) * (event.ticketPrice || 0),
        status: isPast ? "Completed" : "Upcoming",
        image: event.image,
      },
      backgroundColor: isPast
        ? "rgba(16, 185, 129, 0.2)"
        : "rgba(139, 92, 246, 0.2)",
      borderColor: isPast ? "#10b981" : "#8b5cf6",
      textColor: "#fff",
    };
  });

  const renderEventContent = (eventInfo) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <div className="w-full h-full p-1 cursor-pointer overflow-hidden text-xs font-semibold truncate flex items-center gap-1">
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  eventInfo.event.extendedProps.status === "Completed"
                    ? "bg-emerald-400"
                    : "bg-violet-400"
                }`}
              />
              <span className="truncate">{eventInfo.event.title}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent
            className="bg-[#050505] border border-white/10 p-0 rounded-xl overflow-hidden shadow-2xl w-64"
            sideOffset={5}
          >
            <div className="relative h-24 bg-white/5">
              {eventInfo.event.extendedProps.image ? (
                <img
                  src={eventInfo.event.extendedProps.image}
                  alt="Event"
                  className="w-full h-full object-cover opacity-60"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/10">
                  <Calendar size={32} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
              <div className="absolute bottom-2 left-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-violet-400 mb-0.5">
                  {eventInfo.event.extendedProps.status}
                </p>
                <h4 className="text-sm font-bold text-white line-clamp-1">
                  {eventInfo.event.title}
                </h4>
              </div>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock size={12} className="text-violet-500" />
                <span>
                  {eventInfo.event.start.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <MapPin size={12} className="text-violet-500" />
                <span className="truncate">
                  {eventInfo.event.extendedProps.location}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-300 font-medium">
                  <Users size={12} className="text-emerald-500" />
                  {eventInfo.event.extendedProps.attendees} Guests
                </div>
                <div className="text-xs font-bold text-white">
                  RM {eventInfo.event.extendedProps.revenue.toLocaleString()}
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const handleEventClick = (clickInfo) => {
    navigate(`/organizer/event/${clickInfo.event.id}/dashboard`);
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
