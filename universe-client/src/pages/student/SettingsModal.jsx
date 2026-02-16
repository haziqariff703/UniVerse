import { API_BASE, API_URL } from "@/config/api";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Shield,
  Bell,
  X,
  Lock,
  Mail,
  Smartphone,
  Eye,
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// --- SUB-COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left group relative overflow-hidden",
      isActive
        ? "bg-fuchsia-600 text-white shadow-[0_0_20px_rgba(192,38,211,0.4)] border border-fuchsia-500/50"
        : "text-white/40 hover:text-white hover:bg-white/5",
    )}
  >
    {isActive && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 opacity-100 -z-10"
      />
    )}
    <Icon
      className={cn(
        "w-4 h-4 z-10",
        isActive ? "text-white" : "group-hover:text-fuchsia-400",
      )}
    />
    <span className="z-10">{label}</span>
  </button>
);

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={cn(
      "relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:ring-offset-2 focus:ring-offset-black flex-shrink-0",
      enabled ? "bg-fuchsia-600" : "bg-white/10",
    )}
  >
    <span
      className={cn(
        "absolute top-0.5 left-0.5 inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg",
        enabled ? "translate-x-5" : "translate-x-0",
      )}
    />
  </button>
);

// --- CONTENT TABS ---

const AccountTab = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++; // Length
    if (/[A-Z]/.test(pass)) score++; // Uppercase
    if (/[0-9]/.test(pass)) score++; // Number
    if (/[^A-Za-z0-9]/.test(pass)) score++; // Symbol
    return score; // Max 4
  };

  const strength = calculateStrength(newPassword);

  const handlePasswordUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL + "/users/security/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: password,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password updated successfully!");
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Failed to update password.");
      }
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecoveryEmailSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL + "/users/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recoveryEmail }),
      });

      if (res.ok) {
        toast.success("Recovery email saved!");
      }
    } catch (error) {
      console.error("Recovery email error:", error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div>
        <h3 className="text-xl font-clash font-bold text-white mb-1">
          Security & Login
        </h3>
        <p className="text-white/40 text-sm font-geist">
          Manage your credentials and security protocols.
        </p>
      </div>

      {/* Password Form */}
      <div className="space-y-4">
        <label className="block text-xs font-mono text-fuchsia-400 uppercase tracking-widest">
          Password Update
        </label>

        <div className="space-y-3">
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-fuchsia-500 transition-colors" />
            <input
              type="password"
              placeholder="Current Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-fuchsia-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-fuchsia-500 transition-colors" />
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white text-sm focus:outline-none focus:border-fuchsia-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              {showNewPassword ? (
                <Eye className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Strength Meter */}
          {newPassword && (
            <div className="flex gap-1 h-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={cn(
                    "h-full flex-1 rounded-full transition-all duration-300",
                    strength >= level
                      ? strength < 3
                        ? "bg-rose-500"
                        : strength === 3
                          ? "bg-yellow-500"
                          : "bg-emerald-500"
                      : "bg-white/10",
                  )}
                />
              ))}
            </div>
          )}

          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-fuchsia-500 transition-colors" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-white text-sm focus:outline-none focus:border-fuchsia-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              {showConfirmPassword ? (
                <Eye className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          onClick={handlePasswordUpdate}
          disabled={
            !newPassword ||
            newPassword !== confirmPassword ||
            strength < 3 ||
            loading
          }
          className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 font-bold text-sm disabled:cursor-not-allowed hover:bg-fuchsia-600 hover:text-white hover:border-fuchsia-500 transition-all disabled:hover:bg-white/5 disabled:hover:text-white/40"
        >
          {loading ? "Updating..." : "Update Credentials"}
        </button>
      </div>

      {/* Recovery */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <label className="block text-xs font-mono text-fuchsia-400 uppercase tracking-widest">
          Recovery Options
        </label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-fuchsia-500 transition-colors" />
          <input
            type="email"
            placeholder="Personal Gmail (for recovery)"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
            onBlur={handleRecoveryEmailSave}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-fuchsia-500/50 focus:bg-white/10 transition-all placeholder:text-white/20"
          />
        </div>
      </div>

      {/* 2FA */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-fuchsia-500/20 text-fuchsia-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Two-Factor Authentication
            </h4>
            <p className="text-xs text-white/40">
              Secure your account with 2FA.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {twoFactor && (
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
              ACTIVE
            </span>
          )}
          <Toggle enabled={twoFactor} onChange={setTwoFactor} />
        </div>
      </div>
    </div>
  );
};

