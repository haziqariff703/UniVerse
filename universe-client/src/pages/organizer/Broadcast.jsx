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

  const history = [
    {
      id: 1,
      subject: "Welcome to Tech Summit!",
      event: "Tech Innovation Summit",
      sent_to: 124,
      date: "24 Jan, 2024",
      status: "delivered",
    },
    {
      id: 2,
      subject: "Venue Change Notification",
      event: "Startup Pitch Night",
      sent_to: 85,
      date: "20 Jan, 2024",
      status: "delivered",
    },
    {
      id: 3,
      subject: "Reminder: Event starts in 1 hour",
      event: "AI Workshop",
      sent_to: 42,
      date: "15 Jan, 2024",
      status: "delivered",
    },
  ];

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubject("");
      setMessage("");
      alert("Broadcast sent successfully!");
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/organizer/dashboard"
            className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-neuemontreal font-bold text-white mb-1">
              Attendee Broadcast
            </h1>
            <p className="text-white/40 text-sm">
              Send mass messages to your event attendees
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
                      <SelectItem value="tech-summit">
                        Tech Innovation Summit
                      </SelectItem>
                      <SelectItem value="ai-workshop">AI Workshop</SelectItem>
                      <SelectItem value="pitch-night">
                        Startup Pitch Night
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                  Targeting ~345 verified attendees
                </div>
                <Button
                  disabled={!targetEvent || !subject || !message || sending}
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

          <div className="bg-violet-600/[0.05] border border-violet-500/20 rounded-3xl p-6">
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
