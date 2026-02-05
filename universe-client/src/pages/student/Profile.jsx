import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Download,
  FileText,
  Trophy,
  Zap,
  Clock,
  Book,
  Hash,
  Share2,
  Shield,
  Settings,
  LogOut,
  Bell,
  Link as LinkIcon,
  Github,
  Linkedin,
  Globe,
  User,
  X, // Added X icon
} from "lucide-react";
import { MOCK_STUDENT_PROFILE } from "@/data/mockStudent";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import EditProfileModal from "./EditProfileModal";
import SettingsModal from "./SettingsModal";
import RankAscension from "../../components/profile/RankAscension";
import CertificateUpload from "../../components/profile/CertificateUpload";

// --- SUB-COMPONENTS ---

// 1. Tag Component (Larger Size for Better Balance)
const DnaTag = ({ label }) => (
  <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-geist tracking-widest uppercase text-white/60 hover:border-fuchsia-500/50 hover:text-white hover:bg-fuchsia-500/10 transition-all cursor-default select-none">
    {label}
  </span>
);

// 2. Widget Card Wrapper (Darker Glass - 50% more opacity)
const WidgetCard = ({ title, icon: Icon, children, className }) => (
  <div
    className={cn(
      "p-6 rounded-[2rem] bg-black/60 backdrop-blur-lg border border-white/10 flex flex-col h-full hover:border-white/20 transition-colors shadow-2xl",
      className,
    )}
  >
    <div className="flex items-center gap-2 mb-4 text-white/40">
      {Icon && <Icon className="w-4 h-4 text-fuchsia-500" />}
      <h3 className="text-xs font-mono font-bold uppercase tracking-widest">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

// 3. XP Progress Bar (Holographic Teal/Gold)
const XpBar = ({ current, max }) => {
  const percentage = Math.min((current / max) * 100, 100);
  return (
    <div className="w-full max-w-[200px] space-y-1">
      <div className="flex justify-between text-[10px] font-mono text-emerald-300">
        <span>LVL {Math.floor(current / 100)}</span>
        <span>
          {current}/{max} XP
        </span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
        />
      </div>
    </div>
  );
};

// 4. Action Row (Simplified for Signal Center)
const ActionRow = ({ label, onClick, colorClass }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 p-3 rounded-xl border border-white/5 text-sm font-medium transition-all text-left",
      colorClass
        ? colorClass
        : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white",
    )}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

