import { useState, useEffect } from "react";

const useMalaysiaTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
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
