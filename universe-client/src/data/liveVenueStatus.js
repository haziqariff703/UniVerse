/**
 * Logic for simulating live venue status, overcrowding, and smart timers.
 */

export const getLiveVenueStatus = (venue) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Simulated Booking Array (Mocking dynamic schedule)
  // For production, this would come from the database
  const bookings = [
    { start: "08:00", end: "10:00" },
    { start: "11:00", end: "13:00" },
    { start: "14:00", end: "17:00" },
    { start: "20:00", end: "22:00" },
  ];

  const currentTimeStr = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

  // Find if currently booked
  const activeBooking = bookings.find(
    (b) => currentTimeStr >= b.start && currentTimeStr < b.end,
  );

  if (activeBooking) {
    return {
      isOccupied: true,
      status: "In Use",
      timerLabel: "Closing in:",
      timeRemaining: calculateTimeDiff(currentTimeStr, activeBooking.end),
      occupancy: 90 + Math.floor(Math.random() * 10), // High occupancy if booked
    };
  }

  // Find next booking
  const nextBooking = bookings.find((b) => b.start > currentTimeStr);

  if (nextBooking) {
    return {
      isOccupied: false,
      status: "Available",
      timerLabel: "Free in:",
      timeRemaining: calculateTimeDiff(currentTimeStr, nextBooking.start),
      occupancy: venue.liveOccupancy || 15,
    };
  }

  return {
    isOccupied: false,
    status: "Available",
    timerLabel: "Free All Night",
    timeRemaining: "",
    occupancy: 5,
  };
};

const calculateTimeDiff = (start, end) => {
  const [sH, sM] = start.split(":").map(Number);
  const [eH, eM] = end.split(":").map(Number);

  let diffMin = eH * 60 + eM - (sH * 60 + sM);
  if (diffMin < 0) diffMin += 24 * 60; // Handle overnight

  const hours = Math.floor(diffMin / 60);
  const minutes = diffMin % 60;

  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
};

export const VIBE_TAGS = [
  {
    id: "quiet",
    label: "🤫 QUIET STUDY",
    criteria: ["Academic", "Residential"],
  },
  { id: "ac", label: "❄️ COLD AC", criteria: ["AC"] },
  { id: "wifi", label: "📶 HIGH-SPEED WIFI", criteria: ["Wifi"] },
  { id: "social", label: "👥 SOCIAL HUB", criteria: ["Social", "Outdoor"] },
];
