import {
  Info,
  Clock,
  Tag,
  Image as ImageIcon,
  Rocket,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Type
} from "lucide-react";

export const eventSchema = {
  steps: [
    {
      id: 1,
      name: "basics",
      title: "Basics",
      icon: Info,
      description: "Basic event information",
      fields: [
        {
          name: "title",
          label: "Event Title",
          type: "text",
          placeholder: "E.g. Cosmic Hackathon 2026",
          required: true,
          width: "full", // full | half
          icon: Type
        },
        {
          name: "category",
          label: "Category",
          type: "select", // or 'pills' as per current UI
          options: [
            "Music",
            "Technology",
            "Art",
            "Sports",
            "Education",
            "Networking",
            "Gaming",
            "Science",
          ],
          width: "full"
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          placeholder: "What is this event about?",
          rows: 5,
          width: "full"
        },
      ],
    },
    {
      id: 2,
      name: "schedule",
      title: "Schedule",
      icon: Clock,
      description: "When and where",
      fields: [
        {
          name: "date",
          label: "Date",
          type: "date",
          required: true,
          width: "half",
          icon: Calendar
        },
        {
          name: "time",
          label: "Time",
          type: "time",
          required: true,
          width: "half",
          icon: Clock
        },
        {
          name: "venue",
          label: "Venue Location",
          type: "text",
          placeholder: "e.g. Grand Hall, Main Campus",
          width: "full",
          icon: MapPin
        },
      ],
    },
    {
      id: 3,
      name: "tickets",
      title: "Tickets",
      icon: Tag,
      description: "Capacity and Pricing",
      fields: [
        {
          name: "capacity",
          label: "Max Capacity",
          type: "number",
          placeholder: "100",
          required: true,
          width: "half",
          icon: Users
        },
        {
          name: "ticketPrice",
          label: "Ticket Price (RM)",
          type: "number",
          placeholder: "0.00",
          width: "half",
          icon: DollarSign,
          note: "Setting a price of 0 will mark the event as 'Free Entry'.",
        },
      ],
    },
    {
      id: 4,
      name: "media",
      title: "Media",
      icon: ImageIcon,
      description: "Visuals",
      fields: [
        {
          name: "image",
          label: "Event Cover Image",
          type: "file",
          accept: "image/*",
          width: "full"
        },
      ],
    },
    {
      id: 5,
      name: "review",
      title: "Review",
      icon: Rocket,
      type: "review", // Special type for review step
      description: "Verify and Launch",
      fields: []
    }
  ],
};
