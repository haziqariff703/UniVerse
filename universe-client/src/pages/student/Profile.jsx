import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Shield,
  Bell,
  LogOut,
  Edit2,
  Lock,
  Zap,
  ArrowRight,
  Link as LinkIcon,
  Calendar,
  CreditCard,
  User,
  X,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Linkedin,
  Instagram,
} from "lucide-react";
import MissionHistoryCard from "@/components/student/MissionHistoryCard";
import { PAST_EVENTS } from "@/data/mockEvents";

// --- SUB-COMPONENTS ---

// 1. Radial Merit Gauge with Motivation
const RadialGauge = ({ value, max }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div className="absolute inset-0 bg-fuchsia-500/10 blur-3xl rounded-full" />
        <svg className="w-full h-full transform -rotate-90 drop-shadow-xl">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke="url(#merit-gradient-small)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
          />
          <defs>
            <linearGradient
              id="merit-gradient-small"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black font-clash text-white">
            {value}
          </span>
          <span className="text-[10px] font-mono text-white/50">
            / {max} XP
          </span>
        </div>
      </div>
      <p className="text-[10px] font-mono text-fuchsia-300/80 animate-pulse uppercase tracking-wider">
        🔥 {max - value} XP to Cosmic Elite
      </p>
    </div>
  );
};

