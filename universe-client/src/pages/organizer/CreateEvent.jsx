import React from "react";
import { useNavigate } from "react-router-dom";
import DynamicSteppedForm from "@/components/forms/DynamicSteppedForm";
import { eventSchema } from "@/config/schemas/eventSchema";

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleCreateEvent = async (formData) => {
    // Validation (Manual check for safety, though UI should handle basics)
    if (
      !formData.title ||
      !formData.date ||
      !formData.time ||
      !formData.capacity
    ) {
      throw new Error(
        "Please fill in all required fields (Title, Date, Time, Capacity)",
      );
    }

    const dateTime = new Date(`${formData.date}T${formData.time}`);

    const payload = {
      title: formData.title,
      description: formData.description,
      tags: [formData.category],
      date_time: dateTime.toISOString(),
      location: formData.venue,
      capacity: parseInt(formData.capacity),
      // image: formData.image (Handle file upload logic if backend supports it - typically requires FormData)
    };

    const token = localStorage.getItem("token");
    if (!token) throw new Error("You must be logged in to launch an event.");

    const response = await fetch("http://localhost:5000/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to launch event");
    }

    navigate("/events");
  };

  return (
    <DynamicSteppedForm schema={eventSchema} onSubmit={handleCreateEvent} />
  );
};

export default CreateEvent;
