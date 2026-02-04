/**
 * Logic for calculating live venue status, overcrowding, and smart timers based on real event data.
 */

export const getLiveVenueStatus = (venue, venueEvents = []) => {
  const now = new Date();
  
  // Filter for approved events that are happening today or relevant to the "live" status
  // venueEvents should already be pre-filtered for the specific venue and status 'approved'
  
  const currentTime = now.getTime();

  // Find if currently booked (active event)
  const activeEvent = venueEvents.find(event => {
    const startTime = new Date(event.date_time).getTime();
    const endTime = new Date(event.end_time || (startTime + (event.duration_minutes || 60) * 60000)).getTime();
    return currentTime >= startTime && currentTime < endTime;
  });

  if (activeEvent) {
    const endTime = new Date(activeEvent.end_time || (new Date(activeEvent.date_time).getTime() + (activeEvent.duration_minutes || 60) * 60000));
    return {
      isOccupied: true,
      status: "In Use",
      timerLabel: "Ends in:",
      timeRemaining: calculateTimeDiff(now, endTime),
      occupancy: Math.min(100, Math.round((activeEvent.current_attendees / activeEvent.capacity) * 100)) || 85,
      currentEvent: activeEvent.title
    };
  }

  // Find next booking today
  const todayEnd = new Date(now).setHours(23, 59, 59, 999);
  const nextEvent = venueEvents
    .filter(event => new Date(event.date_time).getTime() > currentTime && new Date(event.date_time).getTime() <= todayEnd)
    .sort((a, b) => new Date(a.date_time) - new Date(b.date_time))[0];

  if (nextEvent) {
    const startTime = new Date(nextEvent.date_time);
    return {
      isOccupied: false,
      status: "Available",
      timerLabel: "Next Event in:",
      timeRemaining: calculateTimeDiff(now, startTime),
      occupancy: venue.liveOccupancy || 0,
    };
  }

  return {
    isOccupied: false,
    status: "Available",
    timerLabel: "Free All Night",
    timeRemaining: "",
    occupancy: venue.liveOccupancy || 0,
  };
};

const calculateTimeDiff = (start, end) => {
  const diffMs = end - start;
  const diffMin = Math.floor(diffMs / 60000);
  
  if (diffMin <= 0) return "0m";

  const hours = Math.floor(diffMin / 60);
  const minutes = diffMin % 60;

  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
};

export const VIBE_TAGS = [
  {
    id: "quiet",
    label: "QUIET STUDY",
    criteria: ["Academic", "Residential"],
  },
  { id: "ac", label: "COLD AC", criteria: ["AC"] },
  { id: "wifi", label: "HIGH-SPEED WIFI", criteria: ["Wifi"] },
  { id: "social", label: "SOCIAL HUB", criteria: ["Social", "Outdoor"] },
];
