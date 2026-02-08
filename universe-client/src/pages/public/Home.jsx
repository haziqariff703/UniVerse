import { useState, useEffect, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import CampusLifeInMotion from "@/components/sections/CampusLifeInMotion";
import FacultyShowcase from "@/components/sections/FacultyShowcase";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import Communities from "@/components/home/Communities";
import FeaturedEventSlider from "@/components/public/FeaturedEventSlider";
import { resolveUrl } from "@/utils/urlHelper";

const API_BASE = "";

const mapEventToCardProps = (event) => ({
  id: event._id,
  title: event.title,
  description: event.description,
  image: event.image ? resolveUrl(event.image) : "/placeholder-event.jpg",
  date: new Date(event.date_time).toLocaleDateString("en-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  time: new Date(event.date_time).toLocaleTimeString("en-MY", {
    hour: "2-digit",
    minute: "2-digit",
  }),
  venue: {
    name: event.venue_id?.name || event.location || "TBA",
  },
  theme:
    event.category === "Academic" || event.category === "Leadership"
      ? "purple"
      : "cyan",
  target: event.target_audience,
  benefit: event.merit_points > 0 ? `+${event.merit_points} Merit` : null,
});

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    // Sync with other tabs or storage changes
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // Silently skip
        }
      } else {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleStorageChange);
    };
  }, []);

  const fetchFeatured = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/events?is_featured=true&upcoming=true`,
      );
      const data = await res.json();
      setFeaturedEvents(
        Array.isArray(data) ? data.map(mapEventToCardProps) : [],
      );
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  // Redirect login users based on roles
  if (user) {
    const hasStudentRole =
      user.role === "student" || user.roles?.includes("student");
    const isAssociation = user.role === "association";
    const isPureOrg =
      user.role === "organizer" && !user.roles?.includes("student");

    console.log("Home Redirect Check:", {
      userRole: user.role,
      userRoles: user.roles,
      hasStudentRole,
      isAssociation,
      isPureOrg,
    });

    // Associations and non-student organizers land on Management Command Center
    if (isAssociation || isPureOrg) {
      console.log("Redirecting to /organizer/my-events");
      return <Navigate to="/organizer/my-events" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    // Students land on the Student Dashboard
    if (hasStudentRole || !user.role) {
      console.log("Redirecting to Student Dashboard");
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return (
    <>
      <Hero />
      <Communities />
      <Stats />
      <CampusLifeInMotion />

      <FacultyShowcase />

      <main className="max-w-7xl mx-auto px-6 py-20" id="events">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-clash font-bold text-foreground mb-4">
              Upcoming{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Events
              </span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Curated experiences from across the universe.
            </p>
          </div>
          <Link
            to="/events"
            className="hidden md:block text-primary hover:text-foreground transition-colors"
          >
            View All &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : featuredEvents.length > 0 ? (
          <div className="w-full">
            <FeaturedEventSlider events={featuredEvents} isSmall={true} />
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
            <p className="text-slate-500 font-clash">
              No featured experiences live yet.
            </p>
          </div>
        )}
      </main>

      <Testimonials />
      <Newsletter />
    </>
  );
};

export default Home;
