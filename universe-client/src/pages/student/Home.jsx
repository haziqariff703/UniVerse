import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Hero from "@/components/home/Hero";
import EventCard from "@/components/common/EventCard";
import Stats from "@/components/home/Stats";
import Categories from "@/components/home/Categories";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real scenario, this would be your actual API endpoint
    // Using a timeout to simulate loading state if the server is empty
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        // Fallback dummy data if server connection fails or is empty for demo purposes
        setEvents([
          {
            id: 1,
            title: "Nebula Music Festival",
            date: "2023-11-15",
            category: "Music",
            description: "Experience intergalactic beats under the stars.",
          },
          {
            id: 2,
            title: "Tech Horizons 2024",
            date: "2024-01-20",
            category: "Tech",
            description: "The future of AI and space exploration technology.",
          },
          {
            id: 3,
            title: "Cosmic Art Exhibition",
            date: "2023-12-05",
            category: "Art",
            description: " immersive digital art installations.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      <Hero />
      <Stats />

      <Categories />

      <main className="max-w-7xl mx-auto px-6 py-20" id="events">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-neuemontreal font-bold text-white mb-2">
              Upcoming Events
            </h2>
            <p className="text-starlight/60">
              Curated experiences from across the universe.
            </p>
          </div>
          <Link
            to="/events"
            className="hidden md:block text-accent hover:text-white transition-colors"
          >
            View All &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.length > 0 ? (
              events.map((event, index) => (
                <EventCard
                  key={event._id || event.id}
                  event={event}
                  index={index}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-starlight/50">
                <p>No events found. Be the first to create one!</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Testimonials />
      <Newsletter />
    </>
  );
};

export default Home;
