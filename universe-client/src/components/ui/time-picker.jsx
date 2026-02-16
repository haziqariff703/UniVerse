import * as React from "react";
import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TimePicker({ time, setTime, className }) {
  const [hours, setHours] = React.useState(time ? time.split(":")[0] : "12");
  const [minutes, setMinutes] = React.useState(
    time ? time.split(":")[1] : "00",
  );

  React.useEffect(() => {
    if (time) {
      const [h, m] = time.split(":");
      setHours(h);
      setMinutes(m);
    }
  }, [time]);

  const handleHoursChange = (h) => {
    setHours(h);
    setTime(`${h}:${minutes}`);
  };

  const handleMinutesChange = (m) => {
    setMinutes(m);
    setTime(`${hours}:${m}`);
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );
  const minuteOptions = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select value={hours} onValueChange={handleHoursChange}>
        <SelectTrigger className="w-[70px] bg-[#050505] border-white/10 text-white">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent className="bg-[#0A0A0A] border-white/10 text-white">
          {hourOptions.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-white font-bold">:</span>
      <Select value={minutes} onValueChange={handleMinutesChange}>
        <SelectTrigger className="w-[70px] bg-[#050505] border-white/10 text-white">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent className="bg-[#0A0A0A] border-white/10 text-white">
          {minuteOptions.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Clock className="ml-2 h-4 w-4 text-violet-500" />
    </div>
  );
}
