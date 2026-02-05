import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  Upload,
  Check,
  Github,
  Linkedin,
  Globe,
  Hash,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AVAILABLE_TAGS = [
  "#AI_ML",
  "#FULLSTACK",
  "#UI_UX",
  "#GAME_DEV",
  "#CYBERSEC",
  "#DATA_SCI",
  "#CLOUD",
  "#DEVOPS",
  "#BLOCKCHAIN",
  "#IOT",
  "#LEADERSHIP",
  "#DEBATE",
  "#ESPORTS",
  "#ROBOTICS",
  "#MUSIC",
  "#FINANCE",
  "#ENTREPRENEUR",
  "#PHOTOGRAPHY",
  "#WRITING",
];

// Reusable Glass Input
const GlassInput = ({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  textarea = false,
}) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-400">
      {Icon && <Icon className="w-3 h-3 text-fuchsia-500" />}
      {label}
    </label>
    {textarea ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-fuchsia-500/50 resize-none h-24 transition-colors placeholder:text-white/20"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-fuchsia-500/50 transition-colors placeholder:text-white/20"
      />
    )}
  </div>
);

// Tab Button
const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "relative px-4 py-2 text-sm font-medium transition-colors font-mono uppercase tracking-wider",
      active ? "text-white" : "text-white/40 hover:text-white/70",
    )}
  >
    {label}
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-fuchsia-500 shadow-[0_0_10px_rgba(192,38,211,0.5)]"
      />
    )}
  </button>
);