// 2. Action Row with Badge Support
const ActionRow = ({
  icon: Icon,
  label,
  onClick,
  badge,
  colorClass = "text-slate-400 group-hover:text-white",
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/5 hover:border-white/10 transition-all group"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-black/20 text-white/70 group-hover:text-white transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      <span className={`text-sm font-medium ${colorClass} transition-colors`}>
        {label}
      </span>
    </div>
    <div className="flex items-center gap-3">
      {badge && (
        <span className="px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 text-[10px] font-bold uppercase tracking-wider border border-fuchsia-500/20">
          {badge}
        </span>
      )}
      <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-white/60 transition-colors" />
    </div>
  </button>
);

// 3. EDIT PROFILE MODAL
const EditProfileModal = ({
  isOpen,
  onClose,
  user,
  onUpdate,
  initialTab = "profile",
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    student_id: user?.student_id || "",
    socialLinks: user?.socialLinks || {
      linkedin: "",
      instagram: "",
      tiktok: "",
    },
    currentPassword: "",
    newPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setActiveTab(initialTab);
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        student_id: user.student_id,
        socialLinks: user.socialLinks || {
          linkedin: "",
          instagram: "",
          tiktok: "",
        },
      }));
    }
  }, [user, initialTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("social_")) {
      const key = name.replace("social_", "");
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      onUpdate(updatedUser);
      setSuccess("Changes saved successfully.");
      if (formData.newPassword) {
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
        }));
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <h2 className="text-xl font-bold font-clash text-white">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-48 bg-black/20 border-r border-white/5 p-4 space-y-2 hidden md:block">
            {[
              { id: "profile", label: "General", icon: User },
              { id: "socials", label: "Social Links", icon: LinkIcon },
              { id: "security", label: "Security", icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? "bg-white/10 text-white" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-black/40">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {success}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === "profile" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-slate-500">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-slate-500">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={formData.student_id}
                      disabled
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-slate-500">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              )}
              {activeTab === "socials" && (
                <div className="space-y-4">
                  {["linkedin", "instagram", "tiktok"].map((platform) => (
                    <div key={platform} className="space-y-2">
                      <label className="text-xs font-mono uppercase text-slate-500 flex items-center gap-2">
                        {platform === "linkedin" && (
                          <Linkedin className="w-3 h-3" />
                        )}
                        {platform} URL
                      </label>
                      <input
                        type="text"
                        name={`social_${platform}`}
                        value={formData.socialLinks[platform]}
                        onChange={handleChange}
                        placeholder={`https://${platform}.com/...`}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 outline-none transition-colors placeholder:text-slate-600"
                      />
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "security" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-slate-500">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 outline-none transition-colors"
                    />
                  </div>
                  {formData.newPassword && (
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-slate-500">
                        Confirm Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-fuchsia-500 outline-none transition-colors"
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-fuchsia-600 text-white font-bold text-sm hover:bg-fuchsia-500 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// 4. MAIN PROFILE COMPONENT
const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState("profile");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const openModal = (tab) => {
    setModalInitialTab(tab);
    setIsEditModalOpen(true);
  };

  const meritPoints = 750;
  const nextRank = 1000;
  const historyEvents = PAST_EVENTS.map((e) => ({
    ...e,
    overallScore: (Math.random() * 2 + 8).toFixed(1),
    comment: "No comment",
  }));
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-transparent w-full overflow-x-hidden relative pb-20">
      {/* Background Aurora Removed as per user request for full black immersive mode */}

      {/* BACKGROUND CONTRAST OVERLAY */}
      <div className="fixed inset-0 bg-black/40 z-0 pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-6 pt-12 space-y-8"
      >
        {/* SECTION 1: COMPACT HERO IDENTITY (GLASS ISLAND) */}
        <motion.div
          variants={itemVariants}
          className="w-full flex flex-col md:flex-row items-center justify-between p-6 md:p-8 rounded-[2.5rem] bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/10 shadow-2xl gap-6"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 blur opacity-40 group-hover:opacity-75 transition duration-500" />
              <div className="relative w-24 h-24 rounded-full p-[2px] bg-gradient-to-t from-white/20 to-transparent">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                  <span className="text-3xl font-black text-white">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-black border border-white/20 flex items-center justify-center text-fuchsia-400">
                <Shield className="w-4 h-4 fill-current" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black font-clash text-white tracking-tight mb-2 drop-shadow-md">
                {user?.name || "Student Name"}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-xs font-mono text-slate-400">
                <span className="px-2 py-1 rounded bg-white/5 border border-white/5 text-white">
                  ID: {user?.student_id || "7209341"}
                </span>
                <span>Computer Science</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span>Sem 04</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => openModal("profile")}
            className="px-6 py-3 rounded-full border border-fuchsia-500/50 hover:border-fuchsia-500 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-300 hover:text-white transition-all text-sm font-bold font-clash shadow-[0_0_15px_rgba(217,70,239,0.1)] hover:shadow-[0_0_20px_rgba(217,70,239,0.3)]"
          >
            Edit Profile
          </button>
        </motion.div>

        {/* SECTION 2: COMMAND GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-[2.5rem] bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group"
          >
            <div className="text-center z-10 mb-4">
              <span className="text-[10px] font-mono text-fuchsia-400 uppercase tracking-widest">
                Current Rank
              </span>
              <h2 className="text-2xl font-black font-clash text-white mt-1 group-hover:text-fuchsia-200 transition-colors drop-shadow-lg">
                RISING STAR
              </h2>
            </div>
            <div className="scale-90 opacity-90 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
              <RadialGauge value={meritPoints} max={nextRank} />
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-8 rounded-[2.5rem] bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-white/60 mb-2">
                  <Calendar className="w-4 h-4" />{" "}
                  <span className="text-xs font-mono uppercase tracking-widest">
                    Events Joined
                  </span>
                </div>
                <div className="text-4xl font-black font-clash text-white drop-shadow-sm">
                  12
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-white/60 mb-2">
                  <Zap className="w-4 h-4 text-amber-400" />{" "}
                  <span className="text-xs font-mono uppercase tracking-widest">
                    Active Score
                  </span>
                </div>
                <div className="text-4xl font-black font-clash text-white drop-shadow-sm">
                  850{" "}
                  <span className="text-lg text-white/40 font-medium">pts</span>
                </div>
                {/* UPGRADE: Context Tag */}
                <div className="mt-2 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded inline-block border border-emerald-500/20">
                  ↑ Top 15% of Cohort
                </div>
              </div>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 w-[85%]" />
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-6 rounded-[2.5rem] bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col gap-3"
          >
            <h3 className="text-sm font-bold font-clash text-white ml-2 mb-1">
              Quick Settings
            </h3>
            {/* UPGRADE: Notification Badge */}
            <ActionRow
              icon={Bell}
              label="Notifications"
              onClick={() => navigate("/notifications")}
              badge="2 New"
            />
            <ActionRow
              icon={LinkIcon}
              label="Linked Accounts"
              onClick={() => openModal("socials")}
            />
            <ActionRow
              icon={Lock}
              label="Security"
              onClick={() => openModal("security")}
            />

            {/* UPGRADE: Muted Sign Out */}
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
              }}
              className="mt-auto w-full p-4 rounded-2xl text-slate-500 text-xs font-bold font-mono uppercase tracking-widest transition-all hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 flex items-center justify-center gap-2"
            >
              Sign Out <LogOut className="w-3 h-3" />
            </button>
          </motion.div>
        </div>

        {/* SECTION 3: HISTORY STREAM */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* UPGRADE: Section Header */}
          <div className="flex items-center justify-between ml-2">
            <h2 className="text-xl font-bold font-clash text-white flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-white/50" /> Recent Activity
            </h2>
            <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">
              THIS SEMESTER
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="border border-white/5 rounded-[2rem] overflow-hidden hover:border-white/20 transition-all"
              >
                <MissionHistoryCard event={event} onClick={() => {}} />
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            user={user}
            onUpdate={handleUpdateUser}
            initialTab={modalInitialTab}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
