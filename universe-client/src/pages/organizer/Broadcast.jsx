import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Filter,
  X,
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
  const [intensity, setIntensity] = useState("pulse"); // pulse, frequency, nova
  const [sending, setSending] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [targetAudience, setTargetAudience] = useState("attendees");
  const [activeCategory, setActiveCategory] = useState("club");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState("all");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMyEvents();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (isHistoryModalOpen) {
      setHistoryFilter("all");
    }
  }, [isHistoryModalOpen]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    try {
      setSending(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("event_id", targetEvent);
      formData.append("subject", subject);
      formData.append("message", message);
      const intensityMap = {
        pulse: { type: "info", priority: "low" },
        frequency: { type: "success", priority: "medium" },
        nova: { type: "alert", priority: "high" },
      };

      formData.append("type", intensityMap[intensity].type);
      formData.append("priority", intensityMap[intensity].priority);
      formData.append("target_audience", targetAudience);
      formData.append(
        "category",
        targetAudience === "students" ? activeCategory : "event",
      );
      formData.append("is_public", targetAudience === "students");

      if (imageFile) {
        formData.append("poster", imageFile);
      }

      const response = await fetch(
        "http://localhost:5000/api/notifications/organizer",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) throw new Error("Failed to send broadcast");

      const data = await response.json();

      toast.success("Broadcast Sent", {
        description: data.message,
      });

      setSubject("");
      setMessage("");
      setIntensity("pulse");
      setImageFile(null);
      setImagePreview(null);
      fetchHistory();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send broadcast");
    } finally {
      setSending(false);
    }
  };

  const recentHistory = history.slice(0, 5);
  const filteredHistory = history.filter((item) => {
    if (historyFilter === "all") return true;
    if (historyFilter === "general") return !item.event_id;
    return item.event_id === historyFilter;
  });

  const formatBroadcastDate = (value) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen pt-8 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto">
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

              <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">
                        Transmission Intensity
                      </label>
                      <p className="text-[10px] text-white/20 ml-1 mt-0.5">
                        Determines inbox impact & news hub escalation strength
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      {
                        id: "pulse",
                        label: "Pulse",
                        impact: "Subtle",
                        desc: "Standard Inbox + Quick Signal",
                        color: "text-blue-400",
                        bg: "bg-blue-500/10",
                        border: "border-blue-500/20",
                      },
                      {
                        id: "frequency",
                        label: "Frequency",
                        impact: "Featured",
                        desc: "Success Tone + Main Feed",
                        color: "text-emerald-400",
                        bg: "bg-emerald-500/10",
                        border: "border-emerald-500/20",
                      },
                      {
                        id: "nova",
                        label: "Nova",
                        impact: "Critical",
                        desc: "Alert Tone + Hero Slider",
                        color: "text-amber-400",
                        bg: "bg-amber-500/10",
                        border: "border-amber-500/20",
                      },
                    ].map((level) => (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setIntensity(level.id)}
                        className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                          intensity === level.id
                            ? `${level.bg} ${level.border} scale-[1.02] shadow-2xl shadow-black`
                            : "bg-white/5 border-transparent opacity-40 hover:opacity-100 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex flex-col gap-1 relative z-10">
                          <span
                            className={`text-[10px] font-clash font-bold uppercase tracking-widest ${level.color}`}
                          >
                            {level.label}
                          </span>
                          <span className="text-white text-xs font-bold">
                            {level.impact} Level
                          </span>
                          <p className="text-[10px] text-white/40 leading-tight mt-1">
                            {level.desc}
                          </p>
                        </div>
                        {intensity === level.id && (
                          <motion.div
                            layoutId="active-intensity"
                            className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Impact Matrix Table */}
                  <div className="bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
                    <table className="w-full text-[10px] text-left">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                          <th className="px-4 py-2 font-bold text-white/40 uppercase tracking-tighter">
                            Setting
                          </th>
                          <th className="px-4 py-2 font-bold text-white/40 uppercase tracking-tighter text-center">
                            In-App Notification
                          </th>
                          <th className="px-4 py-2 font-bold text-white/40 uppercase tracking-tighter text-center">
                            News Hub Visibility
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <tr>
                          <td className="px-4 py-2 text-white/60 font-medium">
                            Style (Inbox)
                          </td>
                          <td className="px-4 py-2 text-center italic text-white/30">
                            {intensity === "pulse"
                              ? "Blue (Info)"
                              : intensity === "frequency"
                                ? "Emerald (Success)"
                                : "Amber (Alert)"}
                          </td>
                          <td className="px-4 py-2 text-center text-white/20">
                            —
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-white/60 font-medium">
                            Priority (Hub)
                          </td>
                          <td className="px-4 py-2 text-center text-white/20">
                            —
                          </td>
                          <td className="px-4 py-2 text-center italic text-white/30 capitalize">
                            {intensity === "pulse"
                              ? "Low (Quick)"
                              : intensity === "frequency"
                                ? "Medium (Feed)"
                                : "High (Hero)"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">
                      Banner Poster (Optional)
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <div className="flex gap-4 items-start">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white/5 border-white/10 text-white h-12 hover:bg-white/10"
                      >
                        Choose File
                      </Button>
                      {imagePreview && (
                        <div className="relative w-24 h-12 rounded-lg overflow-hidden border border-white/20">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(null);
                            }}
                            className="absolute top-0 right-0 bg-black/60 p-0.5 rounded-bl-lg text-white/60 hover:text-white"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {targetAudience === "students" && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">
                        News Category
                      </label>
                      <Select
                        value={activeCategory}
                        onValueChange={setActiveCategory}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                          <SelectItem value="club">Club News</SelectItem>
                          <SelectItem value="official">
                            Official Announcement
                          </SelectItem>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">
                  Message Content
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className="bg-white/5 border-white/10 text-white min-h-[180px] focus-visible:ring-violet-400/50 leading-relaxed"
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
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-bold flex items-center gap-2">
                <Clock size={16} className="text-violet-400" />
                Recent Broadcasts
              </h4>
              {history.length > 0 && (
                <button
                  onClick={() => setIsHistoryModalOpen(true)}
                  className="text-[10px] font-bold uppercase tracking-widest text-violet-400 hover:text-violet-300 transition-colors bg-violet-400/5 px-3 py-1.5 rounded-lg border border-violet-400/10"
                >
                  View All
                </button>
              )}
            </div>
            <div className="space-y-4">
              {recentHistory.length > 0 ? (
                recentHistory.map((item) => (
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
                ))
              ) : (
                <div className="text-white/40 text-xs uppercase tracking-widest font-bold text-center py-10 border border-white/5 rounded-2xl bg-white/[0.02]">
                  No broadcasts yet
                </div>
              )}
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

      <AnimatePresence>
        {isHistoryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <motion.button
              aria-label="Close broadcast history"
              onClick={() => setIsHistoryModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="relative w-full max-w-4xl bg-[#050505] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-950/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-500/10 rounded-lg">
                    <Clock size={20} className="text-violet-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white leading-none mb-1">
                      Broadcast History
                    </h2>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">
                      Full transmission archive
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 bg-zinc-900/30 border-b border-white/5 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-wider">
                  <Filter size={14} />
                  <span>Filter by Event:</span>
                </div>
                <select
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value)}
                  className="bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-500/50 flex-1 min-w-[240px]"
                >
                  <option value="all">All Broadcasts</option>
                  <option value="general">General</option>
                  {events.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-white/10 transition-all"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">
                              {item.event || "General"}
                            </span>
                            <h4 className="text-white font-bold text-lg">
                              {item.subject}
                            </h4>
                            <p className="text-sm text-white/70 mt-2 whitespace-pre-wrap">
                              {item.message}
                            </p>
                          </div>
                          <div className="text-right text-[10px] font-bold uppercase tracking-widest text-white/30 min-w-[120px]">
                            {formatBroadcastDate(item.created_at) || item.date}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest">
                          <span className="px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/10">
                            Type: {item.type || "info"}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/10">
                            Priority: {item.priority || "low"}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/10">
                            Category: {item.category || "campus"}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/10">
                            Audience: {item.target_role || "all"}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/10">
                            Status: {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock size={28} className="text-white/20" />
                    </div>
                    <p className="text-white/40 font-medium">
                      No broadcasts found for this selection.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Broadcast;
