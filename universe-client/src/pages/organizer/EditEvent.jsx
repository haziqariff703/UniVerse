import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DynamicSteppedForm from "@/components/forms/DynamicSteppedForm";
import { eventSchema } from "@/config/schemas/eventSchema";
import EventRoadmap from "@/components/organizer/EventRoadmap";
import { Calendar, Layout, Loader } from "lucide-react";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [events, setEvents] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [
          eventRes,
          venuesRes,
          speakersRes,
          eventsRes,
          communitiesRes,
          categoriesRes,
        ] = await Promise.all([
          fetch(`http://localhost:5000/api/events/${id}`, { headers }),
          fetch("http://localhost:5000/api/venues", { headers }),
          fetch("http://localhost:5000/api/speakers", { headers }),
          fetch("http://localhost:5000/api/events?status=all", { headers }),
          fetch("http://localhost:5000/api/communities/my-communities", {
            headers,
          }),
          fetch("http://localhost:5000/api/categories", { headers }),
        ]);

        if (eventRes.ok) {
          const eventData = await eventRes.json();

          // Format Data for Form
          const formattedData = {
            ...eventData,
            startDateTime: eventData.date_time
              ? new Date(eventData.date_time)
              : null,
            endDateTime: eventData.end_time
              ? new Date(eventData.end_time)
              : null,
            venue_id: eventData.venue_id?._id || eventData.venue_id,
            speaker_ids: eventData.speaker_ids
              ? eventData.speaker_ids.map((s) => s._id || s)
              : [],
            tags: eventData.tags ? eventData.tags.join(", ") : "",
            ticketPrice: eventData.ticket_price,
            community_id: eventData.community_id?._id || eventData.community_id,
          };
          setInitialData(formattedData);
        }

        if (venuesRes.ok) {
          const data = await venuesRes.json();
          setVenues(Array.isArray(data) ? data : data.venues || []);
        }
        if (speakersRes.ok) {
          const data = await speakersRes.json();
          setSpeakers(data.speakers || []);
        }
        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setEvents(Array.isArray(data) ? data : data.events || []);
        }
        if (communitiesRes.ok) {
          const data = await communitiesRes.json();
          setCommunities(data || []);
        }
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdateEvent = async (formData) => {
    const submitData = new FormData();

    // Fields to handle specifically or skip
    const specialFields = [
      "tags",
      "speaker_ids",
      "image",
      "proposal",
      "startDateTime",
      "endDateTime",
      "duration_display",
      "ticketPrice",
      "venue_id",
      "location_manual",
      "capacity",
      "merit_points",
      "tasks",
      "schedule",
    ];

    // Append standard fields
    Object.keys(formData).forEach((key) => {
      if (specialFields.includes(key)) return;

      let value = formData[key];
      if (
        (key === "organizer_id" || key === "community_id") &&
        typeof value === "object" &&
        value?._id
      ) {
        value = value._id;
      }

      if (value !== undefined && value !== null && value !== "") {
        submitData.append(key, value);
      }
    });

    // 1. Tags
    const tags =
      typeof formData.tags === "string"
        ? formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : Array.isArray(formData.tags)
          ? formData.tags
          : [];
    tags.forEach((tag) => submitData.append("tags[]", tag));

    // 2. Speakers
    if (Array.isArray(formData.speaker_ids)) {
      formData.speaker_ids.forEach((sid) => {
        const idValue = typeof sid === "object" && sid?._id ? sid._id : sid;
        if (idValue) submitData.append("speaker_ids[]", idValue);
      });
    }

    // 2b. Tasks & Schedule
    if (formData.tasks) {
      submitData.append("tasks", JSON.stringify(formData.tasks));
    }
    if (formData.schedule) {
      submitData.append("schedule", JSON.stringify(formData.schedule));
    }

    // 3. Venue & Location
    if (formData.venue_id === "other") {
      submitData.append("location", formData.location_manual || "");
    } else if (formData.venue_id) {
      const vId =
        typeof formData.venue_id === "object"
          ? formData.venue_id._id
          : formData.venue_id;
      if (vId) submitData.append("venue_id", vId);
    }

    // 4. Numeric Fields
    submitData.set("capacity", parseInt(formData.capacity) || 0);
    submitData.set("ticket_price", parseFloat(formData.ticketPrice) || 0);
    submitData.set("merit_points", parseInt(formData.merit_points) || 0);

    // 5. Date/Time & Duration
    if (formData.startDateTime) {
      submitData.set(
        "date_time",
        new Date(formData.startDateTime).toISOString(),
      );
    }
    if (formData.endDateTime) {
      submitData.set("end_time", new Date(formData.endDateTime).toISOString());
    }
    if (formData.startDateTime && formData.endDateTime) {
      const dur = Math.round(
        (new Date(formData.endDateTime) - new Date(formData.startDateTime)) /
          60000,
      );
      submitData.set("duration_minutes", dur);
    }

    // 6. Files
    if (formData.image instanceof File) {
      submitData.append("image", formData.image);
    }
    if (formData.proposal instanceof File) {
      submitData.append("proposal", formData.proposal);
    }

    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/api/events/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: submitData,
    });

    if (!response.ok) {
      const data = await response.json();
      if (response.status === 400 && data.message.includes("Conflict")) {
        toast.error("Update Conflict", {
          description: data.message,
          duration: 6000,
        });
      } else {
        toast.error("Update failed", {
          description:
            data.error ||
            data.message ||
            "Failed to update event. Please try again.",
        });
      }
      throw new Error(data.error || data.message || "Failed to update event");
    }

    toast.success("Event Updated!", {
      description: "Your changes have been saved and applied.",
    });
    navigate(`/organizer/event/${id}/dashboard`);
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

    // Get booked dates for current venue (excluding THIS event)
    const selectedVenueEvents =
      formData.venue_id && formData.venue_id !== "other"
        ? events.filter(
            (e) =>
              (e.venue_id?._id === formData.venue_id ||
                e.venue_id === formData.venue_id) &&
              e._id !== id,
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
              if (field.name === "category") {
                return {
                  ...field,
                  options: categories.map((c) => ({
                    label: c.name,
                    value: c.name,
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

  if (loading || !initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader className="animate-spin text-violet-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-20 px-4 md:px-8">
      {/* Header */}
      <div className="max-w-[1600px] mx-auto mb-6">
        <h1 className="text-3xl font-clash font-bold text-white mb-2">
          Edit Event
        </h1>
        <p className="text-zinc-500 text-sm">
          Update your event configuration and assets.
        </p>
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form (7/12) */}
        <div className="lg:col-span-7">
          <DynamicSteppedForm
            schema={dynamicSchema}
            initialData={initialData}
            onSubmit={handleUpdateEvent}
            submitLabel="Update Event"
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
                  Check the roadmap to ensure your new time doesn't conflict
                  with existing events.
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
