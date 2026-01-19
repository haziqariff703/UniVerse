import React, { useState } from "react";
import {
  Bell,
  Check,
  Info,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

// Mock Data
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "success",
    title: "Registration Confirmed",
    message:
      "You have successfully registered for 'Nebula Music Festival'. Your QR code is ready.",
    time: "2 hours ago",
    isRead: false,
  },
  {
    id: 2,
    type: "info",
    title: "Event Reminder",
    message:
      "The 'Quantum Physics Symposium' is starting in 30 minutes at Mars Campus.",
    time: "30 mins ago",
    isRead: false,
  },
  {
    id: 3,
    type: "alert",
    title: "Venue Change",
    message:
      "The venue for 'Astro-Culinary Workshop' has been changed to Saturn Ring Station.",
    time: "1 day ago",
    isRead: true,
  },
  {
    id: 4,
    type: "info",
    title: "New Speaker Announced",
    message: "Dr. Elena Void has replaced Prof. X at the 'Deep Space Summit'.",
    time: "2 days ago",
    isRead: true,
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState("all"); // all, unread

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif,
      ),
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case "alert":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen pt-6 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-neuemontreal font-bold text-foreground mb-2 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            Notification{" "}
            <span className="text-sm font-sans font-normal px-2 py-1 bg-accent rounded-full text-foreground align-middle">
              {notifications.filter((n) => !n.isRead).length} New
            </span>
          </h1>
          <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            Stay updated with your latest alerts and announcements.
          </p>
        </div>

        <div className="flex gap-3 animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
          <button
            onClick={() => setFilter(filter === "all" ? "unread" : "all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              filter === "unread"
                ? "bg-secondary border-accent text-foreground"
                : "bg-transparent border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {filter === "all" ? "Filter Unread" : "Show All"}
          </button>
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-sm font-medium text-muted-foreground transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Mark all read
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif, idx) => (
            <div
              key={notif.id}
              className={`relative p-5 rounded-2xl border transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
                notif.isRead
                  ? "bg-card border-border"
                  : "bg-background border-accent/30 shadow-lg shadow-accent/5"
              }`}
              style={{
                animationDelay: `${idx * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`mt-1 p-2 rounded-full bg-secondary border border-border shrink-0`}
                >
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3
                      className={`font-bold text-lg mb-1 ${
                        notif.isRead
                          ? "text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {notif.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {notif.time}
                      </span>
                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="ml-2 text-xs text-accent-foreground hover:text-foreground transition-colors underline"
                          title="Mark as read"
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border animate-in fade-in">
            <Bell className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              You're all caught up!
            </p>
            <p className="text-muted-foreground/80 text-sm">
              No new notifications to display.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