const EditProfileModal = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  initialTab = "identity",
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState(initialData);
  const [avatarPreview, setAvatarPreview] = useState(initialData?.avatar || "");
  const [coverPreview, setCoverPreview] = useState(
    initialData?.coverImage || "",
  );
  const [uploading, setUploading] = useState({ avatar: false, cover: false });

  // Refs for file inputs
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Sync with props
  useEffect(() => {
    // Normalize DNA tags to ensure they match the AVAILABLE_TAGS format (with #)
    const normalizedDna = (initialData?.dna || []).map((tag) =>
      tag.startsWith("#") ? tag : `#${tag}`,
    );
    // Remove duplicates
    const uniqueDna = [...new Set(normalizedDna)];

    setFormData({
      ...initialData,
      dna: uniqueDna,
    });
    setAvatarPreview(initialData?.avatar);
    setCoverPreview(initialData?.coverImage);
    setActiveTab(initialTab);
  }, [initialData, initialTab, isOpen]);

  // Handle Input Changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle Nested Link Changes
  const handleLinkChange = (network, value) => {
    setFormData((prev) => ({
      ...prev,
      links: { ...prev.links, [network]: value },
    }));
  };

  // DNA Tag Toggle
  const toggleTag = (tag) => {
    const currentTags = formData.dna || [];
    if (currentTags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        dna: currentTags.filter((t) => t !== tag),
      }));
    } else {
      if (currentTags.length >= 5) return;
      setFormData((prev) => ({ ...prev, dna: [...currentTags, tag] }));
    }
  };

  // Image Upload Logic (Ported)
  const handleImageUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading((prev) => ({ ...prev, [type]: true }));

    const fd = new FormData();
    fd.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const endpoint =
        type === "avatar"
          ? "http://localhost:5000/api/users/profile/avatar"
          : "http://localhost:5000/api/users/profile/cover";

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        const imageUrl = type === "avatar" ? data.avatar : data.coverImage;
        if (type === "avatar") setAvatarPreview(imageUrl);
        else setCoverPreview(imageUrl);

        // Update local form data
        setFormData((prev) => ({
          ...prev,
          [type === "avatar" ? "avatar" : "coverImage"]: imageUrl,
        }));
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  // Asset Upload Logic
  const handleAssetUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5000/api/users/profile/assets",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        },
      );

      const data = await res.json();

      if (res.ok) {
        setFormData((prev) => ({
          ...prev,
          assets: data.assets,
        }));
      }
    } catch (error) {
      console.error("Asset upload failed", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto z-[70] w-full max-w-2xl h-[85vh] md:h-auto bg-[#0a0a0f]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold font-clash text-white tracking-tight">
                Edit Profile
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 px-6 border-b border-white/5 bg-black/20">
              <TabButton
                label="Identity"
                active={activeTab === "identity"}
                onClick={() => setActiveTab("identity")}
              />
              <TabButton
                label="Visuals"
                active={activeTab === "visuals"}
                onClick={() => setActiveTab("visuals")}
              />
              <TabButton
                label="Assets"
                active={activeTab === "assets"}
                onClick={() => setActiveTab("assets")}
              />
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* === IDENTITY TAB === */}
              {activeTab === "identity" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <GlassInput
                      label="Call Sign"
                      value={formData.name || ""}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="e.g. Maverick"
                    />
                    <GlassInput
                      label="Mission Statement"
                      value={formData.bio || ""}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      placeholder="Brief manifesto (max 140 chars)..."
                      textarea
                      icon={FileText}
                    />
                  </div>

                  {/* Social Links */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h3 className="text-xs font-mono uppercase text-white/40">
                      Communication Uplinks
                    </h3>
                    <GlassInput
                      label="GitHub Protocol"
                      value={formData.links?.github || ""}
                      onChange={(e) =>
                        handleLinkChange("github", e.target.value)
                      }
                      placeholder="https://github.com/..."
                      icon={Github}
                    />
                    <GlassInput
                      label="LinkedIn Signal"
                      value={formData.links?.linkedin || ""}
                      onChange={(e) =>
                        handleLinkChange("linkedin", e.target.value)
                      }
                      placeholder="https://linkedin.com/in/..."
                      icon={Linkedin}
                    />
                    <GlassInput
                      label="Personal Frequency"
                      value={formData.links?.website || ""}
                      onChange={(e) =>
                        handleLinkChange("website", e.target.value)
                      }
                      placeholder="https://..."
                      icon={Globe}
                    />
                  </div>

                  {/* Skill Tree */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-400">
                        <Hash className="w-3 h-3 text-fuchsia-500" />
                        Skill Tree // DNA
                      </label>
                      <span className="text-[10px] font-mono text-white/30">
                        {(formData.dna || []).length}/5 EQUIPPED
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_TAGS.map((tag) => {
                        const isActive = (formData.dna || []).includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-mono border transition-all",
                              isActive
                                ? "bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-200 shadow-[0_0_10px_rgba(192,38,211,0.2)]"
                                : "bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:text-white/70",
                            )}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* === VISUALS TAB === */}
              {activeTab === "visuals" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  {/* Hidden Inputs */}
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={(e) => handleImageUpload(e, "avatar")}
                    className="hidden"
                    accept="image/*"
                  />
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={(e) => handleImageUpload(e, "cover")}
                    className="hidden"
                    accept="image/*"
                  />

                  {/* Avatar Uploader */}
                  <div className="flex items-center gap-6">
                    <div
                      className="relative w-24 h-24 rounded-full border-2 border-white/10 overflow-hidden bg-black/50 group cursor-pointer"
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      <img
                        src={avatarPreview}
                        className={cn(
                          "w-full h-full object-cover transition-opacity",
                          uploading.avatar && "opacity-50",
                        )}
                        alt="Avatar"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                      {uploading.avatar && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-spin w-6 h-6 border-2 border-white rounded-full border-t-transparent" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">
                        Avatar Identity
                      </h3>
                      <p className="text-sm text-white/40 mb-3">
                        Square ratio recommended. JPG, PNG or WEBP. Max 5MB.
                      </p>
                      <button
                        onClick={() => avatarInputRef.current?.click()}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors"
                      >
                        Upload New Avatar
                      </button>
                    </div>
                  </div>

                  {/* Cover Uploader */}
                  <div className="space-y-3">
                    <h3 className="text-white font-medium">
                      Atmospheric Cover
                    </h3>
                    <div
                      className="relative w-full h-40 rounded-xl border-2 border-white/10 overflow-hidden bg-black/50 group cursor-pointer"
                      onClick={() => coverInputRef.current?.click()}
                    >
                      <img
                        src={coverPreview}
                        className={cn(
                          "w-full h-full object-cover transition-opacity",
                          uploading.cover && "opacity-50",
                        )}
                        alt="Cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      {uploading.cover && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-spin w-8 h-8 border-2 border-white rounded-full border-t-transparent" />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-xs text-white/40">
                      <span>1920x1080 optimized. Max 10MB.</span>
                      <button
                        onClick={() => coverInputRef.current?.click()}
                        className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
                      >
                        Replace Image
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* === ASSETS TAB === */}
              {activeTab === "assets" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium">Decrypted Assets</h3>
                    <label className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors cursor-pointer flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Document
                      <input
                        type="file"
                        onChange={handleAssetUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                      />
                    </label>
                  </div>

                  <div className="space-y-3">
                    {(formData.assets || []).map((asset, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-black/40 text-fuchsia-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white/90">
                              {asset.name}
                            </div>
                            <div className="text-sm text-white/40 font-mono">
                              {asset.size} •{" "}
                              {new Date(asset.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(formData.assets || []).length === 0 && (
                      <div className="text-center py-8 text-white/30 text-sm italic">
                        No assets decrypted yet. Upload files to populate your
                        inventory.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(formData)}
                className="px-6 py-2 rounded-xl text-sm font-bold bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_4px_20px_rgba(192,38,211,0.3)] transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
