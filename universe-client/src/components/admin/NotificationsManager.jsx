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
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

const NotificationsManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showAllLogs, setShowAllLogs] = useState(false);

  // New Notification Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info"); // info, alert, success
  const [targetRole, setTargetRole] = useState("all"); // all, student, organizer
  const [category, setCategory] = useState("campus");
  const [priority, setPriority] = useState("low");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    setShowAllLogs(false);
  }, [notifications]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
    if (!message.trim() || !title.trim()) {
      toast.error("Title and Message are required");
      return;
    }

    try {
      setSending(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("message", message);
      formData.append("type", type);
      formData.append("target_role", targetRole);
      formData.append("title", title);
      formData.append("category", category);
      formData.append("priority", priority);
      formData.append("is_public", true);

      if (imageFile) {
        formData.append("poster", imageFile);
      }

      const response = await fetch(
        "http://localhost:5000/api/admin/notifications",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) throw new Error("Failed to send notification");

      const data = await response.json();
      toast.success(`Success: ${data.message}`);

      setTitle("");
      setMessage("");
      setPriority("low");
      setImageFile(null);
      setImagePreview(null);
      fetchNotifications();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification");
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Broadcast Form */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-8 rounded-2xl border border-violet-500/20 shadow-lg shadow-violet-500/5">
            <h2 className="text-lg font-bold text-starlight mb-4 flex items-center gap-2">
              <Send size={18} className="text-violet-400" />
              Compose Broadcast
            </h2>

            <form onSubmit={handleBroadcast} className="space-y-6">
              <div className="space-y-2">
                <Label>Broadcast Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Campus Renovation Update"
                  className="bg-black/20 border-white/10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Message Content</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detailed announcement content..."
                  className="bg-black/20 border-white/10 min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-starlight focus:outline-none focus:border-violet-500/50"
                  >
                    <option value="campus">Campus</option>
                    <option value="club">Club</option>
                    <option value="official">Official</option>
                    <option value="event">Event</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="transport">Transport</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <div className="flex gap-1">
                    {["low", "medium", "high"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                          priority === p
                            ? "bg-violet-500/20 border-violet-500/50 text-violet-400"
                            : "bg-white/5 border-transparent text-starlight/40"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Campus Hub Banner (Optional)</Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
                <div className="flex gap-4 items-start">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-black/20 border-white/10 text-starlight h-12 hover:bg-white/10 flex-1"
                  >
                    Choose Poster File
                  </Button>
                  {imagePreview && (
                    <div className="relative w-24 h-12 rounded-xl overflow-hidden border border-white/10 group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-0 right-0 bg-black/60 p-0.5 rounded-bl-lg text-white/60 hover:text-white"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-starlight/20 italic">
                  High-priority news with posters will appear in the Hero
                  Slider.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Notification Type</Label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      {
                        id: "info",
                        color:
                          "bg-blue-500/10 border-blue-500/20 text-blue-400",
                      },
                      {
                        id: "alert",
                        color:
                          "bg-amber-500/10 border-amber-500/20 text-amber-400",
                      },
                      {
                        id: "success",
                        color:
                          "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                      },
                    ].map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setType(option.id)}
                        className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${
                          type === option.id
                            ? option.color
                            : "bg-white/5 border-transparent text-starlight/40 hover:bg-white/10"
                        }`}
                      >
                        {option.id.toUpperCase()}
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
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-all shadow-lg hover:shadow-violet-500/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                {sending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={16} /> Broadcast Signal
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: History List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-starlight flex items-center gap-2">
              <Clock size={18} className="text-starlight/40" />
              Recent Logs
            </h2>
            {notifications.length > 0 && (
              <span className="text-xs text-starlight/40">
                Last log:{" "}
                {new Date(notifications[0].created_at).toLocaleString()}
              </span>
            )}
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
                {(showAllLogs ? notifications : notifications.slice(0, 10)).map(
                  (notif) => (
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
                ),
                )}
              </div>
            )}

            {!showAllLogs && notifications.length > 10 && (
              <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                <button
                  onClick={() => setShowAllLogs(true)}
                  className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-starlight/70 text-[10px] font-bold uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
                >
                  Load More Logs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsManager;
