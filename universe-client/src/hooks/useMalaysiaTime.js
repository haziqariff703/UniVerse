import { useState, useEffect } from "react";

const useMalaysiaTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      // Create a date object for the current time
      const now = new Date();
      
      // Get UTC time in ms
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      
      // Malaysia is GMT +8
      const malaysiaOffset = 8 * 60 * 60 * 1000;
      const malaysiaTime = new Date(utcTime + malaysiaOffset);
      
      setTime(malaysiaTime);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-MY", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(date);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat("en-MY", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kuala_Lumpur"
    }).format(date);
  };

  const getGreeting = (date) => {
    const hours = date.getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return {
    time,
    formattedDate: formatDate(time),
    formattedTime: formatTime(time),
    greeting: getGreeting(time),
  };
};

export default useMalaysiaTime;