const Profile = () => {
  const navigate = useNavigate();
  // Initialize with mock data but try to fetch real user data if available
  const [student, setStudent] = useState(MOCK_STUDENT_PROFILE);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTab, setEditTab] = useState("identity");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState("account");
  const [showDisconnect, setShowDisconnect] = useState(false);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    // Check if we have a logged in user and fetch their latest data
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await fetch("http://localhost:5000/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const userData = await res.json();
            // Build profile from backend data, only use mock for structure fields
            setStudent({
              // Use backend data first, then mock structure
              name: userData.name || "Student",
              studentId: userData.student_id || "000000000",
              program: userData.program || MOCK_STUDENT_PROFILE.program,
              semester: userData.semester || MOCK_STUDENT_PROFILE.semester,

              // Images: Use backend or blank (never use mock URLs)
              avatar: userData.avatar || "",
              coverImage: userData.coverImage || "",

              // User-editable fields: Use backend or empty (never use mock data)
              bio: userData.bio || "",
              links: userData.links || {
                github: "",
                linkedin: "",
                website: "",
              },
              dna: userData.dna || [],
              assets: userData.assets || [],

              // XP/Merit: Use backend current_merit
              xp: userData.current_merit || 0,

              // Keep mock structure for display-only fields
              rank: MOCK_STUDENT_PROFILE.rank,
              maxXp: MOCK_STUDENT_PROFILE.maxXp,
              level: MOCK_STUDENT_PROFILE.level,
              loadout: MOCK_STUDENT_PROFILE.loadout,
              questLog: MOCK_STUDENT_PROFILE.questLog,
            });
            // Load certificates
            setCertificates(userData.assets || []);
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isEditOpen]); // Re-fetch when modal closes/saves

  const handleOpenEdit = (tab = "identity") => {
    setEditTab(tab);
    setIsEditOpen(true);
  };

  const handleSaveProfile = async (updatedData) => {
    // 1. Optimistic Update
    setStudent(updatedData);
    setIsEditOpen(false);

    // 2. Persist to Backend (only text fields, images are already uploaded via modal)
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: updatedData.name,
          bio: updatedData.bio,
          links: updatedData.links,
          dna: updatedData.dna,
          // avatar/cover/assets are handled separately in modal via upload endpoint
        }),
      });
    } catch (err) {
      console.error("Failed to save profile", err);
      // Optional: Revert optimistic update here if needed
    }
  };

  const handleOpenSettings = (tab) => {
    setSettingsTab(tab);
    setIsSettingsOpen(true);
  };

  const handleDisconnect = () => {
    // Basic Logout logic + Navigation
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-transparent w-full overflow-x-hidden pb-20 text-white font-sans selection:bg-fuchsia-500/30">
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={student}
        initialTab={editTab}
        onSave={handleSaveProfile}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialTab={settingsTab}
      />

      {/* Disconnect Confirmation Modal */}
      <AnimatePresence>
        {showDisconnect && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDisconnect(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 shadow-2xl z-10 text-center"
            >
              <h3 className="text-xl font-clash font-bold text-white mb-2">
                Disconnect?
              </h3>
              <p className="text-sm text-white/60 mb-6">
                Are you sure you want to sign out of the UniVerse network?
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDisconnect}
                  className="w-full py-3 rounded-xl border border-rose-500/50 text-rose-400 font-bold hover:bg-rose-500 hover:text-white transition-all"
                >
                  Sign Out
                </button>
                <button
                  onClick={() => setShowDisconnect(false)}
                  className="w-full py-3 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* WRAPPER FOR BANNER + AVATAR */}
        <div className="relative mb-6">
          {/* I. FLOATING ISLAND - COSMIC COVER */}
          <div className="relative w-full h-64 md:h-80 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-black/60 backdrop-blur-xl group/cover">
            {/* Abstract Nebula Background */}
            {student.coverImage && (
              <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
                style={{ backgroundImage: `url(${student.coverImage})` }}
              />
            )}

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

            {/* Edit Cover Button (Opens Modal - Visuals Tab) */}
            <button
              onClick={() => handleOpenEdit("visuals")}
              className="absolute bottom-6 right-6 p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all group z-30"
              title="Change Cover Photo"
            >
              <Camera className="w-5 h-5" />
              <span className="sr-only">Edit Cover</span>
            </button>
          </div>

          {/* II. THE PORTAL AVATAR (Fully Outside Banner) */}
          <div className="absolute -bottom-16 left-6 flex-shrink-0 group z-20">
            {/* Avatar Image with Eclipse Rim Light */}
            <div
              onClick={() => handleOpenEdit("visuals")}
              className="relative w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-[#0a0a0f] ring-1 ring-white/20 overflow-hidden bg-[#0a0a0f] shadow-2xl group cursor-pointer"
            >
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-fuchsia-600/20 to-purple-600/20">
                  <User className="w-16 h-16 text-white/40" />
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="w-8 h-8 text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* III. IDENTITY SECTION (Left-Aligned with Banner) */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end mb-12 mt-20">
          {/* Name & Meta (Glass Card - Left Aligned) */}
          <div className="w-full lg:w-auto lg:flex-1 lg:max-w-2xl px-6 py-5 rounded-[2rem] bg-black/60 backdrop-blur-lg border border-white/10 shadow-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-clash tracking-tight leading-tight bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent break-words">
              {student.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-geist text-slate-400">
              <span className="font-mono text-fuchsia-400">
                {student.studentId}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span>{student.program}</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-white/60 text-xs">
                {student.semester}
              </span>
            </div>
            {/* Mission Statement (Bio) */}
            {student.bio && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-white/80 text-sm italic leading-relaxed font-geist text-slate-300">
                  "{student.bio}"
                </p>
              </div>
            )}
          </div>

          {/* Right Side: Gamification + Actions */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Gamification Stats (Glass Pill) */}
            {/* Gamification Stats (Rank Ascension System) */}
            <RankAscension currentXP={student.xp} />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white/70 transition-colors shadow-xl">
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleOpenEdit("identity")}
                className="px-5 py-3 rounded-xl bg-fuchsia-600 text-white font-bold text-sm hover:bg-fuchsia-500 transition-all shadow-[0_4px_20px_rgba(192,38,211,0.3)]"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* IV. THE DASHBOARD GRID (3-Column Masonry) */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          {/* COLUMN 1: THE IDENTITY STACK (Left) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            {/* Widget 1: Student DNA (Larger Tags) */}
            <WidgetCard title="Student DNA" icon={Hash} className="h-full">
              <div className="flex flex-wrap gap-3">
                {student.dna.map((tag, idx) => (
                  <DnaTag key={idx} label={tag} />
                ))}
                <button
                  onClick={() => handleOpenEdit("identity")}
                  className="px-4 py-2 rounded-lg border-2 border-dashed border-white/30 text-sm text-white/50 hover:text-white hover:border-white/50 transition-colors font-geist tracking-widest uppercase"
                >
                  + Add Trait
                </button>
              </div>
            </WidgetCard>

            {/* Widget 5: Signal Center (Moved Here) */}
            <WidgetCard title="Signal Center" icon={Zap} className="h-full">
              {/* Social Uplinks */}
              {student.links && Object.values(student.links).some((l) => l) && (
                <div className="flex gap-2 mb-4 pb-4 border-b border-white/5">
                  {student.links.github && (
                    <a
                      href={student.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {student.links.linkedin && (
                    <a
                      href={student.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {student.links.website && (
                    <a
                      href={student.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <ActionRow
                  icon={Settings}
                  label="Account Settings"
                  onClick={() => handleOpenSettings("account")}
                />
                <ActionRow
                  icon={Shield}
                  label="Privacy & Data"
                  onClick={() => handleOpenSettings("privacy")}
                />
                <ActionRow
                  icon={Bell}
                  label="Notifications"
                  onClick={() => handleOpenSettings("notifications")}
                />
                <div className="pt-2">
                  <ActionRow
                    icon={LogOut}
                    label="Disconnect"
                    colorClass="text-rose-400 hover:bg-rose-500/10 border-rose-500/20"
                    onClick={() => setShowDisconnect(true)}
                  />
                </div>
              </div>
            </WidgetCard>
          </div>

          {/* COLUMN 2: THE ACADEMIC STACK (Center) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            {/* Widget 2: Current Loadout */}
            <WidgetCard title="Current Loadout" icon={Book}>
              <div className="space-y-3">
                {student.loadout.map((subject, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-mono text-fuchsia-400/80">
                        {subject.code}
                      </div>
                      <div className="text-sm font-medium text-white group-hover:text-fuchsia-200 transition-colors">
                        {subject.name}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        subject.status === "Active"
                          ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                          : "bg-slate-600",
                      )}
                    />
                  </div>
                ))}
              </div>
            </WidgetCard>

            {/* Widget 4: Quest Log (Constellation Timeline) */}
            <WidgetCard
              title="Quest Log // Timeline"
              icon={Clock}
              className="h-full"
            >
              <div className="relative pl-4 space-y-6">
                {/* Constellation Line (Pulsing Gradient) */}
                <motion.div
                  className="absolute left-[5px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {student.questLog.map((quest, idx) => (
                  <div key={idx} className="relative pl-8 group">
                    {/* Timeline Dot */}
                    <div className="absolute left-[-4px] top-1.5 w-5 h-5 rounded-full bg-[#0a0a0f] border border-fuchsia-500/30 flex items-center justify-center group-hover:border-fuchsia-500 transition-colors shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl hover:bg-white/5 transition-colors -mt-2">
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-fuchsia-300 transition-colors">
                          {quest.title}
                        </h4>
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                          {quest.date} • {quest.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        <Zap className="w-3 h-3" /> {quest.xp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </WidgetCard>
          </div>

          {/* COLUMN 3: THE ASSET VAULT (Right) */}
          <div className="w-full lg:w-1/3 h-full">
            {/* Widget 3: Decrypted Assets */}
            <WidgetCard
              title="Decrypted Assets"
              icon={FileText}
              className="h-full min-h-[500px]"
            >
              <div className="space-y-4">
                <CertificateUpload
                  onUploadSuccess={(assets) => setCertificates(assets)}
                  compact={certificates.length > 0} // Dynamic sizing
                />

                {certificates.length > 0 && (
                  <div className="pt-2">
                    {/* Removed border-t */}
                    {certificates.map((cert) => (
                      <div
                        key={cert._id}
                        className="w-full flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg mb-2 group hover:bg-white/10 transition-all"
                      >
                        {/* 1. Left Side (Info) */}
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded bg-fuchsia-500/20 text-fuchsia-400">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <h4 className="text-sm font-bold text-white leading-tight">
                              {cert.title}
                            </h4>
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mt-0.5 font-mono">
                              {new Date(cert.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* 2. Right Side (Actions) */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a
                            href={cert.url}
                            download
                            className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                            title="Download Asset"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            onClick={async () => {
                              if (confirm("Delete this certificate?")) {
                                try {
                                  const token = localStorage.getItem("token");
                                  const res = await fetch(
                                    `http://localhost:5000/api/users/profile/assets/${cert._id}`,
                                    {
                                      method: "DELETE",
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    },
                                  );
                                  if (res.ok) {
                                    const data = await res.json();
                                    setCertificates(data.assets);
                                    toast.success("Certificate deleted");
                                  }
                                } catch {
                                  toast.error("Failed to delete");
                                }
                              }
                            }}
                            className="p-2 rounded-lg hover:bg-rose-500/10 text-white/40 hover:text-rose-400 transition-colors"
                            title="Delete Asset"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </WidgetCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
