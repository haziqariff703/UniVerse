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

  useEffect(() => {
    // In a real app, fetch from API using ID
    // const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/events";
    // fetch(`${API_URL}/${id}`)...

    // Simulating API fetch with mock data lookup for demo
    // TODO: Replace with actual API call
    setTimeout(() => {
      // Mock full data
      setEvent({
        id: id,
        title: "Nebula Music Festival",
        date: "2023-11-15T18:00:00",
        description:
          "Join us for an unforgettable night of interstellar beats and cosmic vibes. The Nebula Music Festival brings together the top artists from across the galaxy for a celebration of sound and light under the open void. Experience immersive audio-visual installations, zero-gravity dance floors, and star-gazing lounges.",
        venue: {
          name: "Lunar Amphitheater",
          address: "Sector 7G, Crater Tyco, Moon Base Alpha",
          capacity: 5000,
        },
        organizer: {
          name: "Stellar Productions",
          email: "contact@stellar.universe",
        },
        speakers: [
          { name: "DJ Pulsar", role: "Headliner" },
          { name: "The Void Walkers", role: "Live Band" },
          { name: "Nova", role: "Visual Artist" },
        ],
        price: 150,
        currency: "credits",
        status: "Open",
        image_url:
          "https://images.unsplash.com/photo-1459749411177-287ce3276916?q=80&w=2070&auto=format&fit=crop", // Abstract nebula/concert
      });
      setLoading(false);
    }, 800);
  }, [id]);

  const handleRegister = async () => {
    setRegistering(true);
    // Simulate API call
    setTimeout(() => {
      setRegistering(false);
      alert("Registration Successful! Check your comms for the boarding pass.");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-white mb-4">Event Not Found</h2>
        <Link
          to="/events"
          className="text-accent hover:text-white transition-colors"
        >
          Return to Events List
        </Link>
      </div>
    );
  }

  // Format date
  const eventDate = new Date(event.date);
  const dateStr = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Back Button */}
      <div className="fixed top-24 left-4 md:left-8 z-40">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-black/20 backdrop-blur-md border border-white/5 rounded-full text-starlight hover:text-white hover:bg-white/10 transition-all group"
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
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-neuemontreal font-bold text-white mb-6 leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-starlight/80 text-lg">
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
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Info className="w-6 h-6 text-starlight/50" />
              About the Event
            </h2>
            <div className="glass-panel p-8 rounded-3xl">
              <p className="text-starlight/80 text-lg leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </section>

          {/* Speakers / Lineup */}
          {event.speakers && event.speakers.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Mic className="w-6 h-6 text-starlight/50" />
                Featured Guests
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.speakers.map((speaker, idx) => (
                  <div
                    key={idx}
                    className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
                      {speaker.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{speaker.name}</h4>
                      <p className="text-starlight/60 text-sm">
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
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-starlight/50" />
              Venue Information
            </h2>
            <div className="glass-panel p-8 rounded-3xl">
              <h3 className="text-xl text-white font-bold mb-2">
                {event.venue.name}
              </h3>
              <p className="text-starlight/70 mb-6">{event.venue.address}</p>
              {/* Visual placeholder for map */}
              <div className="w-full h-48 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                <span className="text-starlight/40 italic">
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

              <h3 className="text-lg font-medium text-starlight/60 mb-2 uppercase tracking-wider">
                Access Pass
              </h3>
              <div className="text-4xl font-bold text-white mb-6 flex items-baseline gap-2">
                {event.price > 0 ? (
                  <>
                    {event.price}{" "}
                    <span className="text-lg text-starlight/60">
                      {event.currency}
                    </span>
                  </>
                ) : (
                  "Free Entry"
                )}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-starlight/70">Capacity</span>
                  <span className="text-white font-medium">
                    {event.venue.capacity} Standard Units
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-starlight/70">Remaining</span>
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
                    : "bg-white/10 text-starlight/40 cursor-not-allowed"
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

              <p className="text-center text-xs text-starlight/40 mt-4">
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
