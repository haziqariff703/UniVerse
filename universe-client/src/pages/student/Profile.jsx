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
} from "lucide-react";

// Minimalist Card Component
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-neutral-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 ${className}`}
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
        <Loader2 className="w-8 h-8 text-starlight animate-spin" />
      </div>
    );
  }

  const SidebarItem = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        activeTab === id
          ? "bg-white/10 text-white"
          : "text-starlight/40 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      {activeTab === id && (
        <ChevronRight className="w-4 h-4 ml-auto text-starlight/50" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Section */}
          <div className="w-full lg:w-72 flex-shrink-0 space-y-6">
            {/* Profile Snapshot */}
            <Card className="flex flex-col items-center text-center p-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center mb-4 text-3xl font-bold text-white">
                {formData.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <h2 className="text-xl font-bold text-white mb-1">
                {formData.name}
              </h2>
              <p className="text-sm text-starlight/40 mb-4 capitalize">
                {formData.role}
              </p>

              <div className="flex gap-2 mb-2">
                {formData.socialLinks.linkedin && (
                  <a
                    href={formData.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 hover:text-blue-400 rounded-full transition-colors text-starlight/40"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {formData.socialLinks.instagram && (
                  <a
                    href={formData.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 hover:text-pink-400 rounded-full transition-colors text-starlight/40"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {formData.socialLinks.tiktok && (
                  <a
                    href={formData.socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 hover:text-white rounded-full transition-colors text-starlight/40"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </Card>

            {/* Navigation */}
            <div className="space-y-1">
              <SidebarItem id="overview" label="Overview" icon={Grid} />
              <SidebarItem id="events" label="My Events" icon={Calendar} />
              <SidebarItem id="settings" label="Settings" icon={Settings} />
            </div>

            {/* Sign Out (Example) */}
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {activeTab === "overview" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <div className="flex items-center gap-3 mb-4 text-starlight/60">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Email Address
                          </span>
                        </div>
                        <p className="text-lg text-white font-medium">
                          {formData.email}
                        </p>
                      </Card>
                      <Card className="p-6">
                        <div className="flex items-center gap-3 mb-4 text-starlight/60">
                          <IdCard className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Student ID
                          </span>
                        </div>
                        <p className="text-lg text-white font-medium">
                          {formData.student_id}
                        </p>
                      </Card>
                    </div>

                    <Card>
                      <h3 className="text-lg font-semibold text-white mb-6">
                        Recent Activity
                      </h3>
                      <div className="text-center py-12 text-starlight/20">
                        <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No recent activity</p>
                      </div>
                    </Card>
                  </>
                )}

                {activeTab === "events" && (
                  <Card className="min-h-[400px] flex flex-col items-center justify-center text-center">
                    <Calendar className="w-12 h-12 text-starlight/20 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No events found
                    </h3>
                    <p className="text-starlight/40 max-w-sm">
                      You haven't registered for any events yet. Check out the
                      Events page to explore!
                    </p>
                  </Card>
                )}

                {activeTab === "settings" && (
                  <div className="space-y-6">
                    {error && (
                      <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-300 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-300 text-sm">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        {success}
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <Card className="space-y-8">
                        {/* Profile Details */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white">
                            Profile Details
                          </h3>
                          <div className="grid gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-medium text-starlight/40 uppercase tracking-wide">
                                Display Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="h-px bg-white/5" />

                        {/* Social Links */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white">
                            Social Links
                          </h3>
                          <div className="grid gap-4">
                            <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                                <Linkedin className="w-5 h-5 text-starlight/60" />
                              </div>
                              <input
                                type="url"
                                name="social_linkedin"
                                value={formData.socialLinks.linkedin}
                                onChange={handleChange}
                                placeholder="LinkedIn Profile URL"
                                className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-starlight/20"
                              />
                            </div>
                            <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                                <Instagram className="w-5 h-5 text-starlight/60" />
                              </div>
                              <input
                                type="url"
                                name="social_instagram"
                                value={formData.socialLinks.instagram}
                                onChange={handleChange}
                                placeholder="Instagram Profile URL"
                                className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-starlight/20"
                              />
                            </div>
                            <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                                <LinkIcon className="w-5 h-5 text-starlight/60" />
                              </div>
                              <input
                                type="url"
                                name="social_tiktok"
                                value={formData.socialLinks.tiktok}
                                onChange={handleChange}
                                placeholder="TikTok Profile URL"
                                className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-starlight/20"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="h-px bg-white/5" />

                        {/* Security */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-white">
                            Security
                          </h3>
                          <div className="grid gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-medium text-starlight/40 uppercase tracking-wide">
                                New Password
                              </label>
                              <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Enter new password to change"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-starlight/20"
                              />
                            </div>
                            {formData.newPassword && (
                              <div className="space-y-2">
                                <label className="text-xs font-medium text-starlight/40 uppercase tracking-wide">
                                  Current Password
                                </label>
                                <input
                                  type="password"
                                  name="currentPassword"
                                  value={formData.currentPassword}
                                  onChange={handleChange}
                                  placeholder="Confirm with current password"
                                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-starlight/20"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-4">
                          <button
                            type="submit"
                            disabled={saving}
                            className="px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-starlight transition-colors disabled:opacity-50 flex items-center gap-2"
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
  );
};

export default Profile;
