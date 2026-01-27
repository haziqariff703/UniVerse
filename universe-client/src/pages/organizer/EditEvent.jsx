import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import SpotlightCard from "@/components/ui/SpotlightCard"; // Import Custom Component
import {
  ArrowLeft,
  Loader,
  Upload,
  CheckCircle2,
  Calendar,
  Clock,
  MoreHorizontal,
  FileText,
  ImageIcon,
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("edit"); // 'overview', 'edit'
  const [formData, setFormData] = useState({});

  // Fetch Event Data
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`);
        const data = await response.json();

        if (response.ok) {
          const formattedData = {
            ...data,
            date: data.date_time
              ? new Date(data.date_time).toISOString().split("T")[0]
              : "",
            time: data.date_time
              ? new Date(data.date_time).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            // Use _id if available, else usage raw
            venue: data.venue_id?._id || data.venue_id,
            ticketPrice: data.ticket_price, // Ensure camelCase mapping
          };
          setFormData(formattedData);
        } else {
          console.error("Failed to fetch event details");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleUpdateEvent = async () => {
    setSaving(true);
    console.log("Current Form Data:", formData);
    try {
      const token = localStorage.getItem("token");

      // Handle date/time carefully
      if (!formData.date || !formData.time) {
        throw new Error("Date and Time are required");
      }
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      if (isNaN(dateTime.getTime())) {
        throw new Error("Invalid date or time format");
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date_time: dateTime.toISOString(),
        venue_id: formData.venue || null,
        capacity: Number(formData.capacity) || 0,
        ticket_price: Number(formData.ticketPrice) || 0,
      };

      console.log("Sending Payload:", payload);

      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server Error Response:", errorData);
        throw new Error(errorData.message || "Failed to update event");
      }
      navigate(`/organizer/event/${id}/dashboard`);
    } catch (error) {
      console.error("Update error:", error);
      alert(error.message || "Failed to update event. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <Loader className="animate-spin text-violet-500" size={32} />
      </div>
    );
  }

  // Styles matching the reference image layout
  const labelStyle =
    "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2";
  const inputStyle =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all";

  return (
    <div className="min-h-screen bg-transparent text-white pt-20 px-6 max-w-[1600px] mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Link
            to={`/organizer/event/${id}/dashboard`}
            className="p-2 -ml-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-neuemontreal tracking-wide">
              Edit Event
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Update details, schedule, and assets.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors">
            <FileText size={16} className="text-gray-400" />
            Documentation
          </button>
          <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-8 border-b border-white/10 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-sm font-medium transition-all relative ${activeTab === "overview" ? "text-white" : "text-gray-500 hover:text-gray-300"}`}
        >
          Overview
          {activeTab === "overview" && (
            <motion.div
              layoutId="tab-line"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("edit")}
          className={`pb-3 text-sm font-medium transition-all relative ${activeTab === "edit" ? "text-white" : "text-gray-500 hover:text-gray-300"}`}
        >
          + Edit Event Details
          {activeTab === "edit" && (
            <motion.div
              layoutId="tab-line"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500"
            />
          )}
        </button>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search for event settings, tickets, or integrations..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400 focus:outline-none focus:border-violet-500/50 transition-colors"
        />
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Basic Info & Description */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Product Name section */}
          <SpotlightCard>
            <div className="mb-6">
              <label className={labelStyle}>
                Event Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                className={inputStyle}
                placeholder="e.g. Annual Tech Conference 2026"
              />
              <p className="text-xs text-gray-500 mt-2">
                Do not exceed 100 characters when entering the event name.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className={labelStyle}>Category</label>
                <select
                  name="category"
                  value={formData.category || ""}
                  onChange={handleInputChange}
                  className={inputStyle}
                >
                  <option value="">Select Category</option>
                  <option value="Music">Music</option>
                  <option value="Technology">Technology</option>
                  <option value="Sports">Sports</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Venue</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue || ""}
                  onChange={handleInputChange}
                  className={inputStyle}
                  placeholder="Event Location"
                />
              </div>
            </div>

            <div>
              <label className={labelStyle}>Description</label>
              <textarea
                name="description"
                rows={8}
                value={formData.description || ""}
                onChange={handleInputChange}
                className={`${inputStyle} resize-none`}
                placeholder="Describe your event..."
              />
            </div>
          </SpotlightCard>
        </div>

        {/* Right Column: Media, Dates, Extras */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Media Upload */}
          <SpotlightCard>
            <div className="flex items-center justify-between mb-4">
              <label className={labelStyle}>Event Image</label>
              <span className="text-xs text-gray-500">Info</span>
            </div>

            <div className="border border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer group relative">
              {formData.image ? (
                <div className="absolute inset-0 z-0">
                  <div className="w-full h-full bg-violet-900/20 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="text-emerald-500" />
                    <span className="ml-2 text-xs text-emerald-400">
                      Image Selected
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon className="text-gray-400" size={20} />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">
                    Drop your image here, or{" "}
                    <span className="text-violet-400 underline">browse</span>
                  </p>
                  <p className="text-[10px] text-gray-600 mt-2">
                    1200x600px recommended.
                  </p>
                </>
              )}
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
            </div>
          </SpotlightCard>

          {/* Date & Time */}
          <SpotlightCard>
            <div className="mb-4">
              <label className={labelStyle}>Date & Time</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar
                    className="absolute left-3 top-2.5 text-gray-500"
                    size={14}
                  />
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleInputChange}
                    className={`${inputStyle} pl-9`}
                  />
                </div>
                <div className="relative">
                  <Clock
                    className="absolute left-3 top-2.5 text-gray-500"
                    size={14}
                  />
                  <input
                    type="time"
                    name="time"
                    value={formData.time || ""}
                    onChange={handleInputChange}
                    className={`${inputStyle} pl-9`}
                  />
                </div>
              </div>
            </div>

            <div className="mb-0">
              <label className={labelStyle}>Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity || ""}
                onChange={handleInputChange}
                className={inputStyle}
                placeholder="Max Attendees"
              />
            </div>
          </SpotlightCard>

          {/* Ticket Price */}
          <SpotlightCard>
            <label className={labelStyle}>Ticket Price (RM)</label>
            <input
              type="number"
              name="ticketPrice"
              value={formData.ticketPrice || ""}
              onChange={handleInputChange}
              className={inputStyle}
              placeholder="0.00"
            />
          </SpotlightCard>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleUpdateEvent}
              disabled={saving}
              className="col-span-2 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              {saving ? "Saving..." : "Save Product"}
            </button>
            <button className="py-3 bg-[#0A0A0A] border border-white/10 text-white font-medium rounded-lg hover:bg-white/5 transition-colors">
              Schedule
            </button>
            <button
              onClick={() => navigate(-1)}
              className="py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 font-medium rounded-lg hover:bg-rose-500/20 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
