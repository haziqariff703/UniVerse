import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DynamicSteppedForm from "@/components/forms/DynamicSteppedForm";
import { eventSchema } from "@/config/schemas/eventSchema";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`);
        const data = await response.json();

        if (response.ok) {
          // Transform data if necessary to match schema structure
          // e.g. ensure dates are in correct format if needed by inputs
          // The date input usually processes standard date strings.
          // If the date input expects YYYY-MM-DD, we might need a transformer.
          // Assuming the backend returns ISO strings, we might need to simplify for date input.

          const formattedData = {
            ...data,
            // Extract date part if input type is 'date'
            date: data.date_time
              ? new Date(data.date_time).toISOString().split("T")[0]
              : "",
            // Extract time part if input type is 'time'
            time: data.date_time
              ? new Date(data.date_time).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            // Populate other fields
            venue: data.venue_id?._id || data.venue_id, // If populated, get ID, else keep ID
          };
          setEventData(formattedData);
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

  const handleUpdateEvent = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      // Prepare payload
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date_time: dateTime.toISOString(),
        venue_id: formData.venue, // Assuming schema uses 'venue' key for ID
        capacity: formData.capacity,
        ticket_price: formData.ticketPrice,
        // Image handling would go here (e.g. upload first then send URL, or multipart)
        // For now preventing image overwrite if not changed?
        // Current DynamicForm sends raw file object in formData.image if changed.
      };

      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update event");
      }

      // Format description for the success message in DynamicForm
      return {
        success: true,
        title: "Event Updated!",
        message: "Your event has been successfully updated.",
        primaryActionTest: "View Event",
        primaryAction: () => navigate(`/organizer/event/${id}/dashboard`), // Redirect to dashboard
      };
    } catch (error) {
      console.error("Update error:", error);
      throw error; // Re-throw to be handled by DynamicSteppedForm error state
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Event not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link
          to="/organizer/my-events"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={20} /> Cancel Editing
        </Link>
        <h1 className="text-3xl font-bold font-neuemontreal relative z-10 text-white">
          Edit Event
        </h1>
      </div>

      <DynamicSteppedForm
        schema={eventSchema}
        onSubmit={handleUpdateEvent}
        initialData={eventData}
      />
    </div>
  );
};

export default EditEvent;
