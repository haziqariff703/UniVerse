import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Share2,
  Mic,
  Info,
} from "lucide-react";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_URL =
      import.meta.env.VITE_API_URL || "http://localhost:5000/api/events";

    const fetchEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Event not found");
        const data = await response.json();

        // Map API response to component structure
        setEvent({
          id: data._id,
          title: data.title,
          date: data.date_time,
          description: data.description,
          venue: {
            name: data.venue_id?.name || data.location || "TBA",
            address: data.venue_id?.address || data.location || "Online",
            capacity: data.capacity || 100,
          },
          organizer: {
            name: data.organizer_id?.name || "Event Organizer",
            email: data.organizer_id?.email || "",
          },
          speakers: data.speakers || [],
          price: data.ticket_price || 0,
          currency: "RM",
          status: data.status || "Open",
          image_url: data.image || null,
          tags: data.tags || [],
          current_attendees: data.current_attendees || 0,
        });
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to register for this event.");
        navigate("/login");
        return;
      }

      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${API_URL}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration Successful! Check your profile for the ticket.");
    } catch (err) {
      alert(err.message);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Event Not Found
        </h2>
        <p className="text-starlight/60 mb-6">
          {error || "This event doesn't exist or has been removed."}
        </p>
        <Link
          to="/events"
          className="text-accent hover:text-accent/80 transition-colors"
        >
          Return to Events List
        </Link>
      </div>
    );
  }

  // Format date
  const eventDate = new Date(event.date);
  const isValidDate = !isNaN(eventDate);
  const dateStr = isValidDate
    ? eventDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date TBA";
  const timeStr = isValidDate
    ? eventDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Time TBA";

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Back Button */}
      <div className="fixed top-24 left-4 md:left-8 z-40">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-background/60 backdrop-blur-md border border-border rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-black/40 z-0" />
        {/* Abstract Background or Image */}
        <div
          className="absolute inset-0 z-[-1] bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${event.image_url})` }}
        />

        <div className="relative z-20 h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-end pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-medium mb-4 backdrop-blur-sm">
              {event.status === "Open" ? "Registration Open" : event.status}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-neuemontreal font-bold text-foreground mb-6 leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-muted-foreground text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                <span>{dateStr}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                <span>{timeStr}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                <span>{event.venue.name}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-12"
        >
          {/* About */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Info className="w-6 h-6 text-muted-foreground/50" />
              About the Event
            </h2>
            <div className="glass-panel p-8 rounded-3xl">
              <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </section>

          {/* Speakers / Lineup */}
          {event.speakers && event.speakers.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Mic className="w-6 h-6 text-muted-foreground/50" />
                Featured Guests
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.speakers.map((speaker, idx) => (
                  <div
                    key={idx}
                    className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
                      {speaker.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-foreground font-bold">
                        {speaker.name}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {speaker.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Location Details (Map placeholder) */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-muted-foreground/50" />
              Venue Information
            </h2>
            <div className="glass-panel p-8 rounded-3xl">
              <h3 className="text-xl text-foreground font-bold mb-2">
                {event.venue.name}
              </h3>
              <p className="text-muted-foreground mb-6">
                {event.venue.address}
              </p>
              {/* Visual placeholder for map */}
              <div className="w-full h-48 bg-muted rounded-xl border border-border flex items-center justify-center">
                <span className="text-muted-foreground/40 italic">
                  Interactive Star Chart Loading...
                </span>
              </div>
            </div>
          </section>
        </motion.div>

        {/* Right Column: Sticky Action Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="sticky top-28"
          >
            <div className="glass-panel p-8 rounded-3xl border border-accent/20 shadow-2xl shadow-black/50 relative overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <h3 className="text-lg font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Access Pass
              </h3>
              <div className="text-4xl font-bold text-foreground mb-6 flex items-baseline gap-2">
                {event.price > 0 ? (
                  <>
                    {event.price}{" "}
                    <span className="text-lg text-muted-foreground">
                      {event.currency}
                    </span>
                  </>
                ) : (
                  "Free Entry"
                )}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="text-foreground font-medium">
                    {event.venue.capacity} Standard Units
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="text-accent font-medium">
                    {event.venue.capacity - 1240} Seats
                  </span>
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={registering || event.status !== "Open"}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${
                  event.status === "Open"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-violet-500/25"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {registering ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                ) : event.status === "Open" ? (
                  <>
                    Register Now
                    <Share2 className="w-5 h-5 opacity-0 group-hover:opacity-100 hidden" />
                  </>
                ) : (
                  "Registration Closed"
                )}
              </button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Secure transaction via UniVerse Chain.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