const PrivacyTab = () => {
  const [visibility, setVisibility] = useState("campus");
  const [searchable, setSearchable] = useState(true);
  const [readReceipts, setReadReceipts] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(API_URL + "/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.settings?.privacy) {
          setVisibility(data.settings.privacy.visibility || "campus");
          setSearchable(data.settings.privacy.searchable ?? true);
          setReadReceipts(data.settings.privacy.readReceipts ?? false);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const updatePrivacySetting = async (field, value) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(API_URL + "/users/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          privacy: { [field]: value },
        }),
      });
      toast.success("Settings saved!");
    } catch (error) {
      console.error("Failed to update setting:", error);
      toast.error("Failed to save settings.");
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL + "/users/data/export", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "student_data.json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast.success("Data exported successfully!");
      } else {
        toast.error("Failed to export data.");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("An error occurred during export.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h3 className="text-xl font-clash font-bold text-white mb-1">
          Privacy & Data
        </h3>
        <p className="text-white/40 text-sm font-geist">
          Control your digital footprint and data access.
        </p>
      </div>

      {/* Profile Visibility */}
      <div className="space-y-4">
        <label className="block text-xs font-mono text-fuchsia-400 uppercase tracking-widest">
          Profile Visibility
        </label>
        <div className="grid grid-cols-3 gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
          {["public", "campus", "ghost"].map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setVisibility(mode);
                updatePrivacySetting("visibility", mode);
              }}
              className={cn(
                "py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                visibility === mode
                  ? "bg-fuchsia-600 text-white shadow-lg"
                  : "text-white/40 hover:text-white hover:bg-white/5",
              )}
            >
              {mode}
            </button>
          ))}
        </div>
        <p className="text-xs text-white/40 flex items-center gap-2">
          <AlertCircle className="w-3 h-3 text-fuchsia-500" />
          {visibility === "ghost"
            ? "You are completely invisible. No one can find your profile."
            : visibility === "campus"
              ? "Only confirmed students can view your full profile."
              : "Your profile is visible to everyone on UniVerse."}
        </p>
      </div>

      {/* Toggles */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-white/40" />
            <div>
              <span className="block text-sm text-white">Searchability</span>
              <span className="block text-xs text-white/30">
                Appear in student directory
              </span>
            </div>
          </div>
          <Toggle
            enabled={searchable}
            onChange={(val) => {
              setSearchable(val);
              updatePrivacySetting("searchable", val);
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-4 h-4 text-white/40" />
            <div>
              <span className="block text-sm text-white">Read Receipts</span>
              <span className="block text-xs text-white/30">
                Notify others when I view them
              </span>
            </div>
          </div>
          <Toggle
            enabled={readReceipts}
            onChange={(val) => {
              setReadReceipts(val);
              updatePrivacySetting("readReceipts", val);
            }}
          />
        </div>
      </div>

      {/* Data Export */}
      <div className="pt-4 border-t border-white/5">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10 text-white/60 hover:text-white transition-all group"
        >
          {exporting ? (
            <span className="animate-pulse">Exporting JSON...</span>
          ) : (
            <>
              <Download className="w-4 h-4 group-hover:text-fuchsia-400" />
              <span>Download My Data</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const NotificationsTab = () => {
  const [mentions, setMentions] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [announcements, setAnnouncements] = useState(true);
  const [digest, setDigest] = useState("weekly");

  // Load settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(API_URL + "/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.settings?.notifications) {
          setMentions(data.settings.notifications.mentions ?? true);
          setReminders(data.settings.notifications.reminders ?? true);
          setAnnouncements(data.settings.notifications.announcements ?? true);
          setDigest(data.settings.notifications.emailDigest || "weekly");
        }
      } catch (error) {
        console.error("Failed to load notification settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const updateNotificationSetting = async (field, value) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(API_URL + "/users/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          notifications: { [field]: value },
        }),
      });
      toast.success("Settings saved!");
    } catch (error) {
      console.error("Failed to update notification setting:", error);
      toast.error("Failed to save settings.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h3 className="text-xl font-clash font-bold text-white mb-1">
          Notifications
        </h3>
        <p className="text-white/40 text-sm font-geist">
          Manage communication frequencies.
        </p>
      </div>

      {/* Push Prefs */}
      <div className="space-y-4">
        <label className="block text-xs font-mono text-fuchsia-400 uppercase tracking-widest">
          Push Preferences
        </label>

        {[
          {
            label: "Mentions",
            sub: "When someone tags you",
            state: mentions,
            set: setMentions,
          },
          {
            label: "Event Reminders",
            sub: "1 hour before mission start",
            state: reminders,
            set: setReminders,
          },
          {
            label: "Announcements",
            sub: "Global server broadcasts",
            state: announcements,
            set: setAnnouncements,
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div>
              <div className="text-sm font-medium text-white">{item.label}</div>
              <div className="text-xs text-white/40">{item.sub}</div>
            </div>
            <Toggle
              enabled={item.state}
              onChange={(val) => {
                item.set(val);
                const fieldMap = {
                  Mentions: "mentions",
                  "Event Reminders": "reminders",
                  Announcements: "announcements",
                };
                updateNotificationSetting(fieldMap[item.label], val);
              }}
            />
          </div>
        ))}
      </div>

      {/* Email Digest */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <label className="block text-xs font-mono text-fuchsia-400 uppercase tracking-widest">
          Email Digest
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setDigest("weekly");
              updateNotificationSetting("emailDigest", "weekly");
            }}
            className={cn(
              "flex-1 p-3 rounded-xl border transition-all text-left",
              digest === "weekly"
                ? "bg-fuchsia-600/10 border-fuchsia-500/50 text-white"
                : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10",
            )}
          >
            <div className="font-bold text-sm mb-1">Weekly Summary</div>
            <div className="text-xs opacity-60">
              Get a summary of high priority tasks.
            </div>
          </button>

          <button
            onClick={() => {
              setDigest("off");
              updateNotificationSetting("emailDigest", "off");
            }}
            className={cn(
              "flex-1 p-3 rounded-xl border transition-all text-left",
              digest === "off"
                ? "bg-white/10 border-white/20 text-white"
                : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10",
            )}
          >
            <div className="font-bold text-sm mb-1">Off</div>
            <div className="text-xs opacity-60">Don't send me emails.</div>
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsModal = ({ isOpen, onClose, initialTab = "account" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync internal state if initialTab changes when opening
  React.useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-[#0a0a0f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex h-[600px] max-h-[90vh]"
          >
            {/* Sidebar */}
            <div className="w-64 bg-black/20 border-r border-white/5 p-4 flex flex-col justify-between shrink-0">
              <div className="space-y-6">
                <div className="px-2 pt-2 pb-4">
                  <h2 className="text-lg font-clash font-bold text-white tracking-wide">
                    Signal Center
                  </h2>
                  <p className="text-xs text-white/30 font-mono">
                    CONFIGURATION v2.0
                  </p>
                </div>

                <div className="space-y-1">
                  <SidebarItem
                    icon={Settings}
                    label="Account Settings"
                    isActive={activeTab === "account"}
                    onClick={() => setActiveTab("account")}
                  />
                  <SidebarItem
                    icon={Shield}
                    label="Privacy & Data"
                    isActive={activeTab === "privacy"}
                    onClick={() => setActiveTab("privacy")}
                  />
                  <SidebarItem
                    icon={Bell}
                    label="Notifications"
                    isActive={activeTab === "notifications"}
                    onClick={() => setActiveTab("notifications")}
                  />
                </div>
              </div>

              <div className="px-2 pb-2">
                <div className="p-3 rounded-xl bg-gradient-to-br from-fuchsia-900/20 to-purple-900/20 border border-fuchsia-500/20">
                  <p className="text-xs text-fuchsia-200/60 leading-relaxed font-geist">
                    "Your digital signal is strong. Keep your frequencies
                    secure."
                  </p>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-white/[0.02] to-transparent">
              {activeTab === "account" && <AccountTab />}
              {activeTab === "privacy" && <PrivacyTab />}
              {activeTab === "notifications" && <NotificationsTab />}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/20 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;

