import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [eventRes, venuesRes, speakersRes, eventsRes] = await Promise.all(
          [
            fetch(`http://localhost:5000/api/events/${id}`, { headers }),
            fetch("http://localhost:5000/api/admin/venues", { headers }),
            fetch("http://localhost:5000/api/admin/speakers", { headers }),
            fetch("http://localhost:5000/api/events", { headers }),
          ],
        );

        if (eventRes.ok) {
          const eventData = await eventRes.json();

          // Format Data for Form
          const dt = new Date(eventData.date_time);
          const formattedData = {
            ...eventData,
            date: dt.toISOString().split("T")[0],
            time: dt.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            venue_id: eventData.venue_id?._id || eventData.venue_id,
            // Ensure array fields are handled
            speaker_ids: eventData.speaker_ids
              ? eventData.speaker_ids.map((s) => s._id || s)
              : [],
            tags: eventData.tags ? eventData.tags.join(", ") : "",
            ticketPrice: eventData.ticket_price, // Schema uses ticketPrice, DB uses ticket_price
          };
          setInitialData(formattedData);
        }

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
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdateEvent = async (formData) => {
    const dateTime = new Date(`${formData.date}T${formData.time}`);

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
          formData.speaker_ids.forEach((sid) =>
            submitData.append("speaker_ids[]", sid),
          );
        }
      } else if (key === "venue_id" && formData.venue_id === "other") {
        // Skip venue_id if other
      } else if (key === "location_manual" || key === "location") {
        if (formData.venue_id === "other") {
          submitData.append("location", formData.location_manual);
        }
      } else if (
        (key === "image" || key === "proposal") &&
        formData[key] instanceof File
      ) {
        // Only append if it's a new file (File object), not if it's a string URL
        submitData.append(key, formData[key]);
      } else if (key !== "image" && key !== "proposal") {
        submitData.append(key, formData[key]);
      }
    });

    submitData.set("date_time", dateTime.toISOString());
    submitData.set("capacity", parseInt(formData.capacity));
    submitData.set("ticket_price", parseFloat(formData.ticketPrice));

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
      throw new Error(data.message || "Failed to update event");
    }

    navigate(`/organizer/event/${id}/dashboard`);
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

  if (loading || !initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader className="animate-spin text-violet-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8">
      {/* Header */}
      <div className="max-w-[1600px] mx-auto mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Edit Event</h1>
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
              <EventRoadmap events={events} />
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
