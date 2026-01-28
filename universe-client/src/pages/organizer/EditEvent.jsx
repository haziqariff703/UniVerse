import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Loader,
  Upload,
  Calendar as CalendarIcon,
  Clock,
  MoreHorizontal,
  ImageIcon,
  Search,
  Bookmark,
  Type,
  LayoutGrid,
  MapPin,
  AlignLeft,
  Users,
  Tag,
  Info,
} from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";
import Magnet from "@/components/ui/Magnet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [formData, setFormData] = useState({});
  const [venues, setVenues] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("12:00");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [eventRes, venuesRes] = await Promise.all([
          fetch(`http://localhost:5000/api/events/${id}`),
          fetch(`http://localhost:5000/api/admin/venues`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const eventData = await eventRes.json();
        const venuesData = await venuesRes.json();

        if (eventRes.ok) {
          setFormData({
            ...eventData,
            venue: eventData.venue_id?._id || eventData.venue_id,
            ticketPrice: eventData.ticket_price,
          });
          if (eventData.date_time) {
            const dt = new Date(eventData.date_time);
            setSelectedDate(dt);
            setSelectedTime(
              dt.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            );
          }
        }
        if (venuesRes.ok) setVenues(venuesData.venues || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdateEvent = async () => {
    setSaving(true);
    try {
      if (!selectedDate || !selectedTime)
        throw new Error("Date and Time are required");

      const dateStr = selectedDate.toISOString().split("T")[0];
      const dateTime = new Date(`${dateStr}T${selectedTime}`);

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date_time: dateTime.toISOString(),
        venue_id: formData.venue || null,
        capacity: Number(formData.capacity) || 0,
        ticket_price: Number(formData.ticketPrice) || 0,
      };

      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update event");
      navigate(`/organizer/event/${id}/dashboard`);
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const glassStyle =
    "bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <Loader className="animate-spin text-violet-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white pt-24 px-8 max-w-[1500px] mx-auto pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 border-b border-white/5 pb-8">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full text-slate-400 hover:bg-white/5"
          >
            <Link to={`/organizer/event/${id}/dashboard`}>
              <ArrowLeft size={22} />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white uppercase">
              Edit Event
            </h1>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-500 uppercase mt-1">
              Configuration & Asset Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 text-[10px] font-bold uppercase tracking-widest h-12 px-8 rounded-2xl hover:bg-violet-600 hover:text-white transition-all shadow-lg"
          >
            <Bookmark size={14} className="mr-2" /> Documentation
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/5 border-white/10 h-12 w-12 rounded-2xl text-slate-400"
          >
            <MoreHorizontal size={20} />
          </Button>
        </div>
      </div>

      {/* Navigation & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 w-fit backdrop-blur-md">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-8 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
              activeTab === "overview"
                ? "bg-white/10 text-white shadow-xl"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-8 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${
              activeTab === "edit"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Config Details
          </button>
        </div>

        <div className="relative flex-1 max-w-lg">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600"
            size={18}
          />
          <Input
            placeholder="SEARCH ASSETS..."
            className="pl-14 h-14 bg-black/40 border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest placeholder:text-slate-700 focus:border-violet-500/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-8 space-y-10">
          <div className={glassStyle}>
            <div className="space-y-12">
              {/* Event Title */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-violet-500/10 rounded-xl">
                    <Type size={18} className="text-violet-500" />
                  </div>
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Event Title <span className="text-rose-500">*</span>
                  </Label>
                </div>
                <Input
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="h-20 text-2xl font-bold bg-black/40 border-white/10 rounded-2xl px-8 focus:border-violet-500/40 tracking-tight"
                  placeholder="ENTER EVENT TITLE..."
                />
                <div className="flex items-center gap-2 px-1">
                  <Info size={14} className="text-slate-600" />
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                    Title will be displayed in public registries.
                  </p>
                </div>
              </div>

              {/* Category & Venue Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <LayoutGrid size={14} className="text-violet-500" />{" "}
                    Category
                  </Label>
                  <Select
                    value={formData.category || ""}
                    onValueChange={(v) =>
                      setFormData((prev) => ({ ...prev, category: v }))
                    }
                  >
                    <SelectTrigger className="h-16 bg-black/40 border-white/10 rounded-2xl font-bold uppercase tracking-widest text-[10px]">
                      <SelectValue placeholder="SELECT CATEGORY" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-950 border-white/10 text-white font-bold uppercase tracking-widest text-[10px]">
                      <SelectItem value="Music">MUSIC</SelectItem>
                      <SelectItem value="Technology">TECHNOLOGY</SelectItem>
                      <SelectItem value="Sports">SPORTS</SelectItem>
                      <SelectItem value="Workshop">WORKSHOP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <MapPin size={14} className="text-violet-500" /> Venue
                  </Label>
                  <Select
                    value={formData.venue || ""}
                    onValueChange={(v) =>
                      setFormData((prev) => ({ ...prev, venue: v }))
                    }
                  >
                    <SelectTrigger className="h-16 bg-black/40 border-white/10 rounded-2xl font-bold uppercase tracking-widest text-[10px]">
                      <SelectValue placeholder="ASSIGN VENUE" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-950 border-white/10 text-white font-bold uppercase tracking-widest text-[10px]">
                      {venues.map((v) => (
                        <SelectItem key={v._id} value={v._id}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Capacity & Price Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Users size={14} className="text-violet-500" /> Max Capacity
                  </Label>
                  <Input
                    type="number"
                    value={formData.capacity || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        capacity: e.target.value,
                      }))
                    }
                    className="h-16 bg-black/40 border-white/10 rounded-2xl font-black text-xl px-6"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Tag size={14} className="text-violet-500" /> Ticket Price
                    (RM)
                  </Label>
                  <Input
                    type="number"
                    value={formData.ticketPrice || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ticketPrice: e.target.value,
                      }))
                    }
                    className="h-16 bg-black/40 border-white/10 rounded-2xl font-black text-xl px-6"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <AlignLeft size={16} className="text-violet-500" />{" "}
                  Description
                </Label>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="min-h-[200px] bg-black/40 border-white/10 rounded-2xl p-6 text-sm leading-relaxed placeholder:text-slate-700"
                  placeholder="DESCRIBE YOUR EVENT..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className={`${glassStyle} p-6`}>
            <div className="space-y-8">
              {/* Media Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <ImageIcon size={14} className="text-violet-500" /> Cover
                    Image
                  </Label>
                  <Badge className="bg-violet-600 text-white text-[8px] font-bold uppercase tracking-widest border-none px-2 shadow-lg shadow-violet-600/20">
                    REQUIRED
                  </Badge>
                </div>
                <div className="relative h-44 rounded-2xl border-2 border-dashed border-white/5 hover:border-violet-500/30 transition-all group bg-black/20">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <Upload
                      size={20}
                      className="text-slate-500 mb-2 group-hover:text-violet-500 transition-colors"
                    />
                    <p className="text-[10px] font-black text-slate-500 group-hover:text-slate-300">
                      UPLOAD IMAGE
                    </p>
                  </div>
                </div>
              </div>

              {/* Time Configuration */}
              <div className="space-y-6 pt-6 border-t border-white/5">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <CalendarIcon size={14} className="text-violet-500" /> Date &
                  Time
                </Label>
                <div className="space-y-3">
                  <DatePicker
                    date={selectedDate}
                    setDate={setSelectedDate}
                    className="h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] bg-black/40"
                  />
                  <TimePicker
                    time={selectedTime}
                    setTime={setSelectedTime}
                    className="h-14 bg-black/40 border-white/10"
                  />
                </div>
              </div>

              {/* Actions Section */}
              <div className="space-y-4 pt-6">
                <Magnet padding={20}>
                  <Button
                    onClick={handleUpdateEvent}
                    disabled={saving}
                    className="w-full h-16 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-slate-200 shadow-2xl transition-all"
                  >
                    {saving ? (
                      <Loader className="animate-spin" size={16} />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </Magnet>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => navigate(-1)}
                    variant="outline"
                    className="h-12 bg-white/5 border-white/5 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 bg-rose-500/5 border-rose-500/10 text-rose-500 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500/10"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-violet-500/5 rounded-[2rem] p-6 border border-violet-500/10">
            <div className="flex gap-4">
              <div className="p-3 bg-violet-500/20 rounded-2xl h-fit">
                <Info size={16} className="text-violet-400" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">
                  Update Protocol
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  Changes will be propagated to the event discovery engines
                  immediately upon commitment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
