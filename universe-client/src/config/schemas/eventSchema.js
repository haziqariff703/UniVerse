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
  Type,
  UserCheck,
  Hash,
  Activity
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
          width: "full",
          icon: Type
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: [
            "Academic",
            "Creative",
            "Lifestyle",
            "Community",
            "Leadership",
          ],
          required: true,
          width: "half"
        },
        {
          name: "tags",
          label: "Tags",
          type: "text", 
          placeholder: "e.g. innovation, web3, future (comma separated)",
          width: "half",
          icon: Hash
        },
        {
          name: "community_id",
          label: "Host Organization",
          type: "select",
          options: [], // Will be populated dynamically in component
          required: true,
          width: "full",
          icon: Users,
          note: "Select which club/association is hosting this event."
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          placeholder: "Provide a detailed overview of your event...",
          rows: 4,
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
          name: "startDateTime",
          label: "Event Start",
          type: "datetime-picker",
          required: true,
          width: "half",
          icon: Calendar
        },
        {
          name: "endDateTime",
          label: "Event End",
          type: "datetime-picker",
          required: true,
          width: "half",
          icon: Clock
        },
        {
          name: "duration_display",
          label: "Event Duration",
          type: "text",
          placeholder: "Select dates to calculate...",
          width: "half",
          icon: Activity,
          disabled: true // Read-only
        },
        {
          name: "venue_id",
          label: "Venue Selection",
          type: "select", // Will be populated dynamically in component
          options: [], 
          required: true,
          width: "half",
          icon: MapPin,
          note: "Select 'Other' if your venue is not listed."
        },
        {
          name: "location_manual",
          label: "Manual Location (If 'Other')",
          type: "text",
          placeholder: "e.g. Virtual Link or Specific Room",
          width: "full",
          icon: MapPin
        },
      ],
    },
    {
      id: 3,
      name: "talent",
      title: "Talent & Access",
      icon: UserCheck,
      description: "Speakers and Capacity",
      fields: [
        {
          name: "speaker_ids",
          label: "Assign Speakers",
          type: "multi-select", // Will be populated dynamically
          options: [],
          width: "full",
          icon: Users,
          note: "Add speakers from your directory."
        },
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
          note: "Set to 0 for Free Entry.",
        },
        {
          name: "target_audience",
          label: "Target Audience",
          type: "select",
          options: [
            "All Students",
            "FPM Students",
            "FiTA Students",
            "FSKM Students",
            "College Jasmine",
            "Final Year Students",
          ],
          width: "half",
        },
        {
          name: "merit_points",
          label: "Merit Points Awarded",
          type: "number",
          placeholder: "0",
          width: "half",
          note: "Points credited to attendees upon check-in.",
        },
      ],
    },
    {
      id: 4,
      name: "media",
      title: "Media",
      icon: ImageIcon,
      description: "Visual Identity",
      fields: [
        {
          name: "image",
          label: "Event Cover Image",
          type: "file",
          accept: "image/*",
          width: "full"
        },
        {
          name: "proposal",
          label: "Event Proposal / Documentation (PDF)",
          type: "file",
          accept: ".pdf",
          width: "full",
          required: true,
          note: "Upload detailed proposal for admin approval."
        },
      ],
    },
    {
      id: 5,
      name: "review",
      title: "Launch",
      icon: Rocket,
      type: "review",
      description: "Final broadcast settings",
      fields: []
    }
  ],
};
