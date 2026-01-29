import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DynamicSteppedForm from "@/components/forms/DynamicSteppedForm";
import { eventSchema } from "@/config/schemas/eventSchema";
import EventRoadmap from "@/components/organizer/EventRoadmap";
import { Calendar, Layout } from "lucide-react";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [venuesRes, speakersRes, eventsRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/venues", { headers }), // Assuming admin venues are accessible
          fetch("http://localhost:5000/api/admin/speakers", { headers }), // Or separate organizer endpoints
          fetch("http://localhost:5000/api/events", { headers }), // All events for calendar
        ]);

        if (venuesRes.ok) {
          const data = await venuesRes.json();
          setVenues(data.venues || []);
        }
        if (speakersRes.ok) {
          const data = await speakersRes.json();
          setSpeakers(data.speakers || []);
        }
        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setEvents(data.events || []);
        }
      } catch (error) {
        console.error("Error fetching creator data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateEvent = async (formData) => {
    const dateTime = new Date(`${formData.date}T${formData.time}`);

    const submitData = new FormData();

    // Append simple fields
    Object.keys(formData).forEach((key) => {
      if (key === "tags") {
        // Handle tags array or string
        const tags =
          typeof formData.tags === "string"
            ? formData.tags
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t)
            : [formData.category];
        tags.forEach((tag) => submitData.append("tags[]", tag));
      } else if (key === "speaker_ids") {
        // Handle speakers array
        if (Array.isArray(formData.speaker_ids)) {
          formData.speaker_ids.forEach((id) =>
            submitData.append("speaker_ids[]", id),
          );
        }
      } else if (key === "venue_id" && formData.venue_id === "other") {
        // Skip venue_id if other
      } else if (key === "location_manual" || key === "location") {
        if (formData.venue_id === "other") {
          submitData.append("location", formData.location_manual);
        }
      } else {
        submitData.append(key, formData[key]);
      }
    });

    // Explicitly add formatting for date/time if needed or rely on backend parsing
    submitData.set("date_time", dateTime.toISOString());
    submitData.set("capacity", parseInt(formData.capacity));

    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Content-Type NOT set, let browser set 'multipart/form-data' with boundary
      },
      body: submitData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to launch event");
    }

    navigate("/organizer/my-events");
  };

  // Inject dynamic options into schema
  const dynamicSchema = {
    ...eventSchema,
    steps: eventSchema.steps.map((step) => {
      if (step.name === "schedule") {
        return {
          ...step,
          fields: step.fields.map((field) => {
            if (field.name === "venue_id") {
              return {
                ...field,
                options: [
                  ...venues.map((v) => ({
                    label: `${v.name} (${v.location_code})`,
                    value: v._id,
                  })),
                  { label: "Other / Manual Entry", value: "other" },
                ],
              };
            }
            return field;
          }),
        };
      }
      if (step.name === "talent") {
        return {
          ...step,
          fields: step.fields.map((field) => {
            if (field.name === "speaker_ids") {
              return {
                ...field,
                options: speakers.map((s) => ({ label: s.name, value: s._id })),
              };
            }
            return field;
          }),
        };
      }
      return step;
    }),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form (7/12) */}
        <div className="lg:col-span-7">
          <DynamicSteppedForm
            schema={dynamicSchema}
            onSubmit={handleCreateEvent}
          />
        </div>

        {/* Right Column: Calendar Overview (5/12) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500/10 rounded-lg">
                  <Calendar className="text-violet-400" size={20} />
                </div>
                <div>
                  <h2 className="text-white font-bold">Schedule Overview</h2>
                  <p className="text-xs text-zinc-500">Live UniVerse Roadmap</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                Real-time
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-zinc-900 bg-black/40">
              <EventRoadmap events={events} />
            </div>

            <div className="mt-6 p-4 rounded-xl bg-violet-500/5 border border-violet-500/10">
              <div className="flex gap-3">
                <Layout className="text-violet-400 shrink-0" size={18} />
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Use this roadmap to avoid scheduling conflicts with other
                  major campus events. A balanced calendar leads to higher
                  attendance!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
