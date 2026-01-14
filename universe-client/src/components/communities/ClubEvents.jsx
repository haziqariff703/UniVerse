import React from "react";
import { Calendar, MapPin, Clock } from "lucide-react";

// Simplified Event Card for the Club Details view
const ClubEventCard = ({ title, date, location, time, image, delay }) => (
  <div
    className="flex bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all cursor-pointer group animate-in fade-in slide-in-from-bottom-4 duration-500"
    style={{
      animationDelay: `${delay * 1000}ms`,
      opacity: 0,
      animationFillMode: "forwards",
    }}
  >
    <div className="w-1/3 min-w-[120px]">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="p-4 flex flex-col justify-center w-2/3">
      <span className="text-violet-400 text-xs font-semibold uppercase mb-1">
        {date}
      </span>
      <h3 className="text-white font-bold text-lg mb-2 group-hover:text-violet-300 transition-colors line-clamp-1">
        {title}
      </h3>
      <div className="flex items-center gap-4 text-gray-400 text-sm">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  </div>
);

const ClubEvents = ({ events }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Upcoming Events</h3>
        <button className="text-sm text-violet-400 hover:text-violet-300">
          View All
        </button>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {events.map((event, index) => (
            <ClubEventCard key={index} {...event} delay={index * 0.1} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border border-white/10 rounded-xl bg-white/5 border-dashed">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No upcoming events scheduled.</p>
        </div>
      )}
    </div>
  );
};

export default ClubEvents;
