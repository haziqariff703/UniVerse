import React, { useState } from "react";
import VenueCard from "@/components/venues/VenueCard";
import { Search, Filter } from "lucide-react";

// Mock Data conforming to schema
const MOCK_VENUES = [
  {
    id: 1,
    name: "Grand Aurora Hall",
    location_code: "GAH-01",
    max_capacity: 1000,
    facilities: ["Stage", "Projector", "Sound System", "AC", "Backstage"],
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    name: "Quantum Lecture Theatre",
    location_code: "QLT-B2",
    max_capacity: 300,
    facilities: ["Projector", "Tiered Seating", "Whiteboard", "Wifi"],
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    name: "Starlight Atrium",
    location_code: "SA-05",
    max_capacity: 150,
    facilities: ["Natural Light", "Open Space", "Wifi", "Lounge Area"],
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    name: "Nebula Lab 1",
    location_code: "NL-101",
    max_capacity: 50,
    facilities: ["Computers", "Projector", "Whiteboard", "AC"],
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    name: "Cosmos Conference Room",
    location_code: "CCR-03",
    max_capacity: 20,
    facilities: ["Video Conf", "TV Screen", "Whiteboard"],
    image:
      "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800",
  },
];

const Venues = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("All");

  const filteredVenues = MOCK_VENUES.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location_code.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesCapacity = true;
    if (capacityFilter === "Large") matchesCapacity = venue.max_capacity >= 500;
    if (capacityFilter === "Medium")
      matchesCapacity = venue.max_capacity >= 100 && venue.max_capacity < 500;
    if (capacityFilter === "Small") matchesCapacity = venue.max_capacity < 100;

    return matchesSearch && matchesCapacity;
  });

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-neuemontreal font-bold text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Venues
          </h1>
          <p className="text-starlight/60 text-lg max-w-md animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Find the perfect space for your next event, from grand halls to
            intimate meeting rooms.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-starlight/40 w-5 h-5 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 bg-white/5 border border-white/10 px-12 py-3 text-white placeholder-starlight/30 focus:outline-none focus:border-accent transition-colors rounded-xl"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-starlight/40 w-5 h-5" />
            <select
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(e.target.value)}
              className="appearance-none w-full sm:w-48 bg-white/5 border border-white/10 px-12 py-3 text-white focus:outline-none focus:border-accent transition-colors rounded-xl cursor-pointer"
            >
              <option className="bg-nebula" value="All">
                All Sizes
              </option>
              <option className="bg-nebula" value="Small">
                Small (&lt;100)
              </option>
              <option className="bg-nebula" value="Medium">
                Medium (100-500)
              </option>
              <option className="bg-nebula" value="Large">
                Large (500+)
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVenues.map((venue, idx) => (
          <div
            key={venue.id}
            className={`animate-in fade-in zoom-in-95 duration-500 delay-${
              idx * 100
            }`}
            style={{
              animationDelay: `${idx * 100}ms`,
              animationFillMode: "both",
            }}
          >
            <VenueCard venue={venue} index={idx} />
          </div>
        ))}
        {filteredVenues.length === 0 && (
          <div className="col-span-full text-center py-20 text-starlight/50">
            No venues found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Venues;
