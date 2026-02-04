import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DynamicSteppedForm from "@/components/forms/DynamicSteppedForm";
import { eventSchema } from "@/config/schemas/eventSchema";
import EventRoadmap from "@/components/organizer/EventRoadmap";
import { Calendar, Layout } from "lucide-react";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [events, setEvents] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [venuesRes, speakersRes, eventsRes, communitiesRes] =
          await Promise.all([
            fetch("http://localhost:5000/api/venues", { headers }),
            fetch("http://localhost:5000/api/speakers", { headers }),
            fetch("http://localhost:5000/api/events?status=all", { headers }),
            fetch("http://localhost:5000/api/communities/my-communities", {
              headers,
            }),
          ]);

        if (venuesRes.ok) {
          const data = await venuesRes.json();
          setVenues(data || []);
        }
        if (speakersRes.ok) {
          const data = await speakersRes.json();
          setSpeakers(data.speakers || []);
        }
        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setEvents(data || []);
        }
        if (communitiesRes.ok) {
          const data = await communitiesRes.json();
          setCommunities(data || []);
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
    // Validation: Proposal is mandatory
    if (!formData.proposal) {
      toast.warning("Proposal Document Required", {
        description: "You must upload a proposal PDF to publish your event.",
        duration: 4000,
        icon: "📄",
      });
      throw new Error("Proposal document is required");
    }

    const submitData = new FormData();

    // Append simple fields
    Object.keys(formData).forEach((key) => {
      if (key === "tags") {
        const tags =
          typeof formData.tags === "string"
            ? formData.tags
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t)
            : [formData.category];
        tags.forEach((tag) => submitData.append("tags[]", tag));
      } else if (key === "speaker_ids") {
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
      } else if (
        key === "startDateTime" ||
        key === "endDateTime" ||
        key === "duration_display"
      ) {
        // Handled below or skipped
      } else {
        submitData.append(key, formData[key]);
      }
    });

    // Explicitly add formatting for date/time
    if (formData.startDateTime) {
      submitData.set(
        "date_time",
        new Date(formData.startDateTime).toISOString(),
      );
    }
    if (formData.endDateTime) {
      submitData.set("end_time", new Date(formData.endDateTime).toISOString());
    }

    // Calculate duration in minutes for backend
    if (formData.startDateTime && formData.endDateTime) {
      const dur = Math.round(
        (new Date(formData.endDateTime) - new Date(formData.startDateTime)) /
          60000,
      );
      submitData.set("duration_minutes", dur);
    }

    submitData.set("capacity", parseInt(formData.capacity) || 0);

    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: submitData,
    });

    if (!response.ok) {
      const data = await response.json();
      if (response.status === 400 && data.message.includes("Conflict")) {
        toast.error("Scheduling Conflict", {
          description: data.message,
          duration: 6000,
        });
      } else {
        toast.error("Error launching event", {
          description:
            data.error ||
            data.message ||
            "Failed to create event. Please try again.",
        });
      }
      throw new Error(data.error || data.message || "Failed to launch event");
    }

    toast.success("Event Launched!", {
      description:
        "Your event has been successfully scheduled and broadcasted.",
    });
    navigate("/organizer/my-events");
  };

  // Inject dynamic options into schema
  const dynamicSchema = (formData) => {
    // Calculate duration for display
    let durationDisplay = "Select dates to calculate...";
    if (formData.startDateTime && formData.endDateTime) {
      const diffMs =
        new Date(formData.endDateTime) - new Date(formData.startDateTime);
      if (diffMs > 0) {
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.round((diffMs % 3600000) / 60000);
        durationDisplay = `${diffHrs}h ${diffMins}m`;
      } else if (diffMs <= 0) {
        durationDisplay = "End must be after Start";
      }
    }

    // Get booked dates for current venue if selected
    const selectedVenueEvents =
      formData.venue_id && formData.venue_id !== "other"
        ? events.filter(
            (e) =>
              e.venue_id?._id === formData.venue_id ||
              e.venue_id === formData.venue_id,
          )
        : [];

    const disabledDates = selectedVenueEvents.map((e) => ({
      from: new Date(e.date_time),
      to: new Date(e.end_time),
    }));

    return {
      ...eventSchema,
      steps: eventSchema.steps.map((step) => {
        if (step.name === "basics") {
          return {
            ...step,
            fields: step.fields.map((field) => {
              if (field.name === "community_id") {
                return {
                  ...field,
                  options: communities.map((c) => ({
                    label: c.name,
                    value: c._id,
                  })),
                };
              }
              return field;
            }),
          };
        }
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
              if (field.name === "duration_display") {
                return { ...field, placeholder: durationDisplay };
              }
              if (
                field.name === "startDateTime" ||
                field.name === "endDateTime"
              ) {
                return { ...field, disabledDates };
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
                  options: speakers.map((s) => ({
                    label: s.name,
                    value: s._id,
                  })),
                };
              }
              return field;
            }),
          };
        }
        return step;
      }),
    };
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
      {/* Header */}
      <div className="max-w-[1600px] mx-auto mb-6">
        <h1 className="text-3xl font-clash font-bold text-white mb-2">
          Create New Event
        </h1>
        <p className="text-zinc-500 text-sm">
          Set up your event details and broadcast your vision.
        </p>
      </div>

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
              <EventRoadmap events={events} readOnly={true} />
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
