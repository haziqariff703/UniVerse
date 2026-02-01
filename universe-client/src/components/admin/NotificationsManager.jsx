import React, { useState, useEffect } from "react"; // Fixed imports
import {
  Bell,
  Send,
  Trash2,
  Info,
  AlertTriangle,
  CheckCircle,
  Users,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

const NotificationsManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // New Notification Form State
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info"); // info, alert, success
  const [targetRole, setTargetRole] = useState("all"); // all, student, organizer

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/admin/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setSending(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/admin/notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message, type, target_role: targetRole }),
        },
      );

      if (!response.ok) throw new Error("Failed to send notification");

      const data = await response.json();
      alert(`Success: ${data.message}`);

      setMessage("");
      fetchNotifications();
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this notification log?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/admin/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "alert":
        return <AlertTriangle size={16} className="text-amber-400" />;
      case "success":
        return <CheckCircle size={16} className="text-emerald-400" />;
      default:
        return <Info size={16} className="text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-starlight to-starlight/60">
            Notification Center
          </h1>
          <p className="text-starlight/40 text-sm">
            Broadcast system alerts and manage user communications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Broadcast Form */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-2xl border border-violet-500/20 shadow-lg shadow-violet-500/5">
            <h2 className="text-lg font-bold text-starlight mb-4 flex items-center gap-2">
              <Send size={18} className="text-violet-400" />
              Compose Broadcast
            </h2>

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div className="space-y-2">
                <Label>Message Content</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="System maintenance scheduled for..."
                  className="bg-black/20 border-white/10 min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Notification Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: "info",
                      label: "Info",
                      color: "bg-blue-500/10 border-blue-500/20 text-blue-400",
                    },
                    {
                      id: "alert",
                      label: "Alert",
                      color:
                        "bg-amber-500/10 border-amber-500/20 text-amber-400",
                    },
                    {
                      id: "success",
                      label: "Success",
                      color:
                        "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                    },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setType(option.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                        type === option.id
                          ? option.color
                          : "bg-white/5 border-transparent text-starlight/40 hover:bg-white/10"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Target Audience</Label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-starlight focus:outline-none focus:border-violet-500/50"
                >
                  <option value="all">All Users</option>
                  <option value="student">Students Only</option>
                  <option value="organizer">Organizers Only</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-all shadow-lg hover:shadow-violet-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={16} /> Broadcast Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: History List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-starlight flex items-center gap-2">
              <Clock size={18} className="text-starlight/40" />
              Recent Logs
            </h2>
            <span className="text-xs text-starlight/40">
              Last 50 Logged Notifications
            </span>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden min-h-[400px]">
            {loading ? (
              <div className="p-8 text-center text-starlight/40">
                Loading history...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center text-starlight/40">
                No notifications found.
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className="p-4 hover:bg-white/[0.02] transition-colors flex items-start gap-4"
                  >
                    <div
                      className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 ${
                        notif.type === "alert"
                          ? "text-amber-400"
                          : notif.type === "success"
                            ? "text-emerald-400"
                            : "text-blue-400"
                      }`}
                    >
                      {getTypeIcon(notif.type)}
                    </div>

                    <div className="flex-1">
                      <p className="text-starlight text-sm mb-1">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-starlight/40">
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {notif.user_id?.name || "System Broadcast"}
                        </span>
                        <span>
                          {new Date(notif.created_at).toLocaleDateString()} at{" "}
                          {new Date(notif.created_at).toLocaleTimeString()}
                        </span>
                        <span className="uppercase font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                          {notif.type}
                        </span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-lg bg-white/5 text-starlight/40 hover:text-white hover:bg-white/10 transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 glass-panel border-white/10"
                      >
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-starlight/40">
                          Log Management
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem
                          onClick={() => handleDelete(notif._id)}
                          className="flex items-center gap-2 p-2.5 text-rose-400 hover:bg-rose-600/10 cursor-pointer rounded-lg transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-rose-600/10 flex items-center justify-center text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-all">
                            <Trash2 size={14} />
                          </div>
                          <span className="font-bold text-xs uppercase tracking-widest">
                            Wipe Log
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsManager;
