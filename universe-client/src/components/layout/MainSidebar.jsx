import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  LayoutGrid, // Dashboard/News
  Users, // Communities
  Calendar, // Events
  MapPin, // Venues
  Mic2, // Speakers
  Ticket, // My Bookings
  PlusCircle, // Organizer
  TrendingUp, // Analytics
  Bell, // Notifications
  DollarSign, // Finance
  History, // Activity Log
  UserSearch, // Speakers
  Send, // Broadcast
} from "lucide-react";

const MainSidebar = ({ user, collapsed }) => {
  const location = useLocation();

  // Define navigation items based on role
  const getNavItems = () => {
    // Check if we are in an event context
    const eventMatch = location.pathname.match(/\/organizer\/event\/([^/]+)/);
    const eventId = eventMatch ? eventMatch[1] : null;

    if (!user) {
      return [
        { label: "Home", path: "/", icon: LayoutGrid },
        { label: "Communities", path: "/communities", icon: Users },
        { label: "Events", path: "/events", icon: Calendar },
        { label: "Venues", path: "/venues", icon: MapPin },
        { label: "Speakers", path: "/speakers", icon: Mic2 },
      ];
    }

    if (user.role === "organizer") {
      const baseItems = [
        { label: "My Events", path: "/organizer/my-events", icon: Calendar },
        {
          label: "Create Event",
          path: "/organizer/create-event",
          icon: PlusCircle,
        },
        { label: "Venues", path: "/organizer/venues", icon: MapPin },
        { label: "Workforce", path: "/organizer/workforce", icon: Users },
        { label: "Analytics", path: "/organizer/analytics", icon: TrendingUp },
        { label: "Finance", path: "/organizer/finance", icon: DollarSign },
        { label: "Speakers", path: "/organizer/speakers", icon: UserSearch },
        { label: "Broadcast", path: "/organizer/broadcast", icon: Send },
      ];

      // If we are managing a specific event, add context links
      if (eventId) {
        return [
          ...baseItems,
          { type: "divider" },
          {
            label: "Dashboard",
            path: `/organizer/event/${eventId}/dashboard`,
            icon: LayoutGrid,
            isSub: true,
          },
          {
            label: "Edit Event",
            path: `/organizer/event/${eventId}/edit`,
            icon: Calendar,
            isSub: true,
          }, // Using Calendar icon as placeholder for Edit if generic Edit icon not imported
          {
            label: "Scan QR",
            path: `/organizer/event/${eventId}/scan`,
            icon: Calendar,
            isSub: true,
          }, // Using Calendar as placeholder, will fix icon imports next
        ];
      }

      return baseItems;
    }

    // Student (default)
    return [
      { label: "News", path: "/news", icon: LayoutGrid },
      { label: "Communities", path: "/communities", icon: Users },
      { label: "Events", path: "/events", icon: Calendar },
      { label: "Venues", path: "/venues", icon: MapPin },
      { label: "Speakers", path: "/speakers", icon: Mic2 },
      { label: "My Bookings", path: "/my-bookings", icon: Ticket },
    ];
  };

  const navItems = getNavItems();

  return (
    <div
      className={`h-screen sticky top-0 left-0 bg-background border-r border-border flex flex-col z-50 overflow-hidden text-foreground transition-all duration-300 ${collapsed ? "w-0" : "w-[280px]"}`}
    >
      {/* 1. Header & Logo */}
      <div className="p-6 flex items-center justify-between h-20">
        <span className="text-muted-foreground text-sm font-medium">
          Navigation
        </span>
      </div>

      {/* 2. Navigation Items */}
      <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto no-scrollbar">
        {navItems.map((item, index) => {
          // Handle divider items
          if (item.type === "divider") {
            return (
              <div
                key={`divider-${index}`}
                className="border-t border-border my-2"
              />
            );
          }

          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon
                className={`w-5 h-5 flex-shrink-0 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
              <span
                className={`font-medium text-sm whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0" : "opacity-100"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
export default MainSidebar;
