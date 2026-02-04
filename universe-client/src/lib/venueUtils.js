/**
 * Utility to calculate venue Open/Closed status based on Malaysia time.
 */

export const getVenueStatus = (accessHours) => {
  if (!accessHours || accessHours === "N/A") {
    return { isOpen: true, status: "OPEN" }; // Default to open if no hours specified
  }

  try {
    // Get current time in Malaysia
    const now = new Date();
    const myTime = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kuala_Lumpur",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(now);

    const currentHour = parseInt(myTime.find(p => p.type === 'hour').value);
    const currentMin = parseInt(myTime.find(p => p.type === 'minute').value);
    const currentTimeMinutes = currentHour * 60 + currentMin;

    // Parse access hours (e.g., "08:00 - 22:00")
    const [startPart, endPart] = accessHours.split("-").map(s => s.trim());
    
    // Helper to parse "HH:mm"
    const parseTime = (timeStr) => {
        const [h, m] = timeStr.split(":").map(Number);
        return h * 60 + m;
    };

    const startTimeMinutes = parseTime(startPart);
    const endTimeMinutes = parseTime(endPart);

    const isOpen = currentTimeMinutes >= startTimeMinutes && currentTimeMinutes < endTimeMinutes;

    return {
      isOpen,
      status: isOpen ? "OPEN" : "CLOSED",
      currentTime: `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`
    };
  } catch (error) {
    console.error("Error calculating venue status:", error);
    return { isOpen: true, status: "OPEN" };
  }
};
