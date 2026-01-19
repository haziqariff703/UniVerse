import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Tag, ChevronRight, Filter } from "lucide-react";

const MyBookings = () => {
  const [filter, setFilter] = useState("all");

  // Mock data for bookings
  const bookings = [
    {
      id: 1,
      title: "Nebula Music Festival 2026",
      date: "March 15, 2026",
      location: "Cyberjaya Digital Arena",
      status: "Upcoming",
      category: "Music",
      price: "RM 150.00",
      image:
        "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Tech Summit: AI Revolution",
      date: "January 5, 2026",
      location: "Kuala Lumpur Convention Centre",
      status: "Past",
      category: "Technology",
      price: "Free",
      image:
        "https://images.unsplash.com/photo-1540575861501-7cf05a4b175a?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Artistic Souls Exhibition",
      date: "February 20, 2026",
      location: "National Art Gallery",
      status: "Canceled",
      category: "Art",
      price: "RM 25.00",
      image:
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2080&auto=format&fit=crop",
    },
  ];

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status.toLowerCase() === filter.toLowerCase());

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "Past":
        return "bg-muted text-muted-foreground border-border";
      case "Canceled":
        return "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 text-glow">
            My{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              Bookings
            </span>
          </h1>
          <p className="text-muted-foreground max-w-md">
            Relive your past experiences and track your upcoming cosmic
            adventures.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-secondary p-1 rounded-xl border border-white/10 backdrop-blur-sm">
          {["all", "upcoming", "past", "canceled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${
                filter === tab
                  ? "bg-card text-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={booking.id}
              className="glass-panel group overflow-hidden flex flex-col md:flex-row gap-6 p-4 md:p-6 rounded-3xl hover:border-starlight/30 transition-all duration-500"
            >
              <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src={booking.image}
                  alt={booking.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="flex-grow flex flex-col justify-between py-1">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        booking.status,
                      )}`}
                    >
                      {booking.status}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Tag size={12} />
                      {booking.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                    {booking.title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-violet-500 dark:text-violet-400 flex-shrink-0">
                        <Calendar size={16} />
                      </div>
                      <span className="text-sm">{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-violet-500 dark:text-violet-400 flex-shrink-0">
                        <MapPin size={16} />
                      </div>
                      <span className="text-sm truncate">
                        {booking.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-xl font-bold text-foreground">
                    {booking.price}
                  </div>
                  <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-foreground text-background font-semibold hover:bg-violet-500 hover:text-white dark:hover:bg-violet-400 dark:hover:text-black transition-all duration-300">
                    View Details
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 glass-panel rounded-3xl border-dashed border-border">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              No cosmic logs found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to find your registrations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
