import React, { useState } from "react";
import SpeakerCard from "@/components/speakers/SpeakerCard";
import { Search } from "lucide-react";

// Mock Data
const MOCK_SPEAKERS = [
  {
    id: 1,
    name: "Dr. Elena Void",
    expertise: "Astrophysics",
    bio: "Leading researcher in dark matter and cosmic inflation.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    social_links: { linkedin: "#", twitter: "#" },
  },
  {
    id: 2,
    name: "Marcus Nebula",
    expertise: "AI ethics",
    bio: "Futurist and author aiming to align AI with human values.",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
    social_links: { linkedin: "#", website: "#" },
  },
  {
    id: 3,
    name: "Sarah Star",
    expertise: "Digital Art",
    bio: "Pioneer in VR sculpting and immersive installations.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
    social_links: { twitter: "#", website: "#" },
  },
  {
    id: 4,
    name: "Prof. Quantum",
    expertise: "Quantum Computing",
    bio: "Building the next generation of processors.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800",
    social_links: { linkedin: "#" },
  },
  {
    id: 5,
    name: "Chef Zorg",
    expertise: "Molecular Gastronomy",
    bio: "Cooking with science and zero-gravity techniques.",
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800",
    social_links: { website: "#" },
  },
];

const Speakers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSpeakers = MOCK_SPEAKERS.filter(
    (speaker) =>
      speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.expertise.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen pt-6 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-neuemontreal font-bold text-foreground mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Speakers
          </h1>
          <p className="text-muted-foreground text-lg max-w-md animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Meet the visionaries, experts, and artists shaping the UniVerse.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-auto animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search speakers or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 bg-background border border-border px-12 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors rounded-xl hover:bg-accent/50"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredSpeakers.map((speaker, idx) => (
          <div
            key={speaker.id}
            className={`animate-in fade-in slide-in-from-bottom-6 duration-500 delay-${
              idx * 100
            }`}
            style={{
              animationDelay: `${idx * 100}ms`,
              animationFillMode: "both",
            }}
          >
            <SpeakerCard speaker={speaker} index={idx} />
          </div>
        ))}
        {filteredSpeakers.length === 0 && (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            No speakers found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Speakers;
