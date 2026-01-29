import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Info,
  AlertTriangle,
  Search,
  MoreVertical,
  Trash2,
  Check,
} from "lucide-react";
import { Tab } from "@headlessui/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const studentNotifications = [
    {
      id: "s1",
      title: "Registration Confirmed",
      message:
        "You have successfully registered for 'Nebula Music Festival'. Your QR code is ready.",
      type: "success",
      time: "2 hours ago",
      isRead: false,
    },
    {
      id: "s2",
      title: "Event Reminder",
      message:
        "The 'Quantum Physics Symposium' is starting in 30 minutes at Mars Campus.",
      type: "info",
      time: "30 mins ago",
      isRead: false,
    },
    {
      id: "s3",
      title: "Venue Change",
      message:
        "The venue for 'Astro-Culinary Workshop' has been changed to Saturn Ring Station.",
      type: "alert",
      time: "1 day ago",
      isRead: true,
    },
  ];

  const organizerNotifications = [
    {
      id: "o1",
      title: "New Registration",
      message: "Sarah Jenkins registered for 'Tech Innovation Summit 2024'",
      type: "success",
      time: "2 mins ago",
      isRead: false,
    },
    {
      id: "o2",
      title: "Crew Application",
      message: "Mike Ross applied for 'Head of Logistics' at 'AI Workshop'",
      type: "info",
      time: "1 hour ago",
      isRead: false,
    },
    {
      id: "o3",
      title: "Venue Conflict",
      message: "Main Hall unavailable for 'Startup Night' due to maintenance.",
      type: "alert",
      time: "3 hours ago",
      isRead: true,
    },
  ];

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      if (user.role === "organizer" || user.role === "admin") {
        setNotifications([...organizerNotifications, ...studentNotifications]);
      } else {
        setNotifications(studentNotifications);
      }
    }
  }, [user]);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="text-emerald-400" size={18} />;
      case "alert":
        return <AlertTriangle className="text-red-400" size={18} />;
      case "info":
        return <Info className="text-blue-400" size={18} />;
      default:
        return <Bell className="text-violet-400" size={18} />;
    }
  };

  const filteredNotifications = notifications
    .filter((n) => {
      if (activeTab === 1) return !n.isRead;
      return true;
    })
    .filter(
      (n) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            to={
              user?.role === "organizer" || user?.role === "admin"
                ? "/organizer/my-events"
                : "/profile"
            }
            className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-neuemontreal font-bold text-white mb-1">
              Notifications
            </h1>
            <p className="text-white/40 text-sm">
              {user?.role === "organizer" || user?.role === "admin"
                ? "Stay updated with event and guest activities"
                : "Stay updated with your latest alerts and announcements"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-9"
            onClick={markAllRead}
          >
            <Check className="mr-2" size={14} />
            Mark all read
          </Button>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-[#050505] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <Tab.Group onChange={setActiveTab}>
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 flex-wrap gap-4">
            <Tab.List className="flex gap-6">
              <Tab
                className={({ selected }) =>
                  cn(
                    "text-sm font-bold transition-all relative pb-2 outline-none",
                    selected
                      ? "text-violet-400"
                      : "text-white/40 hover:text-white/60",
                  )
                }
              >
                All
                {activeTab === 0 && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-400 rounded-full" />
                )}
              </Tab>
              <Tab
                className={({ selected }) =>
                  cn(
                    "text-sm font-bold transition-all relative pb-2 outline-none",
                    selected
                      ? "text-violet-400"
                      : "text-white/40 hover:text-white/60",
                  )
                }
              >
                Unread
                <span className="ml-2 px-1.5 py-0.5 bg-white/5 rounded text-[10px]">
                  {notifications.filter((n) => !n.isRead).length}
                </span>
                {activeTab === 1 && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-400 rounded-full" />
                )}
              </Tab>
            </Tab.List>

            <div className="relative flex-1 max-w-sm">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
                size={16}
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications..."
                className="pl-10 bg-white/5 border-white/10 text-white h-9 focus-visible:ring-violet-400/50"
              />
            </div>
          </div>

          <Tab.Panels className="p-0">
            <Tab.Panel className="divide-y divide-white/5">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "group p-6 flex gap-4 hover:bg-white/[0.02] transition-colors relative",
                      !notification.isRead && "bg-violet-400/[0.02]",
                    )}
                  >
                    <div className="mt-1">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        {getIcon(notification.type)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3
                          className={cn(
                            "font-bold text-white transition-colors",
                            !notification.isRead
                              ? "text-base"
                              : "text-sm text-white/80",
                          )}
                        >
                          {notification.title}
                        </h3>
                        <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-white/40 leading-relaxed mb-3">
                        {notification.message}
                      </p>

                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-white/10"
                          >
                            <MoreVertical size={14} className="text-white/40" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#0f0f0f] border-white/10 text-white"
                        >
                          <DropdownMenuItem
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer"
                          >
                            <Trash2 className="mr-2" size={14} />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {!notification.isRead && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-violet-400 rounded-r-full" />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-20 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 mb-4">
                    <Bell className="text-white/20" size={32} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">
                    No notifications found
                  </h3>
                  <p className="text-white/40 text-sm max-w-xs">
                    We couldn't find any notifications matching your current
                    filters.
                  </p>
                </div>
              )}
            </Tab.Panel>

            <Tab.Panel className="divide-y divide-white/5">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="group p-6 flex gap-4 hover:bg-white/[0.02] transition-colors relative bg-violet-400/[0.02]"
                  >
                    <div className="mt-1">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        {getIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-white text-base">
                          {notification.title}
                        </h3>
                        <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-white/40 leading-relaxed mb-3">
                        {notification.message}
                      </p>
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        Mark as read
                      </button>
                    </div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-violet-400 rounded-r-full" />
                  </div>
                ))
              ) : (
                <div className="p-20 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 mb-4">
                    <CheckCircle2 className="text-emerald-400/40" size={32} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">
                    All caught up!
                  </h3>
                  <p className="text-white/40 text-sm">
                    You have no unread notifications.
                  </p>
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Notifications;
