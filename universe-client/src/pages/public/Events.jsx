import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Calendar } from "lucide-react";
import EventCard from "@/components/common/EventCard";

// Mock data for initial development (will replace with API call)
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Nebula Music Festival",
    date: "2023-11-15",
    category: "Music",
    description: "Experience intergalactic beats under the stars.",
    organizer_id: { name: "Stellar Productions" },
    venue_id: { name: "Lunar Amphitheater" },
    current_attendees: 1240,
    capacity: 5000,
  },
  {
    id: 2,
    title: "Tech Horizons 2024",
    date: "2024-01-20",
    category: "Tech",
    description: "The future of AI and space exploration technology.",
    organizer_id: { name: "Innovate Inc" },
    venue_id: { name: "Orbital Convention Center" },
    current_attendees: 450,
    capacity: 1000,
  },
  {
    id: 3,
    title: "Cosmic Art Exhibition",
    date: "2023-12-05",
    category: "Art",
    description: "Immersive digital art installations.",
    organizer_id: { name: "Galactic Gallery" },
    venue_id: { name: "Void Museum" },
    current_attendees: 89,
    capacity: 200,
  },
  {
    id: 4,
    title: "Astro-Culinary Workshop",
    date: "2024-02-14",
    category: "Lifestyle",
    description: "Cooking with zero-gravity ingredients.",
    organizer_id: { name: "Chef Zorg" },
    venue_id: { name: "Saturn Ring Station" },
    current_attendees: 25,
    capacity: 30,
  },
  {
    id: 5,
    title: "Quantum Physics Symposium",
    date: "2024-03-10",
    category: "Science",
    description: "Gathering of the brightest minds across dimensions.",
    organizer_id: { name: "UniVerse Academy" },
    venue_id: { name: "Mars Campus" },
    current_attendees: 300,
    capacity: 500,
  },
];

const CATEGORIES = ["All", "Music", "Tech", "Art", "Science", "Lifestyle"];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    // Determine the API URL based on environment or default to localhost
    const API_URL =
      import.meta.env.VITE_API_URL || "http://localhost:5000/api/events";

    const fetchEvents = async () => {
      try {
        // Backend server not running - using mock data
        // const response = await fetch(API_URL);
        // if (!response.ok) throw new Error("Failed to fetch");
        // const data = await response.json();
        // setEvents(data);

        // Using mock data until backend is started
        setEvents(MOCK_EVENTS);
      } catch (error) {
        console.error("Error fetching events:", error);
        // Fallback to mock data if API fails
        setEvents(MOCK_EVENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      (event.tags && event.tags.includes(selectedCategory)) ||
      event.category === selectedCategory; // Handle both schema structures if varied

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-6 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-neuemontreal font-bold text-foreground mb-4"
          >
            Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-md"
          >
            Discover and join the most anticipated gatherings across the
            universe.
          </motion.p>
        </div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 w-full md:w-auto"
        >
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 bg-background border-b border-border px-12 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors bg-transparent rounded-t-lg hover:bg-accent/50"
            />
          </div>
        </motion.div>
      </div>

      {/* Category Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-3 mb-12"
      >
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground border border-border"
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex justify-center py-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <motion.div
                  key={event._id || event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <EventCard event={event} index={index} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-muted-foreground w-8 h-8" />
                </div>
                <h3 className="text-xl text-foreground font-medium mb-2">
                  No events found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or category filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="mt-6 text-primary hover:text-foreground transition-colors text-sm font-medium"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Events;
