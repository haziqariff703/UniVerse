import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

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
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const getRoleBadge = (role) => {
    const badges = {
      admin: { bg: "from-rose-500 to-orange-500", label: "Admin" },
      organizer: { bg: "from-emerald-500 to-teal-500", label: "Organizer" },
      student: { bg: "from-violet-500 to-indigo-500", label: "Student" },
      staff: { bg: "from-amber-500 to-yellow-500", label: "Staff" },
    };
    return badges[role] || badges.student;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-violet-500/20" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-16 h-16 rounded-full border-2 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent"
            />
          </div>
          <span className="text-starlight/40 text-sm">Loading profile...</span>
        </motion.div>
      </div>
    );
  }

  const badge = getRoleBadge(formData.role);

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-starlight/40 hover:text-starlight transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back</span>
        </motion.button>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center gap-6 mb-10"
        >
          {/* Avatar */}
          <div className="relative group">
            <div
              className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${badge.bg} p-0.5 shadow-2xl`}
            >
              <div className="w-full h-full rounded-2xl bg-black/80 backdrop-blur flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {formData.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </div>
            <div
              className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-lg bg-gradient-to-r ${badge.bg} text-[10px] font-bold text-white uppercase tracking-wider shadow-lg`}
            >
              {badge.label}
            </div>
          </div>

          {/* Info */}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white mb-1">
              {formData.name}
            </h1>
            <p className="text-starlight/40 text-sm">{formData.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <IdCard className="w-3.5 h-3.5 text-starlight/30" />
              <span className="text-xs text-starlight/30">
                {formData.student_id}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-8">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "security", label: "Security", icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white/10 text-white"
                  : "text-starlight/40 hover:text-starlight/60"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Alerts */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span className="text-sm text-rose-300">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-sm text-emerald-300">{success}</span>
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === "profile" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {activeTab === "profile" && (
            <>
              {/* Name Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-starlight/60">
                  <Sparkles className="w-3.5 h-3.5" />
                  Display Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-starlight/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all"
                  required
                />
              </div>

              {/* Email Field (Disabled) */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-starlight/60">
                  <Mail className="w-3.5 h-3.5" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3.5 text-starlight/30 cursor-not-allowed"
                />
                <p className="text-xs text-starlight/20">
                  Email cannot be changed
                </p>
              </div>
            </>
          )}

          {activeTab === "security" && (
            <>
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl mb-2">
                <p className="text-sm text-amber-300/80">
                  Leave password fields blank to keep your current password.
                </p>
              </div>

              {/* Current Password */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-starlight/60">
                  <Lock className="w-3.5 h-3.5" />
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-starlight/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all"
                />
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-starlight/60">
                  <Shield className="w-3.5 h-3.5" />
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  minLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-starlight/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all"
                />
                <p className="text-xs text-starlight/20">
                  Minimum 6 characters
                </p>
              </div>
            </>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: saving ? 1 : 1.01 }}
            whileTap={{ scale: saving ? 1 : 0.99 }}
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-4 rounded-xl font-semibold shadow-xl shadow-violet-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default Profile;
