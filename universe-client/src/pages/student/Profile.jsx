import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Save,
  AlertCircle,
  Loader2,
  CheckCircle,
  IdCard,
  Shield,
  Sparkles,
  ArrowLeft,
  Linkedin,
  Instagram,
  Link as LinkIcon,
  MapPin,
  Calendar,
  Grid,
  Settings,
  Clock,
  LogOut,
  ChevronRight,
  Zap,
  Briefcase,
  Users,
} from "lucide-react";
import { Navbar07 } from "@/components/ui/shadcn-io/navbar-07";
import Lanyard from "@/components/ui/Lanyard";
import StatCard from "@/components/profile/StatCard";

// Minimalist Card Component for inner content
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    student_id: "",
    role: "",
    currentPassword: "",
    newPassword: "",
    preferences: [],
    socialLinks: {
      linkedin: "",
      instagram: "",
      tiktok: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Mock Stats (In a real app, these would come from the API)
  const stats = [
    { label: "Events Joined", value: "12", icon: Calendar },
    { label: "Active Score", value: "850", progress: 85, icon: Zap },
    { label: "Club Interviews", value: "3", suffix: "Pending", icon: Users },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setFormData({
          name: data.name || "",
          email: data.email || "",
          student_id: data.student_id || "",
          role: data.role || "student",
          currentPassword: "",
          newPassword: "",
          preferences: data.preferences || [],
          socialLinks: {
            linkedin: data.socialLinks?.linkedin || "",
            instagram: data.socialLinks?.instagram || "",
            tiktok: data.socialLinks?.tiktok || "",
          },
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    if (e.target.name.startsWith("social_")) {
      const socialKey = e.target.name.replace("social_", "");
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [socialKey]: e.target.value,
        },
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const updateData = {
        name: formData.name,
        preferences: formData.preferences,
        socialLinks: formData.socialLinks,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      storedUser.name = data.user.name;
      localStorage.setItem("user", JSON.stringify(storedUser));
      window.dispatchEvent(new Event("authChange"));

      setSuccess("Profile updated successfully!");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  const SidebarItem = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        activeTab === id
          ? "bg-accent text-accent-foreground border border-border/50"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      {activeTab === id && (
        <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground/50" />
      )}
    </button>
  );

  const profileTabs = [
    { id: "overview", label: "Overview", icon: Grid },
    { id: "events", label: "My Events", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation specifically for Profile */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <Navbar07
          logo={
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-5 h-5 text-primary" />
              </div>
              <span>My Profile</span>
            </div>
          }
          tabs={profileTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userName={formData.name}
          userEmail={formData.email}
          userAvatar={null}
          onSignOut={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }}
          className="border-none bg-transparent"
        />
      </div>

      <div className="py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* LEFT COLUMN: Lanyard Only */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-center">
              <div className="relative w-full z-10 lg:sticky lg:top-24 h-[500px] lg:h-[650px] pointer-events-none">
                <div className="absolute inset-0 pointer-events-auto">
                  <Lanyard>
                    <div className="w-full h-full bg-[#1a1a2e] text-white p-6 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden">
                      {/* Decor */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10" />

                      {/* Header */}
                      <div className="w-full flex justify-between items-start z-10">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/10">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                          </div>
                          <span className="font-bold tracking-[0.2em] text-[10px] opacity-60">
                            UNIVERSE
                          </span>
                        </div>
                        <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold uppercase border border-emerald-500/30 flex items-center gap-1 backdrop-blur-md">
                          <Shield className="w-3 h-3" />
                          Verified
                        </div>
                      </div>

                      {/* Profile Info */}
                      <div className="flex flex-col items-center gap-5 my-4 z-10 w-full">
                        <div className="w-32 h-32 rounded-[2rem] p-1.5 relative bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/20">
                          <div className="w-full h-full rounded-[1.7rem] bg-[#0f0f1b] flex items-center justify-center text-5xl font-black text-white overflow-hidden relative">
                            {/* If image exists, use it, else initial */}
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/50 to-indigo-600/50 mix-blend-overlay" />
                            {formData.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-violet-600 rounded-full border-[6px] border-[#1a1a2e] flex items-center justify-center shadow-sm">
                            <CheckCircle className="w-5 h-5 fill-current" />
                          </div>
                        </div>
                        <div className="text-center w-full">
                          <h2 className="text-3xl font-black tracking-tight leading-none mb-2 truncate px-2">
                            {formData.name || "Student"}
                          </h2>
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-mono text-white/70">
                            {formData.role || "Developer"}
                          </div>
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="w-full space-y-3 z-10">
                        {/* Socials Row inside card */}
                        <div className="flex justify-center gap-3">
                          {Object.entries(formData.socialLinks).map(
                            ([key, url]) =>
                              url && (
                                <div
                                  key={key}
                                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5"
                                >
                                  {key === "linkedin" && (
                                    <Linkedin className="w-4 h-4 text-white/70" />
                                  )}
                                  {key === "instagram" && (
                                    <Instagram className="w-4 h-4 text-white/70" />
                                  )}
                                  {key === "tiktok" && (
                                    <LinkIcon className="w-4 h-4 text-white/70" />
                                  )}
                                </div>
                              ),
                          )}
                        </div>

                        <div className="p-3 bg-black/20 rounded-xl border border-white/5 backdrop-blur-sm">
                          <div className="flex justify-between items-center text-[10px] opacity-40 uppercase font-bold tracking-wider mb-1">
                            <span>Student ID</span>
                            <span>UniVerse 2026</span>
                          </div>
                          <div className="font-mono text-xl tracking-widest text-center opacity-90">
                            {formData.student_id || "7209341"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Lanyard>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Dashboard & Content */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 pt-0">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                  <StatCard key={i} {...stat} />
                ))}
              </div>

              {/* Main Tab Content */}
              {/* No Sidebar logic anymore, strictly Navbar driven */}
              <div className="w-full min-h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {activeTab === "overview" && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              Email Address
                            </p>
                            <p className="font-medium text-foreground">
                              {formData.email}
                            </p>
                          </div>
                          <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              Role
                            </p>
                            <p className="font-medium text-foreground capitalize">
                              {formData.role}
                            </p>
                          </div>
                        </div>

                        <Card>
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-foreground">
                              Recent Activity
                            </h3>
                            <button className="text-xs text-primary hover:underline">
                              View All
                            </button>
                          </div>
                          <div className="text-center py-10">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                              <Clock className="w-6 h-6 text-muted-foreground/50" />
                            </div>
                            <p className="text-muted-foreground text-sm">
                              No recent activity to show.
                            </p>
                          </div>
                        </Card>
                      </div>
                    )}

                    {activeTab === "events" && (
                      <Card className="min-h-[300px] flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-4 animate-pulse">
                          <Calendar className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          No events found
                        </h3>
                        <p className="text-muted-foreground max-w-sm text-sm">
                          You haven't registered for any events yet. Check out
                          the Events page to explore!
                        </p>
                        <button
                          className="mt-6 px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
                          onClick={() => navigate("/events")}
                        >
                          Browse Events
                        </button>
                      </Card>
                    )}

                    {activeTab === "settings" && (
                      <div className="space-y-6">
                        {error && (
                          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                          </div>
                        )}
                        {success && (
                          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-sm">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            {success}
                          </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                          {/* Profile Details */}
                          <Card className="space-y-6">
                            <div className="flex items-center gap-2 pb-4 border-b border-border">
                              <User className="w-4 h-4 text-primary" />
                              <h3 className="font-semibold text-foreground">
                                Personal Details
                              </h3>
                            </div>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  Display Name
                                </label>
                                <input
                                  type="text"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-all focus:ring-1 focus:ring-primary/20"
                                />
                              </div>
                            </div>
                          </Card>

                          {/* Social Links */}
                          <Card className="space-y-6">
                            <div className="flex items-center gap-2 pb-4 border-b border-border">
                              <Briefcase className="w-4 h-4 text-primary" />
                              <h3 className="font-semibold text-foreground">
                                Social Links
                              </h3>
                            </div>
                            <div className="grid gap-4">
                              {["linkedin", "instagram", "tiktok"].map(
                                (platform) => (
                                  <div key={platform} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 border border-border">
                                      {platform === "linkedin" && (
                                        <Linkedin className="w-5 h-5 text-muted-foreground" />
                                      )}
                                      {platform === "instagram" && (
                                        <Instagram className="w-5 h-5 text-muted-foreground" />
                                      )}
                                      {platform === "tiktok" && (
                                        <LinkIcon className="w-5 h-5 text-muted-foreground" />
                                      )}
                                    </div>
                                    <input
                                      type="url"
                                      name={`social_${platform}`}
                                      value={formData.socialLinks[platform]}
                                      onChange={handleChange}
                                      placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                                      className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-all focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/50"
                                    />
                                  </div>
                                ),
                              )}
                            </div>
                          </Card>

                          {/* Security */}
                          <Card className="space-y-6">
                            <div className="flex items-center gap-2 pb-4 border-b border-border">
                              <Shield className="w-4 h-4 text-primary" />
                              <h3 className="font-semibold text-foreground">
                                Security
                              </h3>
                            </div>
                            <div className="grid gap-6">
                              <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  New Password
                                </label>
                                <input
                                  type="password"
                                  name="newPassword"
                                  value={formData.newPassword}
                                  onChange={handleChange}
                                  placeholder="Enter new password to change"
                                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-primary/20"
                                />
                              </div>
                              {formData.newPassword && (
                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Current Password
                                  </label>
                                  <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm with current password"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-primary/20"
                                  />
                                </div>
                              )}
                            </div>

                            <div className="pt-4 flex justify-end">
                              <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/25"
                              >
                                {saving ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Save className="w-4 h-4" />
                                )}
                                Save Changes
                              </button>
                            </div>
                          </Card>
                        </form>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
