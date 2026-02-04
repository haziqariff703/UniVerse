import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Users,
  MessageSquare,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Eye,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Broadcast = () => {
  const [targetEvent, setTargetEvent] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [targetAudience, setTargetAudience] = useState("attendees");

  React.useEffect(() => {
    fetchMyEvents();
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/notifications/organizer",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch history");
      const data = await response.json();
      setHistory(data.broadcasts || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/events/my-events",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    try {
      setSending(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/notifications/organizer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            event_id: targetEvent,
            subject,
            message,
            target_audience: targetAudience,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to send broadcast");

      const data = await response.json();

      toast.success("Broadcast Sent", {
        description: data.message,
      });

      setSubject("");
      setMessage("");
      fetchHistory();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send broadcast");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-clash font-bold text-white mb-1">
              Attendee Broadcast
            </h1>
            <p className="text-white/40 text-sm">
              Communicate with your attendees, workforce, or the student body
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Composer */}
        <div className="lg:col-span-2">
          <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare size={18} className="text-violet-400" />
              New Broadcast
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">
                    Select Event
                  </label>
                  <Select value={targetEvent} onValueChange={setTargetEvent}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                      <SelectValue placeholder="Choose an event" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                      {loading ? (
                        <SelectItem value="loading" disabled>
                          Loading events...
                        </SelectItem>
                      ) : events.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No events found (Create an event first)
                        </SelectItem>
                      ) : (
                        events.map((event) => (
                          <SelectItem key={event._id} value={event._id}>
                            {event.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {events.length === 0 && !loading && (
                    <p className="text-[10px] text-amber-400 mt-1">
                      You need to be an organizer or owner of at least one event
                      to broadcast.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">
                    Target Audience
                  </label>
                  <Select
                    value={targetAudience}
                    onValueChange={setTargetAudience}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                      <SelectValue placeholder="Select Audience" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                      <SelectItem value="attendees">Event Attendees</SelectItem>
                      <SelectItem value="workforce">
                        Event Workforce (Crew)
                      </SelectItem>
                      <SelectItem value="students">
                        All Students (General Announcement)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">
                  Channel
                </label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-violet-500/10 border-violet-500/50 text-violet-400 h-12 gap-2"
                  >
                    <Mail size={16} />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-white/5 border-white/10 text-white/40 h-12 gap-2 cursor-not-allowed"
                  >
                    <Bell size={16} />
                    In-app
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">
                  Subject Line
                </label>

                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Important Update regarding tomorrow's schedule"
                  className="bg-white/5 border-white/10 text-white h-12 focus-visible:ring-violet-400/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">
                  Message Content
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className="bg-white/5 border-white/10 text-white min-h-[200px] focus-visible:ring-violet-400/50 leading-relaxed"
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Targeting{" "}
                  {targetAudience === "students"
                    ? "all registered students"
                    : targetAudience === "workforce"
                      ? "event crew & AJK members"
                      : "verified event attendees"}
                </div>

                <Button
                  disabled={
                    (targetAudience !== "students" && !targetEvent) ||
                    !subject ||
                    !message ||
                    sending
                  }
                  onClick={handleSend}
                  className="w-full md:w-auto bg-violet-600 hover:bg-violet-700 text-white px-8 h-12 gap-2 transition-all active:scale-95"
                >
                  {sending ? "Sending..." : "Send Broadcast Now"}
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Info & History */}
        <div className="space-y-8">
          <div className="bg-[#050505] border border-white/10 rounded-3xl p-6">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <Clock size={16} className="text-violet-400" />
              Recent Broadcasts
            </h4>
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors group cursor-default"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={10} />
                      {item.status}
                    </span>
                    <span className="text-[10px] font-bold text-white/20">
                      {item.date}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-white mb-1 truncate">
                    {item.subject}
                  </h5>
                  <p className="text-[10px] text-white/40 font-medium mb-3">
                    {item.event}
                  </p>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-white/40">
                      Recipients: {item.sent_to}
                    </span>
                    <button className="text-violet-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Details
                      <ChevronRight size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#050505] border border-white/10 rounded-3xl p-6">
            <h4 className="text-violet-400 font-bold mb-2 flex items-center gap-2 text-sm">
              <AlertCircle size={14} />
              Best Practices
            </h4>
            <ul className="space-y-3">
              {[
                "Keep subjects short and clear",
                "Proofread before sending",
                "Include a call to action",
                "Avoid excessive messaging",
              ].map((tip, i) => (
                <li
                  key={i}
                  className="text-white/40 text-[11px] leading-relaxed flex items-center gap-2"
                >
                  <div className="w-1 h-1 rounded-full bg-violet-400" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Broadcast;
