import React from "react";
import { MoreHorizontal } from "lucide-react";

const EventTimeline = () => {
  // Mock data for Run of Show
  const timelineItems = [
    { time: "08:00 AM", title: "Doors Open / Registration", attendees: [] },
    {
      time: "09:00 AM",
      title: "Opening Keynote",
      attendees: [
        "https://i.pravatar.cc/150?u=1",
        "https://i.pravatar.cc/150?u=2",
      ],
    },
    { time: "10:30 AM", title: "Workshop Session A", attendees: [] },
    {
      time: "12:00 PM",
      title: "Lunch Break",
      attendees: ["https://i.pravatar.cc/150?u=3"],
    },
    { time: "01:30 PM", title: "Panel Discussion", attendees: [] },
  ];

  return (
    <div className="bg-[#050505] border border-white/10 rounded-xl p-4 h-full shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sm uppercase tracking-wide text-gray-400">
          Schedule
        </h3>
        <button className="text-gray-500 hover:text-white transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-white/5">
        {timelineItems.map((item, index) => (
          <div key={index} className="relative pl-6 group">
            <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white/10 bg-[#0A0A0A] group-hover:border-violet-500 transition-colors z-10 box-content -ml-0.5"></div>
            <div>
              <p className="text-[10px] text-violet-400 font-bold mb-0.5">
                {item.time}
              </p>
              <h4 className="font-bold text-white text-sm mb-1 leading-tight">
                {item.title}
              </h4>

              {item.attendees.length > 0 && (
                <div className="flex -space-x-1.5 mt-1.5">
                  {item.attendees.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Attendee"
                      className="w-5 h-5 rounded-full border border-[#0A0A0A]"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-[10px] font-bold uppercase text-gray-600 hover:text-white border border-dashed border-white/10 hover:border-white/20 rounded bg-white/[0.02] hover:bg-white/[0.05] transition-all">
        + Add Schedule Item
      </button>
    </div>
  );
};

export default EventTimeline;
